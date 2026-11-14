import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import type { PipeMaterial } from '../../types/pipe';
import { PipeSkeleton } from './PipeSkeleton';
import { getPipeVisual } from './pipeMaterials';

const materials: PipeMaterial[] = ['lead', 'copper', 'galvanized_steel', 'plastic'];

it.each(materials)('defines an unambiguous illustration and scratch for %s', (material) => {
  const visual = getPipeVisual(material);
  const scratch = visual.scratch!;
  expect(scratch.color).not.toBe(visual.body.color);
  expect(scratch.description).toBeTruthy();
  for (const surface of [visual.body, scratch]) {
    expect(surface.color).toMatch(/^#[0-9a-f]{6}$/i);
    for (const value of [surface.roughness, surface.metalness]) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  }
});

it('uses an inconclusive illustration for unknown or invalid pipe materials', () => {
  const unknown = getPipeVisual('unknown');
  expect(unknown.scratch).toBeNull();
  expect(getPipeVisual('constructor' as PipeMaterial)).toBe(unknown);
});

it('shows the scratch in the 2D fallback when the simulation is active', () => {
  const plain = renderToStaticMarkup(createElement(PipeSkeleton, { material: 'lead', scratched: false }));
  const scratched = renderToStaticMarkup(createElement(PipeSkeleton, { material: 'lead', scratched: true }));
  const scratchColor = getPipeVisual('lead').scratch?.color;
  expect(plain).toContain('2D illustration');
  expect(plain).not.toContain(`stroke="${scratchColor}"`);
  expect(scratched).toContain(`stroke="${scratchColor}"`);
});

import { describe, expect, it } from 'vitest';
import { analyzePipe } from './index';
import type { PipeAnalysisInput, PipeMaterial } from './index';
import { getDemoResult } from './demo';

const lead: PipeAnalysisInput = {
  pipeColor: 'dull-gray', magnetSticks: false, scratchColor: 'shiny-silver',
};

describe('supported material clues', () => {
  it.each<[PipeAnalysisInput, PipeMaterial]>([
    [lead, 'lead'],
    [{ ...lead, pipeColor: 'silver-gray' }, 'lead'],
    [{ pipeColor: 'reddish-brown', magnetSticks: false, scratchColor: 'copper-orange' }, 'copper'],
    [{ pipeColor: 'green', magnetSticks: false, scratchColor: 'copper-orange' }, 'copper'],
    [{ ...lead, magnetSticks: true }, 'galvanized-steel'],
    [{ ...lead, pipeColor: 'silver-gray', magnetSticks: true }, 'galvanized-steel'],
    [{ ...lead, pipeColor: 'rust-brown', magnetSticks: true }, 'galvanized-steel'],
  ])('classifies %j as %s', (input, expected) => {
    const result = analyzePipe(input);
    expect(result.likelyMaterial).toBe(expected);
    expect(result.mode).toBe('analysis');
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.needsMoreChecking).toBe(true);
    expect(result.nextSteps.join(' ')).toContain('certified laboratory');
    expect(result.disclaimer).toContain('Other plumbing may still contain lead');
  });
});

describe('insufficient, unsupported, or conflicting clues', () => {
  it('supports a call without input', () => {
    expect(analyzePipe().likelyMaterial).toBe('unknown');
  });

  it.each<PipeAnalysisInput>([
    {},
    { photo: new Blob(['sample'], { type: 'image/jpeg' }) },
    { pipeColor: 'dull-gray' },
    { magnetSticks: true },
    { scratchColor: 'shiny-silver' },
    { magnetSticks: false, scratchColor: 'shiny-silver' },
    { pipeColor: 'dull-gray', scratchColor: 'shiny-silver' },
    { pipeColor: 'dull-gray', magnetSticks: false },
    { ...lead, pipeColor: null },
    { ...lead, pipeColor: 'unknown' },
    { ...lead, scratchColor: null },
    { ...lead, scratchColor: 'unknown' },
    { ...lead, magnetSticks: null },
    { ...lead, pipeColor: 'other' },
    { ...lead, scratchColor: 'other' },
    { ...lead, scratchColor: 'copper-orange' },
    { ...lead, pipeColor: 'reddish-brown' },
    { ...lead, pipeColor: 'rust-brown' },
    { pipeColor: 'reddish-brown', magnetSticks: true, scratchColor: 'copper-orange' },
    { pipeColor: 'green', magnetSticks: true, scratchColor: 'shiny-silver' },
  ])('fails closed for %j', (input) => {
    const result = analyzePipe(input);
    expect(result.likelyMaterial).toBe('unknown');
    expect(result.needsMoreChecking).toBe(true);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.nextSteps.join(' ')).toContain('recheck');
  });

  it.each([
    null, 'lead',
    { ...lead, magnetSticks: 'false' },
    { ...lead, magnetSticks: 0 },
    { ...lead, pipeColor: 'blue' },
    { ...lead, scratchColor: 'silver' },
  ])('handles malformed runtime input without guessing: %j', (input) => {
    expect(analyzePipe(input as unknown as PipeAnalysisInput).likelyMaterial).toBe('unknown');
  });
});

describe('safe result contract', () => {
  it('accepts a photo without claiming to analyze it or changing the material', () => {
    const withoutPhoto = analyzePipe(lead);
    const withPhoto = analyzePipe({ ...lead, photo: new Blob(['sample']) });
    expect(withPhoto.likelyMaterial).toBe(withoutPhoto.likelyMaterial);
    expect(withPhoto.photoAnalysis).toBe('not-analyzed');
    expect(withPhoto.reasons.join(' ')).toContain('no trained image-recognition model');
    expect(withPhoto).not.toHaveProperty('photo');
    expect(withoutPhoto.photoAnalysis).toBe('not-provided');
    expect(analyzePipe({ ...lead, photo: null }).photoAnalysis).toBe('not-provided');
  });

  it('does not mutate observations and returns independent results', () => {
    const input = Object.freeze({ ...lead });
    const result = analyzePipe(input);
    result.nextSteps.length = 0;
    result.reasons.length = 0;
    expect(analyzePipe(input).nextSteps.length).toBeGreaterThan(0);
    expect(analyzePipe(input).reasons.length).toBeGreaterThan(0);
    expect(input).toEqual(lead);
  });

  it('provides lead precautions and replacement guidance', () => {
    const steps = analyzePipe(lead).nextSteps.join(' ');
    expect(steps).toContain('NSF/ANSI 53 or 58');
    expect(steps).toContain('boiling does not remove lead');
    expect(steps).toContain('replacement');
  });

  it('warns about lead retained by galvanized plumbing', () => {
    expect(analyzePipe({ ...lead, magnetSticks: true }).nextSteps.join(' '))
      .toContain('retain and release lead');
  });

  it('does not equate copper with safe water', () => {
    const result = analyzePipe({ pipeColor: 'green', magnetSticks: false, scratchColor: 'copper-orange' });
    expect(result.needsMoreChecking).toBe(true);
    expect(result.nextSteps.join(' ')).toContain('pipe appearance cannot establish water safety');
  });
});

describe('separate demo mode', () => {
  it.each<PipeMaterial>(['lead', 'copper', 'galvanized-steel', 'unknown'])(
    'labels the %s example as a sample', (material) => {
      const result = getDemoResult(material);
      expect(result.mode).toBe('demo');
      expect(result.label).toContain('DEMO');
      expect(result.label).toContain('not an analysis of your home');
      expect(result.likelyMaterial).toBe(material);
      expect(result.needsMoreChecking).toBe(true);
      expect(analyzePipe(result.sampleInput).likelyMaterial).toBe(material);
    },
  );

  it('does not substitute demo observations for missing user input', () => {
    getDemoResult('lead');
    expect(analyzePipe({}).likelyMaterial).toBe('unknown');
    expect(analyzePipe({}).mode).toBe('analysis');
  });
});

import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('the root page mounts the React app without the legacy static scripts', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

  expect(html).toContain('<div id="root"></div>');
  expect(html).toMatch(/<script type="module" src="\/src\/main\.tsx"><\/script>/);
  expect(html).not.toMatch(/<script[^>]+src=["'](?:\.\/|\/)?js\//);
});

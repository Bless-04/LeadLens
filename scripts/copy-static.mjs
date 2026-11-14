import { cpSync } from 'node:fs';

// Vite processes the stylesheet, but leaves classic script tags unchanged.
// Preserve their paths and execution order in the production output.
cpSync(new URL('../js/', import.meta.url), new URL('../dist/js/', import.meta.url), {
  recursive: true,
});

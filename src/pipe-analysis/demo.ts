import { analyzePipe } from './analyzePipe';
import type { PipeAnalysisInput, PipeAnalysisResult, PipeMaterial } from './types';

export type DemoResult = Omit<PipeAnalysisResult, 'mode'> & {
  mode: 'demo';
  label: 'DEMO — sample observations, not an analysis of your home';
  sampleInput: PipeAnalysisInput;
};

/** Explicit demo entry point. Never used as a fallback for real input. */
export function getDemoResult(material: PipeMaterial): DemoResult {
  const samples: Record<PipeMaterial, PipeAnalysisInput> = {
    lead: { pipeColor: 'dull-gray', magnetSticks: false, scratchColor: 'shiny-silver' },
    copper: { pipeColor: 'reddish-brown', magnetSticks: false, scratchColor: 'copper-orange' },
    'galvanized-steel': { pipeColor: 'silver-gray', magnetSticks: true, scratchColor: 'shiny-silver' },
    unknown: {},
  };
  const sampleInput = samples[material];
  if (!sampleInput) throw new Error('Unsupported demo material');
  return {
    ...analyzePipe(sampleInput), mode: 'demo',
    label: 'DEMO — sample observations, not an analysis of your home', sampleInput,
  };
}

export type PipeMaterial = 'lead' | 'copper' | 'galvanized-steel' | 'unknown';

export const PIPE_COLORS = [
  'dull-gray', 'silver-gray', 'reddish-brown', 'green', 'rust-brown', 'other', 'unknown',
] as const;
export type PipeColor = (typeof PIPE_COLORS)[number];

export const SCRATCH_COLORS = ['shiny-silver', 'copper-orange', 'other', 'unknown'] as const;
export type ScratchColor = (typeof SCRATCH_COLORS)[number];

export interface PipeAnalysisInput {
  /** Accepted for frontend integration only. Never analyzed, uploaded, or retained. */
  photo?: Blob | null;
  pipeColor?: PipeColor | null;
  /** User reports a physical magnet test; no phone sensor is read. */
  magnetSticks?: boolean | null;
  scratchColor?: ScratchColor | null;
}

export interface PipeAnalysisResult {
  mode: 'analysis';
  likelyMaterial: PipeMaterial;
  reasons: string[];
  /** Always true: visual clues cannot certify material or water safety. */
  needsMoreChecking: boolean;
  nextSteps: string[];
  photoAnalysis: 'not-provided' | 'not-analyzed';
  disclaimer: string;
}

export type PipeMaterial = 'lead' | 'copper' | 'galvanized_steel' | 'plastic' | 'unknown';

export type RiskLevel = 'high' | 'moderate' | 'low' | 'unknown';

export type MagnetResponse = 'sticks' | 'does_not_stick' | 'not_tested';

export type ScratchColorResponse = 
  | 'shiny_silver' 
  | 'copper_penny' 
  | 'dull_grey_hard' 
  | 'white_colored_plastic'
  | 'not_tested';

export type PipeExteriorColor = 
  | 'dull_grey' 
  | 'copper_brown' 
  | 'dark_grey_matte' 
  | 'white_or_blue_plastic' 
  | 'painted_or_unsure';

export interface PipeCheckAnswers {
  exteriorColor: PipeExteriorColor;
  magnetSticks: MagnetResponse;
  scratchResult: ScratchColorResponse;
  homeBuiltBefore1986?: boolean | 'unsure';
  pipePhotoUrl?: string;
  isDemo?: boolean;
}

export interface PipeAnalysisResult {
  material: PipeMaterial;
  materialName: string;
  riskLevel: RiskLevel;
  confidence: 'high' | 'medium' | 'low';
  title: string;
  summary: string;
  reasons: string[];
  disclaimer: string;
  immediateActions: string[];
  confirmatorySteps: string[];
  filterRecommendations: string;
  utilityNextSteps: string;
  isDemo: boolean;
}

export interface DemoScenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  answers: PipeCheckAnswers;
  expectedMaterial: PipeMaterial;
}

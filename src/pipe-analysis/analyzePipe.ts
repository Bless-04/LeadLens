import { PIPE_COLORS, SCRATCH_COLORS } from './types';
import type { PipeAnalysisInput, PipeAnalysisResult, PipeMaterial } from './types';

export const SAFETY_DISCLAIMER =
  'This is a preliminary assessment of the observed pipe segment, not a material certification or a water-quality test. A phone camera cannot detect lead in water. Other plumbing may still contain lead.';

const COMMON_STEPS = [
  'Ask your water utility or a licensed plumber to confirm the service-line material and check utility records, including both sides of the service line.',
  'For drinking-water lead levels, contact your utility or a certified laboratory about a water test; pipe appearance cannot establish water safety.',
];

function nextSteps(material: PipeMaterial): string[] {
  const steps = [...COMMON_STEPS];
  if (material === 'lead' || material === 'unknown' || material === 'galvanized-steel') {
    steps.push(
      'Until confirmed, use a filter certified for lead reduction (NSF/ANSI 53 or 58) and follow its replacement instructions. Use cold water for drinking and cooking; boiling does not remove lead.',
    );
  }
  if (material === 'lead') {
    steps.push('Ask your utility about lead service-line replacement and available financial assistance.');
  } else if (material === 'galvanized-steel') {
    steps.push('Ask whether the galvanized line is or was downstream of lead: galvanized pipes can retain and release lead.');
  } else if (material === 'unknown') {
    steps.push('If safe and permitted by utility guidance, recheck an accessible, unpainted section with a physical magnet. Do not scrape painted, corroded, fragile, or inaccessible plumbing; ask a professional for help.');
  }
  return steps;
}

/** Pure, local rules. No network requests, trained vision model, or sensor access. */
export function analyzePipe(input: PipeAnalysisInput = {}): PipeAnalysisResult {
  // Also fail closed for malformed data arriving from JS, forms, or storage.
  const data = input && typeof input === 'object' ? input : {};
  const reasons: string[] = [];
  let likelyMaterial: PipeMaterial = 'unknown';
  const color = data.pipeColor;
  const scratch = data.scratchColor;
  const magnet = data.magnetSticks;
  const invalid =
    (color != null && !PIPE_COLORS.includes(color)) ||
    (scratch != null && !SCRATCH_COLORS.includes(scratch)) ||
    (magnet != null && typeof magnet !== 'boolean');
  const missing = color == null || color === 'unknown' ||
    scratch == null || scratch === 'unknown' || typeof magnet !== 'boolean';

  if (invalid) {
    reasons.push('One or more observations are invalid. Select the listed color options and report the magnet test as yes, no, or unknown.');
  } else if (missing) {
    reasons.push('There is insufficient evidence: a known pipe color, scratch color, and physical magnet result are all required.');
  } else if (color === 'other' || scratch === 'other') {
    reasons.push('The reported appearance is outside the supported clues. Paint, coatings, corrosion, or a different material can obscure identification.');
  } else {
    const gray = color === 'dull-gray' || color === 'silver-gray';
    const copperColor = color === 'reddish-brown' || color === 'green';
    if (!magnet && gray && scratch === 'shiny-silver') {
      likelyMaterial = 'lead';
      reasons.push('A gray surface with a shiny silver scratch and no magnet attraction is consistent with lead.',
        'Other nonmagnetic metals can share these clues, so lead is suspected rather than confirmed.');
    } else if (!magnet && copperColor && scratch === 'copper-orange') {
      likelyMaterial = 'copper';
      reasons.push('Copper commonly appears reddish brown or develops a green patina.',
        'A copper-orange scratch and no magnet attraction support copper.');
    } else if (magnet && (gray || color === 'rust-brown') && scratch === 'shiny-silver') {
      likelyMaterial = 'galvanized-steel';
      reasons.push('Magnet attraction supports a ferrous pipe such as steel.',
        'A gray or rusty surface with a silver scratch is consistent with galvanized steel, but does not confirm the coating.');
    } else {
      reasons.push('The observations conflict with the supported material patterns. Do not choose a material from a single clue; recheck or seek professional identification.');
    }
  }

  const photoAnalysis = data.photo == null ? 'not-provided' : 'not-analyzed';
  if (photoAnalysis === 'not-analyzed') {
    reasons.push('The photo was not analyzed: no trained image-recognition model is connected. It did not affect this result.');
  }
  return {
    mode: 'analysis', likelyMaterial, reasons, needsMoreChecking: true,
    nextSteps: nextSteps(likelyMaterial), photoAnalysis, disclaimer: SAFETY_DISCLAIMER,
  };
}

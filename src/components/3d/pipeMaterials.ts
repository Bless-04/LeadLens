import type { PipeMaterial } from '../../types/pipe';

interface Surface {
  color: string;
  metalness: number;
  roughness: number;
}

interface PipeVisualConfig {
  label: string;
  body: Surface;
  detail: string;
  scratch: (Surface & { description: string }) | null;
}

export const PIPE_MATERIAL_CONFIGS: Readonly<Record<PipeMaterial, PipeVisualConfig>> = {
  lead: {
    label: 'Lead',
    body: { color: '#6b7280', metalness: 0.55, roughness: 0.8 },
    detail: '#525966',
    scratch: { color: '#e2e8f0', metalness: 0.98, roughness: 0.12, description: 'A dull gray surface reveals shiny silver metal.' },
  },
  copper: {
    label: 'Copper',
    body: { color: '#95552f', metalness: 0.55, roughness: 0.72 },
    detail: '#63361f',
    scratch: { color: '#ed955c', metalness: 0.9, roughness: 0.25, description: 'The dull reddish-brown surface reveals a bright, penny-orange streak.' },
  },
  galvanized_steel: {
    label: 'Galvanized steel',
    body: { color: '#94a3b8', metalness: 0.85, roughness: 0.45 },
    detail: '#66778b',
    scratch: { color: '#cbd5e1', metalness: 0.85, roughness: 0.5, description: 'The scraped surface remains dull silver-gray.' },
  },
  plastic: {
    label: 'Plastic (PVC/PEX)',
    body: { color: '#f8fafc', metalness: 0, roughness: 0.45 },
    detail: '#bfcfdb',
    scratch: { color: '#ffffff', metalness: 0, roughness: 0.35, description: 'The scratch leaves a shallow, matte plastic groove.' },
  },
  unknown: {
    label: 'Unknown material',
    body: { color: '#475569', metalness: 0.4, roughness: 0.6 },
    detail: '#263549',
    scratch: null,
  },
};

export function getPipeVisual(material: PipeMaterial) {
  return Object.prototype.hasOwnProperty.call(PIPE_MATERIAL_CONFIGS, material)
    ? PIPE_MATERIAL_CONFIGS[material]
    : PIPE_MATERIAL_CONFIGS.unknown;
}

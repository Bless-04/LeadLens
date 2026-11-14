import type { PipeMaterial, RiskLevel } from '../types/pipe';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Inspection extends Coordinates {
  id: string;
  address: string;
  material: PipeMaterial;
  riskLevel: RiskLevel;
}

export const materialLabels: Record<PipeMaterial, string> = {
  lead: 'Possible lead',
  copper: 'Likely copper',
  galvanized_steel: 'Likely galvanized steel',
  plastic: 'Likely plastic',
  unknown: 'Unknown material',
};

const storageKey = 'leadlens.inspections.v1';

export function readInspections(): Inspection[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    if (!Array.isArray(data)) return [];
    return data.filter((item) => item && typeof item.id === 'string'
      && typeof item.address === 'string' && Number.isFinite(item.latitude) && Math.abs(item.latitude) <= 90
      && Number.isFinite(item.longitude) && Math.abs(item.longitude) <= 180
      && Object.prototype.hasOwnProperty.call(materialLabels, item.material)
      && ['high', 'moderate', 'low', 'unknown'].includes(item.riskLevel));
  } catch {
    return [];
  }
}

export function saveInspection(inspection: Inspection) {
  const inspections = [inspection, ...readInspections()];
  localStorage.setItem(storageKey, JSON.stringify(inspections));
}

import { beforeEach, describe, expect, it } from 'vitest';
import { readInspections, saveInspection, type Inspection } from './inspections';

class LocalStorageMock {
  private store: Record<string, string> = {};
  clear() {
    this.store = {};
  }
  getItem(key: string) {
    return this.store[key] ?? null;
  }
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
  removeItem(key: string) {
    delete this.store[key];
  }
}

describe('inspections storage service', () => {
  beforeEach(() => {
    const mock = new LocalStorageMock();
    Object.defineProperty(globalThis, 'localStorage', {
      value: mock,
      writable: true,
      configurable: true,
    });
  });

  it('returns empty array when no inspections are stored', () => {
    expect(readInspections()).toEqual([]);
  });

  it('saves and reads valid inspection records', () => {
    const inspection: Inspection = {
      id: 'test-123',
      address: '123 Main St, Baltimore, MD',
      latitude: 39.2904,
      longitude: -76.6122,
      material: 'lead',
      riskLevel: 'high',
    };

    saveInspection(inspection);
    const stored = readInspections();
    expect(stored).toHaveLength(1);
    expect(stored[0]).toEqual(inspection);
  });

  it('prepends newest inspection to the list', () => {
    const first: Inspection = {
      id: 'insp-1',
      address: '100 North Ave',
      latitude: 39.31,
      longitude: -76.62,
      material: 'copper',
      riskLevel: 'low',
    };
    const second: Inspection = {
      id: 'insp-2',
      address: '200 South Ave',
      latitude: 39.28,
      longitude: -76.60,
      material: 'galvanized_steel',
      riskLevel: 'moderate',
    };

    saveInspection(first);
    saveInspection(second);

    const stored = readInspections();
    expect(stored).toHaveLength(2);
    expect(stored[0].id).toBe('insp-2');
    expect(stored[1].id).toBe('insp-1');
  });

  it('filters out corrupted items in storage gracefully', () => {
    localStorage.setItem('leadlens.inspections.v1', JSON.stringify([
      { id: 'valid', address: 'Valid St', latitude: 39.2, longitude: -76.6, material: 'lead', riskLevel: 'high' },
      { id: 123, invalid: true }, // invalid
      null,
      { id: 'bad-coord', address: 'Bad', latitude: 999, longitude: 0, material: 'lead', riskLevel: 'high' },
    ]));

    const result = readInspections();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('valid');
  });

  it('handles invalid JSON gracefully', () => {
    localStorage.setItem('leadlens.inspections.v1', 'not-valid-json');
    expect(readInspections()).toEqual([]);
  });
});

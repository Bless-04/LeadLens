import { Component, lazy, Suspense, useId, useState, type ReactNode } from 'react';
import type { PipeMaterial } from '../../types/pipe';
import { PipeSkeleton } from './PipeSkeleton';
import { getPipeVisual } from './pipeMaterials';

const PipeViewer3D = lazy(() => import('./PipeViewer3D'));
const samples: PipeMaterial[] = ['lead', 'copper', 'galvanized_steel', 'plastic'];

class PipeViewerBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function PipeModelCard({ resultMaterial }: { resultMaterial?: PipeMaterial }) {
  const [sample, setSample] = useState<PipeMaterial>('lead');
  const [scratched, setScratched] = useState(false);
  const titleId = useId();
  const material = resultMaterial ?? sample;
  const visual = getPipeVisual(material);
  const showScratch = Boolean(scratched && visual.scratch);

  return (
    <section aria-labelledby={titleId} className="space-y-3 rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <h2 id={titleId} className="font-bold text-slate-900">{resultMaterial === undefined ? 'Compare pipe materials' : 'Pipe material illustration'}</h2>
        <p className="mt-1 text-xs text-slate-600">An illustrative sample for comparing surfaces. Your pipe check is based on your observations.</p>
      </div>

      {resultMaterial === undefined ? (
        <label className="block space-y-1 text-sm font-semibold text-slate-800">
          <span>Pipe material</span>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            value={sample}
            onChange={(event) => {
              setSample(event.target.value as PipeMaterial);
              setScratched(false);
            }}
          >
            {samples.map((option) => <option key={option} value={option}>{getPipeVisual(option).label}</option>)}
          </select>
        </label>
      ) : <p className="text-sm font-semibold text-slate-800">{visual.label}</p>}

      <PipeViewerBoundary fallback={<PipeSkeleton material={material} scratched={showScratch} />}>
        <Suspense fallback={<PipeSkeleton material={material} scratched={showScratch} loading />}>
          <PipeViewer3D material={material} scratched={showScratch} />
        </Suspense>
      </PipeViewerBoundary>

      {visual.scratch ? (
        <div className="space-y-2">
          <button
            type="button"
            aria-pressed={showScratch}
            onClick={() => setScratched(!scratched)}
            className="w-full rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 aria-pressed:bg-slate-700"
          >
            Simulate coin scratch
          </button>
          <p aria-live="polite" className="text-sm text-slate-700">
            {showScratch ? visual.scratch.description : 'Turn on the simulation to reveal the surface below.'}
          </p>
        </div>
      ) : <p className="text-sm text-slate-700">There’s no representative scratch pattern for an inconclusive result. Compare known materials in the Learn tab.</p>}
    </section>
  );
}

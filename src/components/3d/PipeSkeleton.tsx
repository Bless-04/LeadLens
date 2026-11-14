import { useId } from 'react';
import type { PipeMaterial } from '../../types/pipe';
import { getPipeVisual } from './pipeMaterials';

export interface PipeIllustrationProps {
  material: PipeMaterial;
  scratched: boolean;
}

export function PipeSkeleton({ material, scratched, loading = false }: PipeIllustrationProps & { loading?: boolean }) {
  const id = useId();
  const visual = getPipeVisual(material);

  return (
    <div className="relative grid h-60 place-items-center overflow-hidden rounded-xl bg-slate-900">
      <svg viewBox="0 0 160 200" className={`h-48 w-40 ${loading ? 'motion-safe:animate-pulse' : ''}`} aria-hidden="true">
        <defs>
          <linearGradient id={id}>
            <stop stopColor={visual.detail} />
            <stop offset=".42" stopColor={visual.body.color} />
            <stop offset="1" stopColor={visual.detail} />
          </linearGradient>
        </defs>
        <ellipse cx="80" cy="185" rx="42" ry="7" fill="#020617" opacity=".55" />
        <path d="M47 30h66v136c0 18-66 18-66 0Z" fill={`url(#${id})`} />
        <ellipse cx="80" cy="30" rx="33" ry="15" fill={visual.body.color} />
        <ellipse cx="80" cy="30" rx="26" ry="10" fill="#1e293b" />
        <path d="M47 50c9 10 55 10 66 0m-66 105c9 10 55 10 66 0" fill="none" stroke={visual.detail} strokeWidth="4" />
        {scratched && visual.scratch && (
          <path d="m65 109 27-14m-23 18 26-15m-23 6 25-14" stroke={visual.scratch.color} strokeWidth="2.5" strokeLinecap="round" />
        )}
      </svg>
      <p role="status" className="absolute bottom-2 right-3 text-xs text-slate-300">
        {loading ? 'Loading 3D preview…' : '2D illustration'}
      </p>
    </div>
  );
}

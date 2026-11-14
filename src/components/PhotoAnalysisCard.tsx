import { useState } from 'react';
import type { PipePhotoAnalysis } from '../types/pipe';
import { materialLabels } from '../services/inspections';

async function prepareJpeg(photoUrl: string) {
  const image = new Image();
  image.src = photoUrl;
  await image.decode();
  const scale = Math.min(1, 1280 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Photo conversion is unavailable on this device.');
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
}

export function PhotoAnalysisCard({ photoUrl }: { photoUrl: string }) {
  const [result, setResult] = useState<PipePhotoAnalysis>();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function analyze() {
    setPending(true);
    setError('');
    try {
      const image = await prepareJpeg(photoUrl).catch(() => {
        throw new Error('This photo could not be opened. Try a JPEG or PNG.');
      });
      const response = await fetch('/api/analyze-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data) throw new Error(data?.error || 'Photo analysis is unavailable.');
      setResult(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Photo analysis is unavailable.');
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
      <h2 className="font-bold text-slate-900">AI photo assessment</h2>
      <p className="text-slate-600">Photo analysis sends your image to Google Gemini. Use the physical tests to assess pipe material.</p>
      {result ? (
        <div aria-live="polite" className="space-y-1">
          <p className="font-semibold">{materialLabels[result.material]} · {Math.round(result.confidence * 100)}% model-reported confidence</p>
          <p className="text-slate-700">{result.reasoning}</p>
        </div>
      ) : (
        <button type="button" disabled={pending} onClick={analyze} className="rounded-lg bg-brand-700 px-3 py-2 font-semibold text-white disabled:opacity-50">
          {pending ? 'Analyzing photo…' : 'Analyze photo with Gemini'}
        </button>
      )}
      {error && <p role="alert" className="text-rose-700">{error}</p>}
    </section>
  );
}

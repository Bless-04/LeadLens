import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { saveInspection, type Coordinates } from '../services/inspections';
import type { PipeAnalysisResult } from '../types/pipe';

const fieldClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm';
const buttonClass = 'rounded-lg bg-slate-100 px-3 py-2 font-semibold text-slate-900 disabled:opacity-50';
const InspectionMap = lazy(() => import('./InspectionMap'));

interface InspectionLocationCardProps {
  result: PipeAnalysisResult;
  onSaved: () => void;
}

export function InspectionLocationCard({ result, onSaved }: InspectionLocationCardProps) {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<Coordinates>();
  const [showMap, setShowMap] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const lookup = useRef<AbortController | null>(null);
  useEffect(() => () => lookup.current?.abort(), []);

  function pickLocation(point: Coordinates) {
    lookup.current?.abort();
    setPending(false);
    setCoordinates(point);
    setMessage('Map location selected.');
    setShowMap(false);
  }

  async function locate() {
    if (!navigator.geolocation) {
      setMessage('Location is unavailable. Choose a point on the map.');
      return;
    }
    lookup.current?.abort();
    const controller = new AbortController();
    lookup.current = controller;
    setPending(true);
    setMessage('');
    try {
      const point = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => resolve(coords), reject, { timeout: 10_000, maximumAge: 30_000 },
        );
      });
      if (controller.signal.aborted) return;
      const location = { latitude: point.latitude, longitude: point.longitude };
      setCoordinates(location);
      const response = await fetch('/api/reverse-geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(location),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => null);
      if (controller.signal.aborted) return;
      if (!response.ok || !data?.address) {
        setMessage(data?.error || 'No address found for this location. Enter the address manually.');
        return;
      }
      setAddress(data.address);
      setMessage('Check that the suggested address is correct before saving.');
    } catch {
      if (!controller.signal.aborted) setMessage('Location or address lookup failed. You can enter the address and choose a point on the map.');
    } finally {
      if (!controller.signal.aborted) setPending(false);
    }
  }

  function save() {
    if (!coordinates) return;
    try {
      saveInspection({
        ...coordinates,
        id: crypto.randomUUID(),
        address: address.trim(),
        material: result.material,
        riskLevel: result.riskLevel,
      });
    } catch {
      setMessage('This browser could not save the inspection pin.');
      return;
    }
    onSaved();
  }

  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
      <h2 className="font-bold text-slate-900">Add this check to your map</h2>
      <p className="text-slate-600">Address lookup sends your coordinates to the configured geocoder. Saved pins stay in this browser.</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={locate} disabled={pending}>
          {pending ? 'Finding address…' : 'Use my location'}
        </button>
        <button type="button" className={buttonClass} aria-expanded={showMap} onClick={() => setShowMap(!showMap)}>
          {showMap ? 'Close map' : 'Choose point on map'}
        </button>
      </div>
      {showMap && (
        <>
          <p className="text-slate-600">Tap a point to place the pin. You can also enter latitude and longitude below.</p>
          <Suspense fallback={<p role="status">Loading map…</p>}>
            <InspectionMap onPickLocation={pickLocation} />
          </Suspense>
          <CoordinateFields onPick={pickLocation} />
        </>
      )}
      <label className="block space-y-1 font-medium">
        <span>Street address (optional)</span>
        <input className={fieldClass} value={address} maxLength={400} onChange={(event) => setAddress(event.target.value)} disabled={pending} />
      </label>
      {coordinates && <p className="text-xs text-slate-600">Pin at {coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}</p>}
      {message && <p role="status" className="text-slate-700">{message}</p>}
      <button type="button" onClick={save} disabled={!coordinates || pending} className="rounded-lg bg-brand-700 px-3 py-2 font-semibold text-white disabled:opacity-50">
        Save inspection pin
      </button>
    </section>
  );
}

function CoordinateFields({ onPick }: { onPick: (coordinates: Coordinates) => void }) {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const lat = Number(latitude);
  const lon = Number(longitude);
  const valid = latitude.trim() && longitude.trim() && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;

  return (
    <div className="flex flex-wrap items-end gap-2">
      <label className="min-w-24 flex-1">Latitude<input className={fieldClass} inputMode="decimal" value={latitude} onChange={(event) => setLatitude(event.target.value)} /></label>
      <label className="min-w-24 flex-1">Longitude<input className={fieldClass} inputMode="decimal" value={longitude} onChange={(event) => setLongitude(event.target.value)} /></label>
      <button type="button" className={buttonClass} disabled={!valid} onClick={() => onPick({ latitude: lat, longitude: lon })}>Use coordinates</button>
    </div>
  );
}

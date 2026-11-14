import { lazy, Suspense, useEffect, useId, useRef, useState } from 'react';
import { saveInspection, type Coordinates } from '../services/inspections';
import type { PipeAnalysisResult } from '../types/pipe';

const fieldClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm';
const buttonClass = 'rounded-lg bg-slate-100 px-3 py-2 font-semibold text-slate-900 disabled:opacity-50';
const InspectionMap = lazy(() => import('./InspectionMap'));
type AddressSuggestion = Coordinates & { address: string };

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
  const [locationError, setLocationError] = useState('');
  const [addressQuery, setAddressQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [usesGeoapify, setUsesGeoapify] = useState(false);
  const [suggestionMessage, setSuggestionMessage] = useState('');
  const locationErrorId = useId();
  const addressInput = useRef<HTMLInputElement>(null);
  const addressSetPin = useRef(false);
  const lookup = useRef<AbortController | null>(null);
  useEffect(() => () => lookup.current?.abort(), []);
  useEffect(() => {
    const query = addressQuery.trim().replace(/\s+/g, ' ');
    if (query.length < 3 || !/[A-Z]/i.test(query)) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch('/api/address-suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Address lookup failed');
        const { suggestions: matches, provider }: { suggestions: AddressSuggestion[]; provider?: string } = await response.json();
        if (controller.signal.aborted) return;
        setSuggestions(matches);
        setUsesGeoapify(provider === 'geoapify');
        if (!matches.length) setSuggestionMessage('No matching addresses. You can enter the address manually.');
      } catch {
        if (!controller.signal.aborted) setSuggestionMessage('Address suggestions are unavailable. You can enter the address manually.');
      }
    }, 350);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [addressQuery]);

  function clearSuggestions() {
    setAddressQuery('');
    setSuggestions([]);
    setSuggestionMessage('');
  }

  function pickLocation(point: Coordinates) {
    addressSetPin.current = false;
    lookup.current?.abort();
    setPending(false);
    setCoordinates(point);
    setLocationError('');
    setMessage('Map location selected.');
    setShowMap(false);
  }

  async function locate() {
    if (!navigator.geolocation) {
      setLocationError('Location access is unavailable. Open LeadLens over HTTPS in a browser that supports location, or choose a point on the map.');
      return;
    }
    clearSuggestions();
    lookup.current?.abort();
    const controller = new AbortController();
    lookup.current = controller;
    setPending(true);
    setMessage('');
    setLocationError('');
    try {
      const point = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => resolve(coords), reject, { timeout: 10_000, maximumAge: 30_000 },
        );
      });
      if (controller.signal.aborted) return;
      const location = { latitude: point.latitude, longitude: point.longitude };
      addressSetPin.current = false;
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
    } catch (error) {
      if (controller.signal.aborted) return;
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 1) {
        setLocationError('Location access is blocked. In your browser’s site settings, allow Location for LeadLens. If device location is off, turn it on, then tap Use my location again.');
      } else {
        setMessage('Location or address lookup failed. You can enter the address and choose a point on the map.');
      }
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
      <p className="text-slate-600">Location and address searches send your input to a geocoder. Saved pins stay in this browser.</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={locate} disabled={pending} aria-describedby={locationError ? locationErrorId : undefined}>
          {pending ? 'Finding address…' : 'Use my location'}
        </button>
        <button type="button" className={buttonClass} aria-expanded={showMap} onClick={() => setShowMap(!showMap)}>
          {showMap ? 'Close map' : 'Choose point on map'}
        </button>
      </div>
      {locationError && <p id={locationErrorId} role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-rose-800">{locationError}</p>}
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
        <input
          ref={addressInput}
          className={fieldClass}
          value={address}
          maxLength={400}
          autoComplete="off"
          placeholder="e.g. Calvert or 100 North Calvert"
          onChange={(event) => {
            const value = event.target.value;
            if (addressSetPin.current) {
              setCoordinates(undefined);
              setMessage('');
              addressSetPin.current = false;
            }
            setAddress(value);
            setAddressQuery(value);
            setSuggestions([]);
            setSuggestionMessage('');
          }}
          onKeyDown={(event) => { if (event.key === 'Escape') clearSuggestions(); }}
          disabled={pending}
        />
      </label>
      {suggestions.length > 0 && (
        <ul aria-label="Address suggestions" className="divide-y divide-slate-200 rounded-lg border border-slate-200">
          {suggestions.map((suggestion) => (
            <li key={suggestion.address}>
              <button type="button" className="w-full px-3 py-2 text-left hover:bg-slate-100 focus-visible:bg-slate-100" onClick={() => {
                setAddress(suggestion.address);
                pickLocation(suggestion);
                addressSetPin.current = true;
                clearSuggestions();
                addressInput.current?.focus();
              }}>{suggestion.address}</button>
            </li>
          ))}
        </ul>
      )}
      {suggestionMessage && <p role="status" className="text-xs text-slate-600">{suggestionMessage}</p>}
      {usesGeoapify && <p className="text-xs text-slate-600">Address data from <a className="underline" href="https://www.geoapify.com/">Geoapify</a> and <a className="underline" href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>.</p>}
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

import { useState } from 'react';
import InspectionMap from '../components/InspectionMap';
import { materialLabels, readInspections } from '../services/inspections';

export default function MapScreen() {
  const [inspections] = useState(readInspections);

  return (
    <div className="space-y-4 pb-24">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Baltimore inspection map</h1>
        <p className="mt-1 text-sm text-slate-600">Your pipe checks are saved in this browser. Pin colors show the pipe check's estimated risk.</p>
      </div>
      <InspectionMap inspections={inspections} />
      <ul aria-label="Map legend" className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-700">
        <li><span className="mr-1 text-rose-700">●</span>High risk</li>
        <li><span className="mr-1 text-amber-700">●</span>Moderate risk</li>
        <li><span className="mr-1 text-emerald-700">●</span>Low pipe risk</li>
        <li><span className="mr-1 text-slate-600">●</span>Inconclusive</li>
      </ul>
      {inspections.length ? (
        <ul aria-label="Saved pipe checks" className="space-y-2">
          {inspections.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
              <strong>{materialLabels[item.material]}</strong>
              <p className="text-slate-600">{item.address || `${item.latitude.toFixed(5)}, ${item.longitude.toFixed(5)}`}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-600">Complete a pipe check to add your first pin.</p>
      )}
      <a href="https://service-line-partnership-baltimoredpw.hub.arcgis.com/" className="inline-block text-sm font-semibold text-brand-700 underline">
        Official Baltimore service line inventory and reporting
      </a>
    </div>
  );
}

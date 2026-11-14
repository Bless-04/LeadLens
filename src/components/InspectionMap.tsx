import { useEffect, useRef } from 'react';
import { divIcon, map, marker, tileLayer } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { materialLabels, type Coordinates, type Inspection } from '../services/inspections';

const baltimore = { latitude: 39.2904, longitude: -76.6122 };
const colors = {
  high: '#be123c',
  moderate: '#b45309',
  low: '#047857',
  unknown: '#475569',
};

interface InspectionMapProps {
  inspections?: Inspection[];
  onPickLocation?: (coordinates: Coordinates) => void;
}

export default function InspectionMap({ inspections, onPickLocation }: InspectionMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const onPick = useRef(onPickLocation);
  useEffect(() => {
    onPick.current = onPickLocation;
  }, [onPickLocation]);

  useEffect(() => {
    if (!container.current) return;
    const first = inspections?.[0] ?? baltimore;
    const view = map(container.current, { scrollWheelZoom: false })
      .setView([first.latitude, first.longitude], 12);
    tileLayer(import.meta.env.VITE_OSM_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: import.meta.env.VITE_OSM_TILE_ATTRIBUTION
        || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(view);

    for (const inspection of inspections ?? []) {
      const label = materialLabels[inspection.material];
      const content = document.createElement('div');
      content.textContent = inspection.address ? `${label} · ${inspection.address}` : label;
      marker([inspection.latitude, inspection.longitude], {
        icon: divIcon({
          className: '',
          html: `<span style="display:block;width:20px;height:20px;border-radius:50%;border:3px solid white;background:${colors[inspection.riskLevel]};box-shadow:0 1px 5px #0f172a80"></span>`,
          iconSize: [20, 20],
        }),
        title: label,
      }).addTo(view).bindPopup(content);
    }

    view.on('click', ({ latlng }) => {
      const latitude = Math.max(-90, Math.min(90, latlng.lat));
      onPick.current?.({ latitude, longitude: latlng.wrap().lng });
    });
    return () => { view.remove(); };
  }, [inspections]);

  return <div ref={container} aria-label="Baltimore street map" className="relative z-0 h-80 w-full overflow-hidden rounded-2xl bg-slate-100" />;
}

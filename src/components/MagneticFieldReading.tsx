import { useEffect, useRef, useState } from 'react';

interface MagneticSensor extends EventTarget {
  x: number | null;
  y: number | null;
  z: number | null;
  start(): void;
  stop(): void;
}

type MagneticSensorConstructor = new (options: { frequency: number }) => MagneticSensor;

export function MagneticFieldReading() {
  const [status, setStatus] = useState('');
  const [sampling, setSampling] = useState(false);
  const cleanup = useRef<() => void>();
  useEffect(() => () => cleanup.current?.(), []);
  const Magnetometer = (window as Window & { Magnetometer?: MagneticSensorConstructor }).Magnetometer;

  function sample() {
    if (!Magnetometer) return;
    let count = 0;
    let minimum = Infinity;
    let maximum = -Infinity;
    let timer: ReturnType<typeof setTimeout> | undefined;

    setSampling(true);
    setStatus('Hold the phone still near the pipe for two seconds.');
    try {
      const sensor = new Magnetometer({ frequency: 10 });
      cleanup.current = () => {
        clearTimeout(timer);
        sensor.stop();
        cleanup.current = undefined;
      };
      const finish = (message: string) => {
        cleanup.current?.();
        setSampling(false);
        setStatus(message);
      };
      sensor.addEventListener('reading', () => {
        if (sensor.x === null || sensor.y === null || sensor.z === null) return;
        const magnitude = Math.hypot(sensor.x, sensor.y, sensor.z);
        if (!Number.isFinite(magnitude)) return;
        minimum = Math.min(minimum, magnitude);
        maximum = Math.max(maximum, magnitude);
        count++;
      });
      sensor.addEventListener('error', () => finish('Could not read the phone magnetometer.'), { once: true });
      timer = setTimeout(() => {
        finish(count > 1
          ? `Magnetic field range: ${minimum.toFixed(1)}–${maximum.toFixed(1)} µT across ${count} readings.`
          : 'The phone did not provide enough magnetic field readings.');
      }, 2_000);
      sensor.start();
    } catch {
      cleanup.current?.();
      setSampling(false);
      setStatus('Could not start the phone magnetometer.');
    }
  }

  return (
    <section className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
      <h2 className="font-bold">Phone magnetometer</h2>
      <p className="text-slate-600">Experimental magnetic field reading. Use a physical magnet to check if it sticks to the pipe.</p>
      {Magnetometer ? (
        <button type="button" disabled={sampling} onClick={sample} className="rounded-lg bg-slate-100 px-3 py-2 font-semibold disabled:opacity-50">
          Measure magnetic field
        </button>
      ) : <p className="text-slate-600">Phone magnetometer unavailable in this browser.</p>}
      {status && <p role="status">{status}</p>}
    </section>
  );
}

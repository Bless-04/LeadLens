import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { PMREMGenerator, type Group, type WebGLRenderTarget } from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Pipe } from './Pipe';
import { PipeSkeleton, type PipeIllustrationProps } from './PipeSkeleton';

const turn = Math.PI / 6;
const fullTurn = Math.PI * 2;

function StudioLighting({ onContextLost }: { onContextLost: () => void }) {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const studio = new RoomEnvironment();
    const generator = new PMREMGenerator(gl);
    let reflections: WebGLRenderTarget;
    try {
      reflections = generator.fromScene(studio, 0.04, 0.1, 100, { size: 64 });
    } finally {
      studio.dispose();
      generator.dispose();
    }
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', onContextLost);
    scene.environment = reflections.texture;
    invalidate();
    return () => {
      canvas.removeEventListener('webglcontextlost', onContextLost);
      scene.environment = null;
      reflections.dispose();
    };
  }, [gl, scene, invalidate, onContextLost]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} />
      <directionalLight position={[-3, 2, -4]} intensity={1} />
    </>
  );
}

export default function PipeViewer3D({ material, scratched }: PipeIllustrationProps) {
  const [hasContext, setHasContext] = useState(true);
  const [ready, setReady] = useState(false);
  const group = useRef<Group>(null);
  const invalidate = useRef<() => void>();
  const drag = useRef<{ pointerId: number; x: number }>();
  const onContextLost = useRef(() => setHasContext(false)).current;

  useEffect(() => {
    if (scratched && group.current) {
      group.current.rotation.y = 0;
      invalidate.current?.();
    }
  }, [scratched]);

  function rotate(delta: number) {
    if (!group.current) return;
    group.current.rotation.y = (group.current.rotation.y + delta) % fullTurn;
    invalidate.current?.();
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !event.isPrimary || !group.current) return;
    drag.current = { pointerId: event.pointerId, x: event.clientX };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const pointer = drag.current;
    if (pointer?.pointerId !== event.pointerId) return;
    rotate((event.clientX - pointer.x) * 0.012);
    pointer.x = event.clientX;
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.pointerId === event.pointerId) drag.current = undefined;
  }

  if (!hasContext) return <PipeSkeleton material={material} scratched={scratched} />;

  return (
    <div className="space-y-2">
      <div
        className="h-60 cursor-grab touch-pan-y overflow-hidden rounded-xl bg-gradient-to-b from-slate-700 to-slate-950 active:cursor-grabbing"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
      >
        <Canvas
          frameloop="demand"
          dpr={[1, 2]}
          camera={{ position: [0, 1.5, 4.6], fov: 36 }}
          events={() => ({ enabled: false, priority: 1 })}
          gl={{ powerPreference: 'low-power', antialias: true }}
          fallback={<PipeSkeleton material={material} scratched={scratched} />}
          onCreated={(state) => {
            invalidate.current = state.invalidate;
            state.gl.domElement.setAttribute('aria-hidden', 'true');
            setReady(true);
          }}
        >
          <StudioLighting onContextLost={onContextLost} />
          <group ref={group}>
            <Pipe material={material} scratched={scratched} />
          </group>
        </Canvas>
      </div>
      {ready && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-slate-600">Drag sideways to rotate</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => rotate(-turn)} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold">Rotate left</button>
            <button type="button" onClick={() => rotate(turn)} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold">Rotate right</button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useThree } from '@react-three/fiber';
import { memo, useLayoutEffect, useMemo, useRef } from 'react';
import { Color, Float32BufferAttribute, Vector2, type LatheGeometry } from 'three';
import type { PipeMaterial } from '../../types/pipe';
import { getPipeVisual } from './pipeMaterials';

const radius = 0.53;
const pipeProfile = [
  [0.43, -1.05], [0.51, -1.05], [radius, -1.02],
  ...Array.from({ length: 19 }, (_, index) => [radius, (index - 9) * 0.102]),
  [radius, 1.02], [0.51, 1.05], [0.43, 1.05],
  [0.43, -1.05],
].map(([r, y]) => new Vector2(r, y));

const scratches = [
  { angle: -0.48, y: -0.12, length: 0.96, width: 0.05, rise: 0.19 },
  { angle: -0.35, y: -0.19, length: 0.7, width: 0.017, rise: 0.14 },
  { angle: -0.27, y: -0.01, length: 0.61, width: 0.021, rise: 0.12 },
];

function scratchVertices({ angle, y, length, width, rise }: (typeof scratches)[number]) {
  const positions: number[] = [];
  const normals: number[] = [];
  const triangles: number[] = [];
  const segments = 14;
  for (let index = 0; index <= segments; index++) {
    const progress = index / segments;
    const theta = angle + progress * length;
    const x = Math.sin(theta);
    const z = Math.cos(theta);
    const center = y + progress * rise + 0.008 * Math.sin(index * 1.7);
    const halfWidth = width * (0.04 + Math.sin(Math.PI * progress) * 0.46);
    positions.push(x * 0.532, center - halfWidth, z * 0.532, x * 0.532, center + halfWidth, z * 0.532);
    normals.push(x, 0, z, x, 0, z);
    if (index < segments) {
      const vertex = index * 2;
      triangles.push(vertex, vertex + 2, vertex + 1, vertex + 1, vertex + 2, vertex + 3);
    }
  }
  return {
    position: new Float32BufferAttribute(positions, 3),
    normal: new Float32BufferAttribute(normals, 3),
    index: triangles,
  };
}

export const Pipe = memo(function Pipe({ material, scratched }: { material: PipeMaterial; scratched: boolean }) {
  const visual = getPipeVisual(material);
  const surface = visual.scratch;
  const scratchesGeometry = useMemo(() => scratched && surface ? scratches.map(scratchVertices) : [], [scratched, surface]);
  const pipeGeometry = useRef<LatheGeometry>(null);
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    const geometry = pipeGeometry.current;
    if (!geometry) return;
    const positions = geometry.getAttribute('position');
    const base = new Color(visual.body.color);
    const detail = new Color(visual.detail);
    const color = new Color();
    let colors = geometry.getAttribute('color');
    if (!colors) {
      colors = new Float32BufferAttribute(new Float32Array(positions.count * 3), 3);
      geometry.setAttribute('color', colors);
    }
    const variation = material === 'plastic' ? 0.03 : 0.23;
    for (let index = 0; index < positions.count; index++) {
      const x = positions.getX(index);
      const y = positions.getY(index);
      const z = positions.getZ(index);
      const band = Math.sin(x * 31 + z * 19 + y * 11) * Math.cos(z * 27 - x * 15 + y * 18);
      color.copy(base).lerp(detail, variation * (1 + band));
      colors.setXYZ(index, color.r, color.g, color.b);
    }
    colors.needsUpdate = true;
    invalidate();
  }, [invalidate, material, visual]);

  return (
    <>
      <mesh>
        <latheGeometry ref={pipeGeometry} args={[pipeProfile, 48]} />
        <meshStandardMaterial vertexColors metalness={visual.body.metalness} roughness={visual.body.roughness} />
      </mesh>
      {[-0.83, 0.83].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, material === 'galvanized_steel' ? 0.046 : 0.029, 8, 48]} />
          <meshStandardMaterial {...visual.body} color={visual.detail} />
        </mesh>
      ))}
      {surface && scratchesGeometry.map(({ index, position, normal }, strand) => (
        <mesh key={strand}>
          <bufferGeometry
            onUpdate={(geometry) => {
              geometry.setIndex(index);
              geometry.setAttribute('position', position);
              geometry.setAttribute('normal', normal);
            }}
          />
          <meshStandardMaterial
            color={surface.color}
            metalness={surface.metalness}
            roughness={surface.roughness}
            emissive={surface.color}
            emissiveIntensity={material === 'lead' ? 0.28 : 0.05}
          />
        </mesh>
      ))}
    </>
  );
});

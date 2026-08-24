import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Grid, Line, Html } from "@react-three/drei";
import * as THREE from "three";

export interface MassingTarget {
  key: string; // changes whenever the scenario/inputs meaningfully change, to retrigger the rise animation
  siteWidthM: number;
  siteDepthM: number;
  footprintWidthM: number;
  footprintDepthM: number;
  floors: number;
  floorHeightM: number;
  governingConstraint: "setback" | "coverage";
  color: string;
}

const FLOOR_COLOR_TOP = "#1c2b45";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function Building({ target }: { target: MassingTarget }) {
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const growth = useRef<number[]>([]);
  const dims = useRef({ w: target.footprintWidthM, d: target.footprintDepthM });
  const startTime = useRef(0);
  const prevKey = useRef(target.key);

  const floors = Math.max(0, target.floors);

  if (prevKey.current !== target.key) {
    prevKey.current = target.key;
    startTime.current = performance.now() / 1000;
  }

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    // smoothly damp footprint dims toward target
    dims.current.w = THREE.MathUtils.damp(dims.current.w, target.footprintWidthM, 4, delta);
    dims.current.d = THREE.MathUtils.damp(dims.current.d, target.footprintDepthM, 4, delta);

    for (let i = 0; i < groupRefs.current.length; i++) {
      const g = groupRefs.current[i];
      if (!g) continue;
      const delay = i * 0.08;
      const elapsed = t - startTime.current - delay;
      const targetGrowth = clamp(elapsed / 0.5, 0, 1);
      const eased = 1 - Math.pow(1 - targetGrowth, 3);
      growth.current[i] = THREE.MathUtils.damp(growth.current[i] ?? 0, eased, 8, delta);
      const gr = growth.current[i];
      g.scale.set(dims.current.w, Math.max(0.001, gr) * target.floorHeightM * 0.94, dims.current.d);
      g.position.y = i * target.floorHeightM + (target.floorHeightM * 0.94) / 2;
      const mat = (g.children[0] as THREE.Mesh)?.material as THREE.MeshStandardMaterial | undefined;
      if (mat) mat.opacity = 0.35 + gr * 0.65;
    }
  });

  if (floors <= 0) {
    return (
      <Html center position={[0, 1, 0]}>
        <div
          style={{
            background: "var(--crit-soft)",
            color: "var(--crit)",
            padding: "8px 14px",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: "nowrap",
            fontFamily: "IBM Plex Sans, sans-serif",
          }}
        >
          No buildable footprint at this input combination
        </div>
      </Html>
    );
  }

  return (
    <group>
      {Array.from({ length: floors }).map((_, i) => (
        <group key={i} ref={(el) => { groupRefs.current[i] = el; }}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={i === floors - 1 ? FLOOR_COLOR_TOP : target.color}
              transparent
              opacity={0.35}
              roughness={0.55}
              metalness={0.08}
            />
          </mesh>
          <lineSegments scale={[1, 1, 1]}>
            <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
            <lineBasicMaterial color="#0a0e11" transparent opacity={0.25} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

function ParcelOutline({ w, d, color }: { w: number; d: number; color: string }) {
  const pts: [number, number, number][] = [
    [-w / 2, 0.01, -d / 2],
    [w / 2, 0.01, -d / 2],
    [w / 2, 0.01, d / 2],
    [-w / 2, 0.01, d / 2],
    [-w / 2, 0.01, -d / 2],
  ];
  return (
    <>
      <Line points={pts} color={color} lineWidth={1.5} dashed dashSize={0.6} gapSize={0.4} />
    </>
  );
}

function Rig({ autoRotate }: { autoRotate: boolean }) {
  return (
    <OrbitControls
      makeDefault
      autoRotate={autoRotate}
      autoRotateSpeed={0.6}
      enablePan={false}
      minDistance={12}
      maxDistance={90}
      maxPolarAngle={Math.PI / 2.05}
      target={[0, 4, 0]}
    />
  );
}

export default function Massing3D({ target, autoRotate = true }: { target: MassingTarget; autoRotate?: boolean }) {
  const camDistance = useMemo(() => clamp(Math.max(target.siteWidthM, target.siteDepthM) * 1.6, 18, 70), [target.siteWidthM, target.siteDepthM]);

  return (
    <div className="h-full w-full">
      <Canvas
        shadows
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [camDistance * 0.85, camDistance * 0.62, camDistance * 0.85], fov: 42 }}
      >
        <color attach="background" args={["#eef1ee"]} />
        <fog attach="fog" args={["#eef1ee", camDistance * 1.6, camDistance * 3.2]} />
        <hemisphereLight intensity={0.55} groundColor="#cfd6cd" />
        <directionalLight
          position={[18, 26, 12]}
          intensity={1.15}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />

        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
            <Building target={target} />
            <ParcelOutline w={target.siteWidthM} d={target.siteDepthM} color="#8a9490" />
            <ParcelOutline
              w={target.footprintWidthM}
              d={target.footprintDepthM}
              color={target.governingConstraint === "setback" ? "#b5822a" : "#14877b"}
            />
          </group>

          <Grid
            position={[0, -0.01, 0]}
            args={[200, 200]}
            cellSize={2}
            cellThickness={0.5}
            cellColor="#c7cdc6"
            sectionSize={10}
            sectionThickness={1}
            sectionColor="#aab4a8"
            fadeDistance={70}
            infiniteGrid
          />
          <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={80} blur={2.2} far={20} />
        </Suspense>

        <Rig autoRotate={autoRotate} />
      </Canvas>
    </div>
  );
}

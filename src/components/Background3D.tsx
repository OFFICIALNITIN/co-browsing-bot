"use client";
import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

let globalGlowTexture: THREE.CanvasTexture | null = null;
function getGlowTexture() {
  if (globalGlowTexture) return globalGlowTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Intense core glow
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');       // Hot white core
    gradient.addColorStop(0.15, 'rgba(220,245,255,0.9)');  // Cyan inner
    gradient.addColorStop(0.4, 'rgba(100,180,255,0.4)');   // Blue mid
    gradient.addColorStop(0.7, 'rgba(50,50,150,0.1)');     // Purple/Blue outer
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  globalGlowTexture = new THREE.CanvasTexture(canvas);
  return globalGlowTexture;
}

interface AsteroidState {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  radius: number;
  rot: THREE.Euler;
  rotVel: { x: number, y: number, z: number };
  id: number;
}

interface CometData {
  startPos: THREE.Vector3;
  direction: THREE.Vector3;
  speed: number;
  color: THREE.Color;
  delay: number;
}

const ParticleComet = ({ data, onComplete, texture, asteroidsRef }: {
  data: CometData;
  onComplete: () => void;
  texture: THREE.Texture;
  asteroidsRef: React.MutableRefObject<AsteroidState[]>
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headPos = useRef(data.startPos.clone());
  const progress = useRef(0);

  const particleCount = 400;
  const particlesRef = useRef<THREE.Points>(null);

  const [positions, opacities] = useMemo(() => {
    const p = new Float32Array(particleCount * 3).fill(9999);
    const o = new Float32Array(particleCount).fill(0);
    return [p, o];
  }, []);

  const emitIndex = useRef(0);
  const spawnTimer = useRef(0);

  // Animation Frame
  useFrame((_, delta) => {
    if (data.delay > 0) {
      data.delay -= delta;
      return;
    }

    // 1. Update Head
    progress.current += delta * data.speed;
    const currentPos = data.startPos.clone().add(
      data.direction.clone().multiplyScalar(progress.current)
    );
    headPos.current.copy(currentPos);

    // COLLISION: Check vs Asteroids
    // Simple push logic: If comet hits asteroid, push asteroid away strongly
    if (asteroidsRef.current && delta < 0.1) {
      const cometRadius = 0.3; // Force field radius
      for (let ast of asteroidsRef.current) {
        const dist = headPos.current.distanceTo(ast.pos);
        if (dist < (ast.radius + cometRadius)) {
          // COLLISION
          const pushDir = ast.pos.clone().sub(headPos.current).normalize();
          // Add Impulse velocity to asteroid
          ast.vel.add(pushDir.multiplyScalar(delta * 8.0)); // Strong push
        }
      }
    }

    if (groupRef.current) {
      groupRef.current.position.copy(currentPos);
    }

    if (Math.abs(headPos.current.x) > 15 || Math.abs(headPos.current.y) > 10 || headPos.current.z > 5) {
      onComplete();
      return;
    }

    // 2. Emit Particles
    spawnTimer.current += delta;
    if (spawnTimer.current > 0.005) {
      spawnTimer.current = 0;
      for (let k = 0; k < 5; k++) {
        const idx = emitIndex.current;
        emitIndex.current = (emitIndex.current + 1) % particleCount;

        const spread = 0.02;
        positions[idx * 3] = headPos.current.x + (Math.random() - 0.5) * spread;
        positions[idx * 3 + 1] = headPos.current.y + (Math.random() - 0.5) * spread;
        positions[idx * 3 + 2] = headPos.current.z + (Math.random() - 0.5) * spread;
        opacities[idx] = 1.0;
      }
    }

    // 3. Update Particles
    if (particlesRef.current) {
      const geo = particlesRef.current.geometry;
      const posAttr = geo.attributes.position;
      const colAttr = geo.attributes.color;

      const posArr = posAttr.array as Float32Array;
      const colArr = colAttr.array as Float32Array;

      let activeParticles = false;
      for (let i = 0; i < particleCount; i++) {
        if (opacities[i] > 0) {
          activeParticles = true;
          opacities[i] -= delta * (0.8 + Math.random() * 0.5);
          if (opacities[i] <= 0) {
            opacities[i] = 0;
            posArr[i * 3] = 9999;
          } else {
            const life = opacities[i];
            colArr[i * 3] = colArr[i * 3 + 1] = colArr[i * 3 + 2] = life;
          }
        }
      }
      posAttr.needsUpdate = activeParticles;
      colAttr.needsUpdate = activeParticles;
    }
  });

  return (
    <>
      <group ref={groupRef} position={[999, 999, 999]}>
        <mesh>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <sprite scale={[0.6, 0.6, 1]}>
          <spriteMaterial map={texture} color={data.color} transparent blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.6} />
        </sprite>
        <sprite scale={[0.3, 0.3, 1]}>
          <spriteMaterial map={texture} color="#ffffff" transparent blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.8} />
        </sprite>
      </group>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" count={particleCount} array={new Float32Array(particleCount * 3)} itemSize={3} args={[new Float32Array(particleCount * 3), 3]} />
        </bufferGeometry>
        <pointsMaterial map={texture} size={0.05} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>
    </>
  );
};

const CometSystem = ({ asteroidsRef }: { asteroidsRef: React.MutableRefObject<AsteroidState[]> }) => {
  const [comets, setComets] = React.useState<CometData[]>([]);
  const lastSpawnRef = useRef(0);
  const glowTexture = useMemo(() => getGlowTexture(), []);

  const { viewport } = useThree(); // Responsive viewport

  const cosmicColors = useMemo(() => [new THREE.Color('#44aaff')], []);

  const spawnComet = () => {
    const isLeftToRight = Math.random() > 0.5;

    // Dynamic Spawn Points based on screen width
    // Spawn just outside the viewport
    const xOffset = (viewport.width / 2) + 2;

    // 3D Trajectory: Far (Z-10) to Near (Z+2)
    const startZ = -8 - Math.random() * 4;
    const startX = isLeftToRight ? -xOffset : xOffset;
    const startY = (Math.random() - 0.5) * viewport.height; // Cover full height

    const start = new THREE.Vector3(startX, startY, startZ);

    // Target near camera, cross screen
    const targetZ = 3;
    const targetX = isLeftToRight ? xOffset : -xOffset;
    const targetY = startY + (Math.random() - 0.5) * 2;

    const target = new THREE.Vector3(targetX, targetY, targetZ);

    const dir = target.sub(start).normalize();

    // Check if mobile (viewport width < 5 is roughly mobile)
    const isMobile = viewport.width < 5;

    return {
      startPos: start,
      direction: dir,
      speed: (isMobile ? 1.0 : 1.5) + Math.random() * 0.8, // Slower on mobile? Or same?
      color: cosmicColors[0],
      delay: Math.random() * 2.0
    };
  };

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    // Spawn Logic
    // Mobile: Limit concurrency to 2 to save perf
    const isMobile = viewport.width < 5;
    const maxComets = isMobile ? 2 : 3;
    const spawnRate = isMobile ? 6.0 : 4.0; // Less frequent on mobile

    if (time - lastSpawnRef.current > spawnRate && comets.length < maxComets) {
      if (Math.random() > 0.3) {
        lastSpawnRef.current = time;
        setComets(prev => [...prev, spawnComet()]);
      }
    }
  });

  return (
    <group>
      {comets.map((comet, i) => (
        <ParticleComet
          key={`pc-${i}-${comet.speed}`}
          data={comet}
          texture={glowTexture}
          asteroidsRef={asteroidsRef}
          onComplete={() => setComets(p => p.filter((_, idx) => idx !== i))}
        />
      ))}
    </group>
  );
};

const AsteroidField = ({ asteroidsRef }: { asteroidsRef: React.MutableRefObject<AsteroidState[]> }) => {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  const count = isMobile ? 6 : 12; // Fewer rocks on mobile

  const groupRef = useRef<THREE.Group>(null);
  const initialized = useRef(false);

  // Initialize State (Responsive Reset)
  // If viewport changes drastically, we might want to re-init, but let's stick to init once for stability
  // actually, if we resize desktop -> mobile, we want fewer rocks?
  // Handling dynamic count change is tricky with refs. Let's just init once with a 'reasonable' guess or max.
  // We'll init based on initial viewport.

  useMemo(() => {
    if (asteroidsRef.current.length > 0) return; // Already init (hot reload safety)

    asteroidsRef.current = [];
    for (let i = 0; i < count; i++) {
      asteroidsRef.current.push({
        id: i,
        // Spread across viewport
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * viewport.width,
          (Math.random() - 0.5) * viewport.height,
          -2 + Math.random()
        ),
        vel: new THREE.Vector3((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, 0),
        radius: (isMobile ? 0.15 : 0.25) + Math.random() * 0.1,
        rot: new THREE.Euler(Math.random(), Math.random(), Math.random()),
        rotVel: { x: (Math.random() - .5), y: (Math.random() - .5), z: (Math.random() - .5) }
      });
    }
  }, []); // Run once on mount. 

  // Generate 4 variants of Detailed Rocks
  const rockGeos = useMemo(() => {
    return [0, 1, 2, 3].map(seed => {
      // High poly Icosahedron for smooth, curved surface
      const geo = new THREE.IcosahedronGeometry(1, 3);
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();

      // Random seeds for noise axes
      const fx = seed + 1.1;
      const fy = seed + 2.2;
      const fz = seed + 3.3;

      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        v.normalize(); // Start from perfect sphere

        // 1. Large Shape deformation (Low frequency)
        // Creates irregular, non-spherical bodies
        const shapeNoise =
          Math.sin(v.x * 2 + fx) * 0.5 +
          Math.cos(v.y * 1.5 + fy) * 0.5 +
          Math.sin(v.z * 1.8 + fz) * 0.5;

        // 2. Medium detail (dents and lumps)
        const detailNoise =
          Math.sin(v.x * 5 + fx * 2) * Math.cos(v.z * 5) * 0.1;

        // Combine: Base radius (1.0) + Shape variation + Detail
        // Using Math.abs on shapeNoise creates some flatter areas ("cuts")
        let r = 1.0 + (shapeNoise * 0.4) + detailNoise;

        // Occasional deep dent (crater-like)
        if (Math.sin(v.x * 3 + v.y * 3 + seed) > 0.8) {
          r -= 0.15;
        }

        v.multiplyScalar(r);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
      return geo;
    });
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const bodies = asteroidsRef.current;

    const boundX = viewport.width / 2 + 1;
    const boundY = viewport.height / 2 + 1;

    for (let i = 0; i < bodies.length; i++) {
      const a = bodies[i];
      a.pos.add(a.vel.clone().multiplyScalar(dt));
      a.rot.x += a.rotVel.x * dt;
      a.rot.y += a.rotVel.y * dt;

      // Responsive Bounds Wrap
      if (a.pos.x > boundX) a.pos.x = -boundX;
      if (a.pos.x < -boundX) a.pos.x = boundX;
      if (a.pos.y > boundY) a.pos.y = -boundY;
      if (a.pos.y < -boundY) a.pos.y = boundY;

      // Collision logic (Same)
      for (let j = i + 1; j < bodies.length; j++) {
        const b = bodies[j];
        const dist = a.pos.distanceTo(b.pos);
        const minDist = a.radius + b.radius;
        if (dist < minDist) {
          const normal = a.pos.clone().sub(b.pos).normalize();
          const overlap = minDist - dist;
          a.pos.add(normal.clone().multiplyScalar(overlap * 0.5));
          b.pos.sub(normal.clone().multiplyScalar(overlap * 0.5));

          const vRel = a.vel.clone().sub(b.vel);
          const velAlongNormal = vRel.dot(normal);
          if (velAlongNormal < 0) {
            const j = -1.9 * velAlongNormal;
            const impulse = normal.multiplyScalar(j * 0.5);
            a.vel.add(impulse);
            b.vel.sub(impulse);
          }
        }
      }
    }

    if (groupRef.current) {
      groupRef.current.children.forEach((mesh: any, i) => {
        // Safe check if we reduced count dynamically (not doing that here, but for safety)
        if (bodies[i]) {
          mesh.position.copy(bodies[i].pos);
          mesh.rotation.copy(bodies[i].rot);
          mesh.scale.set(bodies[i].radius, bodies[i].radius, bodies[i].radius);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {asteroidsRef.current.map((a, i) => {
        const geo = rockGeos[i % rockGeos.length];
        return (
          <mesh key={a.id} geometry={geo}>
            <meshStandardMaterial color="#5d4a3e" roughness={0.9} metalness={0.1} flatShading={false} />
          </mesh>
        );
      })}
    </group>
  );
};

const StarField = ({ count = 5000 }: { count?: number }) => {
  const ref = useRef<any>(null);
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 4;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const starType = Math.random();
      if (starType > 0.9) color.setHex(0xaaaaff);
      else if (starType > 0.7) color.setHex(0xffddaa);
      else color.setHex(0xffffff);

      col[i * 3] = color.r; col[i * 3 + 1] = color.g; col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.015;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3}>
      <PointMaterial transparent vertexColors size={0.005} sizeAttenuation depthWrite={false} opacity={0.8} />
    </Points>
  );
};

const Background3D: React.FC = () => {
  const asteroidsRef = useRef<AsteroidState[]>([]);

  return (
    <div className="fixed inset-0 z-0 bg-black">
      <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: false }}>
        <color attach="background" args={['#020205']} />

        <ambientLight intensity={0.4} />
        <pointLight position={[10, 5, 5]} intensity={1} color="#4466ff" />
        <directionalLight position={[-5, 5, 5]} intensity={1} color="#ffffff" />

        <Suspense fallback={null}>
          <StarField />
          <CometSystem asteroidsRef={asteroidsRef} />
          <AsteroidField asteroidsRef={asteroidsRef} />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 pointer-events-none mix-blend-multiply" />
    </div>
  );
};

export default Background3D;

/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

// Asset configuration - Using local assets as requested
const cardGLBPath = '/assets/card.glb';
const lanyardPath = '/assets/lanyard.png';

// Preload assets at module level to prevent re-fetching on every mount
useGLTF.preload(cardGLBPath);
useTexture.preload(lanyardPath);

export default function Lanyard({ position = [0, 0, 15], gravity = [0, -40, 0], fov = 20, transparent = true }: {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
}) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.01 } // Trigger as soon as a tiny bit is visible
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="lanyard-wrapper h-full w-full">
      <Suspense fallback={<div className="w-full h-full glass animate-pulse rounded-3xl flex items-center justify-center">
        <span className="text-xs font-mono opacity-20">BOOTING_CORE_ENGINE...</span>
      </div>}>
        {isVisible && (
          <Canvas
            camera={{ position: position as any, fov: fov }}
            dpr={[1, 1.2]}
            gl={{ 
              alpha: transparent,
              antialias: !isMobile,
              powerPreference: "high-performance",
              preserveDrawingBuffer: false
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
            }}
            onError={(e) => console.error("Canvas Error:", e)}
          >
            <ambientLight intensity={Math.PI * 0.5} />
            <Physics gravity={gravity as any} timeStep={1 / 30}>
              <Band isMobile={isMobile} cardGLB={cardGLBPath} lanyardImg={lanyardPath} isVisible={isVisible} />
            </Physics>
            <Environment blur={1}>
              <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={5} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
            </Environment>
          </Canvas>
        )}
      </Suspense>
    </div>
  );
}

function Band({ maxSpeed = 30, minSpeed = 0, isMobile = false, cardGLB, lanyardImg, isVisible }: any) {
  const band = useRef<any>(null),
    fixed = useRef<any>(null),
    j1 = useRef<any>(null),
    j2 = useRef<any>(null),
    j3 = useRef<any>(null),
    card = useRef<any>(null);
  
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();
    
  const segmentProps: any = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };

  // Load assets
  const { nodes, materials } = useGLTF(cardGLB) as any;
  const texture = useTexture(lanyardImg) as THREE.Texture;
  
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<any>(false);
  const [hovered, hover] = useState(false);

  // CardContent logic with safety fallback
  const CardContent = useMemo(() => {
    // If nodes or node parts are missing, provide a clean box fallback
    if (!nodes || !nodes.card || !nodes.clip || !nodes.clamp) {
      return (
        <mesh>
          <boxGeometry args={[0.7, 1, 0.02]} />
          <meshPhysicalMaterial 
             color="#222" 
             metalness={0.8} 
             roughness={0.2} 
             clearcoat={1}
          />
        </mesh>
      );
    }
    
    return (
      <>
        <mesh geometry={nodes.card?.geometry}>
          <meshPhysicalMaterial
            map={materials.base?.map}
            map-anisotropy={16}
            clearcoat={isMobile ? 0 : 1}
            clearcoatRoughness={0.15}
            roughness={0.9}
            metalness={0.8}
          />
        </mesh>
        <mesh geometry={nodes.clip?.geometry} material={materials.metal} material-roughness={0.3} />
        <mesh geometry={nodes.clamp?.geometry} material={materials.metal} />
      </>
    );
  }, [nodes, materials, isMobile]);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1.2]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1.2]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1.2]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.7, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current) return;
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped || j2.current.translation());
      curve.points[2].copy(j1.current.lerped || j1.current.translation());
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel() || { x: 0, y: 0, z: 0 });
      rot.copy(card.current.rotation() || { x: 0, y: 0, z: 0 });
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 5, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[1, 1.4, 0.01]} />
          <group
            scale={3}
            position={[0, -1.5, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={e => ((e.target as any).releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={e => (
              (e.target as any).setPointerCapture(e.pointerId),
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            )}
          >
            {CardContent}
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* @ts-ignore */}
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1.5}
        />
      </mesh>
    </>
  );
}

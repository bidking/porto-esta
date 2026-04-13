/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo, ReactNode, Suspense } from 'react';
import { Canvas, createPortal, useFrame, useThree, ThreeElements } from '@react-three/fiber';
import {
  useFBO,
  useGLTF,
  Preload,
  MeshTransmissionMaterial,
} from '@react-three/drei';
import { easing } from 'maath';

type Mode = 'lens' | 'bar' | 'cube';

type ModeProps = Record<string, unknown>;

interface FluidGlassProps {
  mode?: Mode;
  lensProps?: ModeProps;
  barProps?: ModeProps;
  cubeProps?: ModeProps;
  children?: ReactNode;
}

export default function FluidGlass({ mode = 'lens', lensProps = {}, barProps = {}, cubeProps = {}, children }: FluidGlassProps) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const rawOverrides = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;

  const {
    ...modeProps
  } = rawOverrides;

  return (
    <Canvas 
      camera={{ position: [0, 0, 20], fov: 15 }} 
      gl={{ alpha: true, antialias: true }} 
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
      style={{ 
        pointerEvents: 'none', 
        position: 'fixed', 
        inset: 0, 
        zIndex: 50,
        background: 'transparent'
      }}
    >

      <Suspense fallback={null}>
        <Wrapper modeProps={modeProps}>
          {children || <DefaultBackground />}
          <Preload />
        </Wrapper>
      </Suspense>
    </Canvas>
  );
}

function DefaultBackground() {
  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <mesh position={[-5, 2, -10]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[5, -3, -10]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#9333ea" roughness={0.1} metalness={0.8} />
      </mesh>
    </>
  );
}

type MeshProps = ThreeElements['mesh'];

interface ModeWrapperProps extends MeshProps {
  children?: ReactNode;
  glb: string;
  geometryKey: string;
  lockToBottom?: boolean;
  followPointer?: boolean;
  modeProps?: ModeProps;
}

const ModeWrapper = memo(function ModeWrapper({
  children,
  glb,
  geometryKey,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  ...props
}: ModeWrapperProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const [modelError, setModelError] = useState(false);
  
  // We use a separate component to load GLTF to avoid breaking hooks in the main component
  const nodes = useSafeGLTF(glb, setModelError);

  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  const geoWidthRef = useRef<number>(1);

  useEffect(() => {
    if (nodes && nodes[geometryKey]) {
      const geo = (nodes[geometryKey] as THREE.Mesh).geometry;
      geo.computeBoundingBox();
      if (geo.boundingBox) {
        geoWidthRef.current = geo.boundingBox.max.x - geo.boundingBox.min.x || 1;
      }
    }
  }, [nodes, geometryKey]);

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (pointer.y * v.height) / 2 : 0;
    
    if (ref.current) {
      easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

      if ((modeProps as { scale?: number }).scale == null) {
        const maxWorld = v.width * 0.9;
        const desired = maxWorld / geoWidthRef.current;
        ref.current.scale.setScalar(Math.min(0.15, desired));
      }
    }

    // Render the scene (spheres) into the buffer for refraction
    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps as any;

  return (
    <>
      {createPortal(children, scene)}
      <mesh
        ref={ref}
        scale={scale ?? 0.15}
        rotation-x={Math.PI / 2}
        {...props}
      >
        {nodes && nodes[geometryKey] ? (
          <primitive object={(nodes[geometryKey] as THREE.Mesh).geometry} attach="geometry" />
        ) : (
          <cylinderGeometry args={[1, 1, 0.2, 32]} />
        )}

        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.15}
          thickness={thickness ?? 5}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.1}
          {...extraMat}
        />
      </mesh>
    </>
  );
});

function useSafeGLTF(url: string, onError: (err: boolean) => void) {
  try {
    const { nodes } = useGLTF(url);
    return nodes;
  } catch (e) {
    // This catch might not work as expected with Suspense, but we handle it via fallback geometry
    return null;
  }
}

function Lens({ modeProps, children, ...p }: any) {
  return <ModeWrapper glb="/assets/3d/lens.glb" geometryKey="Cylinder" followPointer modeProps={modeProps} {...p}>{children}</ModeWrapper>;
}

function Cube({ modeProps, children, ...p }: any) {
  return <ModeWrapper glb="/assets/3d/cube.glb" geometryKey="Cube" followPointer modeProps={modeProps} {...p}>{children}</ModeWrapper>;
}

function Bar({ modeProps = {}, children, ...p }: any) {
  const defaultMat = {
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.15,
    color: '#ffffff',
    attenuationColor: '#ffffff',
    attenuationDistance: 0.25
  };

  return (
    <ModeWrapper
      glb="/assets/3d/bar.glb"
      geometryKey="Cube"
      lockToBottom
      followPointer={false}
      modeProps={{ ...defaultMat, ...modeProps }}
      {...p}
    >{children}</ModeWrapper>
  );
}


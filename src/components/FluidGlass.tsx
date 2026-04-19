/* eslint-disable react/no-unknown-property */
/**
 * FluidGlass — React Bits–style refractive glass cursor effect.
 *
 * Architecture (follows React Bits pattern):
 *  1. createPortal renders an ambient scene into a separate THREE.Scene
 *  2. useFBO captures that scene to a render-texture each frame
 *  3. The glass mesh (loaded from .glb) uses MeshTransmissionMaterial
 *     with buffer={fbo.texture} to refract the captured scene
 *  4. The Canvas is a fixed, pointer-events:none overlay so the lens
 *     follows the cursor across the entire HTML portfolio page
 *
 * GLB models expected at /assets/3d/{lens,bar,cube}.glb
 */

import * as THREE from 'three';
import { useRef, useState, useEffect, memo, ReactNode } from 'react';
import {
  Canvas,
  createPortal,
  useFrame,
  useThree,
  ThreeElements,
} from '@react-three/fiber';
import { useFBO, useGLTF, MeshTransmissionMaterial } from '@react-three/drei';
import { easing } from 'maath';

// ─── Public API types ─────────────────────────────────────────────────────────

type Mode = 'lens' | 'bar' | 'cube';
type ModeProps = Record<string, unknown>;

interface FluidGlassProps {
  mode?: Mode;
  lensProps?: ModeProps;
  barProps?: ModeProps;
  cubeProps?: ModeProps;
}

// ─── Entry point ──────────────────────────────────────────────────────────────

export default function FluidGlass({
  mode = 'lens',
  lensProps = {},
  barProps = {},
  cubeProps = {},
}: FluidGlassProps) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const modeProps = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;

  return (
    // Fixed full-viewport overlay — pointer-events:none keeps page interactive
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 20], fov: 15 }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        {/*
         * The AmbientScene is what the glass actually refracts.
         * It's portalled into a separate THREE.Scene captured by useFBO.
         * Replace / extend this with any Three.js content you like.
         */}
        <Wrapper modeProps={modeProps}>
          <AmbientScene />
        </Wrapper>
      </Canvas>
    </div>
  );
}

// ─── Ambient scene (content "inside" the glass) ───────────────────────────────

/**
 * Renders an animated iridescent gradient plane into the offscreen FBO scene.
 * This is the "world" the glass lens refracts.  Swap it for any R3F scene.
 */
function AmbientScene() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { viewport } = useThree();

  // Animate the gradient over time
  useFrame(({ clock }) => {
    const mat = meshRef.current?.material as THREE.ShaderMaterial | undefined;
    if (mat?.uniforms?.time) mat.uniforms.time.value = clock.elapsedTime;
  });

  const vertexShader = /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform float time;
    varying vec2 vUv;

    vec3 palette(float t) {
      // Purple → Blue → Teal iridescent palette
      vec3 a = vec3(0.12, 0.08, 0.38);
      vec3 b = vec3(0.32, 0.10, 0.48);
      vec3 c = vec3(0.06, 0.28, 0.50);
      vec3 d = vec3(0.18, 0.14, 0.42);
      float s1 = sin(vUv.x * 6.28 + time * 0.35) * 0.5 + 0.5;
      float s2 = sin(vUv.y * 6.28 + time * 0.22) * 0.5 + 0.5;
      return mix(mix(a, b, s1), mix(c, d, s2), t);
    }

    void main() {
      float t = sin(vUv.x * 3.14 + vUv.y * 2.0 + time * 0.3) * 0.5 + 0.5;
      vec3 col = palette(t);
      // Subtle radial vignette
      float vign = 1.0 - length(vUv - 0.5) * 0.8;
      gl_FragColor = vec4(col * vign, 1.0);
    }
  `;

  return (
    <mesh
      ref={meshRef}
      // Size: fill the view with slack for any camera/viewport combo
      scale={[viewport.width * 3, viewport.height * 3, 1]}
    >
      <planeGeometry />
      <shaderMaterial
        uniforms={{ time: { value: 0 } }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

// ─── ModeWrapper — the React Bits core pattern ────────────────────────────────

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
  const meshRef = useRef<THREE.Mesh>(null!);
  const { nodes } = useGLTF(glb);
  const buffer = useFBO();
  const { viewport: vp } = useThree();

  // Separate scene that holds the ambient content
  const [offscreenScene] = useState<THREE.Scene>(() => new THREE.Scene());

  // Cache geometry width for auto-scale calculation
  const geoWidthRef = useRef<number>(1);
  useEffect(() => {
    const geo = (nodes[geometryKey] as THREE.Mesh)?.geometry;
    if (!geo) return;
    geo.computeBoundingBox();
    geoWidthRef.current =
      (geo.boundingBox!.max.x - geo.boundingBox!.min.x) || 1;
  }, [nodes, geometryKey]);

  // Extract material props from modeProps
  const {
    scale,
    ior,
    thickness,
    anisotropy,
    chromaticAberration,
    ...extraMat
  } = modeProps as {
    scale?: number;
    ior?: number;
    thickness?: number;
    anisotropy?: number;
    chromaticAberration?: number;
    [key: string]: unknown;
  };

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    // ── Follow pointer ──────────────────────────────────────────────────────
    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom
      ? -v.height / 2 + 0.2
      : followPointer
      ? (pointer.y * v.height) / 2
      : 0;

    easing.damp3(meshRef.current.position, [destX, destY, 15], 0.15, delta);

    // ── Auto-scale if no explicit scale supplied ─────────────────────────────
    if (scale == null) {
      const maxWorld = v.width * 0.9;
      const desired = maxWorld / geoWidthRef.current;
      meshRef.current.scale.setScalar(Math.min(0.15, desired));
    }

    // ── Capture offscreen scene to FBO (React Bits pattern) ─────────────────
    gl.setRenderTarget(buffer);
    gl.render(offscreenScene, camera);
    gl.setRenderTarget(null);
  });

  const geometry = (nodes[geometryKey] as THREE.Mesh)?.geometry;
  if (!geometry) return null;

  return (
    <>
      {/* Portal: render ambient children into the offscreen scene */}
      {createPortal(children, offscreenScene)}

      {/*
       * Glass mesh — uses MeshTransmissionMaterial with the FBO texture.
       * The material refracts the captured offscreen scene through the GLB geometry.
       */}
      <mesh
        ref={meshRef}
        scale={scale ?? 0.15}
        rotation-x={Math.PI / 2}
        geometry={geometry}
        {...props}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.15}
          thickness={thickness ?? 5}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.1}
          transmission={1}
          roughness={0}
          {...(extraMat ?? {})}
        />
      </mesh>
    </>
  );
});

// ─── Mode components ──────────────────────────────────────────────────────────

function Lens({ modeProps, ...p }: { modeProps?: ModeProps } & MeshProps) {
  return (
    <ModeWrapper
      glb="/assets/3d/lens.glb"
      geometryKey="Cylinder"
      followPointer
      lockToBottom={false}
      modeProps={modeProps}
      {...p}
    />
  );
}

function Cube({ modeProps, ...p }: { modeProps?: ModeProps } & MeshProps) {
  return (
    <ModeWrapper
      glb="/assets/3d/cube.glb"
      geometryKey="Cube"
      followPointer
      lockToBottom={false}
      modeProps={modeProps}
      {...p}
    />
  );
}

function Bar({ modeProps = {}, ...p }: { modeProps?: ModeProps } & MeshProps) {
  const defaultMat: ModeProps = {
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.15,
    color: '#ffffff',
    attenuationColor: '#ffffff',
    attenuationDistance: 0.25,
  };
  return (
    <ModeWrapper
      glb="/assets/3d/bar.glb"
      geometryKey="Cube"
      lockToBottom
      followPointer={false}
      modeProps={{ ...defaultMat, ...modeProps }}
      {...p}
    />
  );
}

// Pre-load all models to avoid runtime stutter
useGLTF.preload('/assets/3d/lens.glb');
useGLTF.preload('/assets/3d/bar.glb');
useGLTF.preload('/assets/3d/cube.glb');

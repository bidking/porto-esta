/**
 * FluidGlass — CSS-powered fluid glass cursor lens.
 *
 * Uses backdrop-filter + a layered highlight ring to simulate a refractive
 * glass lens that realistically distorts the underlying HTML page content.
 *
 * No WebGL / Three.js required — this approach works on all devices and
 * avoids the WebGL feedback-loop issue inherent in trying to capture page
 * pixels inside a transparent Canvas overlay.
 *
 * Usage:
 *   <FluidGlass mode="lens" lensProps={{ glassRadius: 120 }} />
 */

import {
  useRef,
  useEffect,
  useCallback,
  useState,
  memo,
  CSSProperties,
} from 'react';

// ─── Public types ─────────────────────────────────────────────────────────────

type Mode = 'lens' | 'bar' | 'cube';

interface SharedGlassProps {
  /** Backdrop blur in px. Default: 0 (pure refraction via scale trick) */
  blur?: number;
  /** Brightness multiplier. Default: 1.15 */
  brightness?: number;
  /** Saturation multiplier. Default: 1.4 */
  saturate?: number;
  /** Contrast multiplier. Default: 1.05 */
  contrast?: number;
  /** Extra CSS backdrop-filter tokens appended after the defaults */
  extraFilter?: string;
  /** IOR-like distortion: scales content inside lens. Default: 1.15 */
  ior?: number;
  /** Opacity of the highlight border (0–1). Default: 0.35 */
  highlightOpacity?: number;
  [key: string]: unknown;
}

interface LensSpecificProps extends SharedGlassProps {
  /** Radius of the circular lens in px. Default: 110 */
  glassRadius?: number;
}

interface BarSpecificProps extends SharedGlassProps {
  /** Height of the bar in px. Default: 52 */
  barHeight?: number;
  /** Border radius of the bar in px. Default: 22 */
  barBorderRadius?: number;
}

interface CubeSpecificProps extends SharedGlassProps {
  /** Size (width & height) of the cube lens in px. Default: 160 */
  cubeSize?: number;
  /** Border radius of the cube in px. Default: 16 */
  cubeBorderRadius?: number;
}

interface FluidGlassProps {
  mode?: Mode;
  lensProps?: LensSpecificProps;
  barProps?: BarSpecificProps;
  cubeProps?: CubeSpecificProps;
}

// ─── Entry point ─────────────────────────────────────────────────────────────

export default function FluidGlass({
  mode = 'lens',
  lensProps = {},
  barProps = {},
  cubeProps = {},
}: FluidGlassProps) {
  const mouseCSS = useRef({ x: -9999, y: -9999 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseCSS.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  if (mode === 'bar') return <GlassBar mouseCSS={mouseCSS} {...barProps} />;
  if (mode === 'cube') return <GlassCube mouseCSS={mouseCSS} {...cubeProps} />;
  return <GlassLens mouseCSS={mouseCSS} {...lensProps} />;
}

// ─── Shared hook — rAF position update ────────────────────────────────────────

function useFollowMouse(
  divRef: React.RefObject<HTMLDivElement | null>,
  mouseCSS: React.MutableRefObject<{ x: number; y: number }>,
  offsetFn: (div: HTMLDivElement) => { left: string; top: string },
) {
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;

    const loop = () => {
      const { left, top } = offsetFn(div);
      div.style.left = left;
      div.style.top = top;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [divRef, mouseCSS, offsetFn]);
}

// ─── Shared glass style builder ────────────────────────────────────────────────

function buildFilter(p: SharedGlassProps): string {
  const blur = p.blur ?? 0;
  const brightness = p.brightness ?? 1.15;
  const saturate = p.saturate ?? 1.4;
  const contrast = p.contrast ?? 1.05;

  const tokens = [
    blur > 0 ? `blur(${blur}px)` : '',
    `brightness(${brightness})`,
    `saturate(${saturate})`,
    `contrast(${contrast})`,
    p.extraFilter ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return tokens;
}

function glassBoxShadow(highlightOpacity = 0.35): string {
  const h = highlightOpacity;
  return [
    `inset 0 1.5px 2px rgba(255,255,255,${h * 1.6})`,
    `inset 0 -1px 1.5px rgba(0,0,0,${h * 0.4})`,
    `inset 1px 0 1.5px rgba(255,255,255,${h * 0.8})`,
    `inset -1px 0 1.5px rgba(255,255,255,${h * 0.5})`,
    `0 8px 32px rgba(0,0,0,0.22)`,
    `0 2px 8px rgba(0,0,0,0.14)`,
  ].join(', ');
}

const GLASS_BG =
  'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.07) 45%, rgba(255,255,255,0.18) 100%)';

// ─── Lens (circle that follows cursor) ────────────────────────────────────────

const GlassLens = memo(function GlassLens({
  mouseCSS,
  glassRadius = 110,
  highlightOpacity = 0.35,
  ior = 1.15,
  ...rest
}: LensSpecificProps & {
  mouseCSS: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const size = glassRadius * 2;

  // Move the outer container so the lens is centred on cursor
  useFollowMouse(
    outerRef,
    mouseCSS,
    useCallback(
      () => ({
        left: `${mouseCSS.current.x - glassRadius}px`,
        top: `${mouseCSS.current.y - glassRadius}px`,
      }),
      [mouseCSS, glassRadius],
    ),
  );

  // The inner "content" div is scaled by ior to simulate refraction
  const filter = buildFilter(rest);

  const containerStyle: CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    pointerEvents: 'none',
    width: size,
    height: size,
    borderRadius: '50%',
    overflow: 'hidden',
    /* glass surface visuals */
    backdropFilter: filter,
    WebkitBackdropFilter: filter,
    background: GLASS_BG,
    boxShadow: glassBoxShadow(highlightOpacity),
    border: `1px solid rgba(255,255,255,${highlightOpacity})`,
    // will-change for GPU compositing
    willChange: 'transform, left, top',
    left: '-9999px',
    top: '-9999px',
  };

  return (
    <>
      {/* Main glass disc */}
      <div ref={outerRef} style={containerStyle}>
        {/* IOR-like inner magnification layer */}
        <div
          ref={innerRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            transform: `scale(${ior})`,
            backdropFilter: `brightness(${1 + (ior - 1) * 0.3})`,
            WebkitBackdropFilter: `brightness(${1 + (ior - 1) * 0.3})`,
          }}
        />
        {/* Top specular highlight arc */}
        <div
          style={{
            position: 'absolute',
            top: '8%',
            left: '15%',
            width: '70%',
            height: '30%',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.55) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        {/* Bottom caustic shimmer */}
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '20%',
            width: '60%',
            height: '20%',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.22) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Outer glow ring */}
      <GlowRing mouseCSS={mouseCSS} size={size} radius={glassRadius} />
    </>
  );
});

// Separate glow ring so it can be positioned independently (sits outside overflow:hidden)
function GlowRing({
  mouseCSS,
  size,
  radius,
}: {
  mouseCSS: React.MutableRefObject<{ x: number; y: number }>;
  size: number;
  radius: number;
}) {
  const ringRef = useRef<HTMLDivElement>(null);

  useFollowMouse(
    ringRef,
    mouseCSS,
    useCallback(
      () => ({
        left: `${mouseCSS.current.x - radius - 3}px`,
        top: `${mouseCSS.current.y - radius - 3}px`,
      }),
      [mouseCSS, radius],
    ),
  );

  return (
    <div
      ref={ringRef}
      style={{
        position: 'fixed',
        zIndex: 9998,
        pointerEvents: 'none',
        width: size + 6,
        height: size + 6,
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow: '0 0 18px rgba(255,255,255,0.12), 0 0 6px rgba(255,255,255,0.08)',
        willChange: 'left, top',
        left: '-9999px',
        top: '-9999px',
      }}
    />
  );
}

// ─── Cube (rounded-square that follows cursor) ────────────────────────────────

const GlassCube = memo(function GlassCube({
  mouseCSS,
  cubeSize = 160,
  cubeBorderRadius = 18,
  highlightOpacity = 0.32,
  ior = 1.12,
  ...rest
}: CubeSpecificProps & {
  mouseCSS: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const half = cubeSize / 2;
  const filter = buildFilter(rest);

  useFollowMouse(
    divRef,
    mouseCSS,
    useCallback(
      () => ({
        left: `${mouseCSS.current.x - half}px`,
        top: `${mouseCSS.current.y - half}px`,
      }),
      [mouseCSS, half],
    ),
  );

  return (
    <div
      ref={divRef}
      style={{
        position: 'fixed',
        zIndex: 9999,
        pointerEvents: 'none',
        width: cubeSize,
        height: cubeSize,
        borderRadius: cubeBorderRadius,
        overflow: 'hidden',
        backdropFilter: filter,
        WebkitBackdropFilter: filter,
        background: GLASS_BG,
        boxShadow: glassBoxShadow(highlightOpacity),
        border: `1px solid rgba(255,255,255,${highlightOpacity})`,
        willChange: 'left, top',
        left: '-9999px',
        top: '-9999px',
      }}
    >
      {/* IOR scale inner */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${ior})`,
          backdropFilter: `brightness(${1 + (ior - 1) * 0.3})`,
          WebkitBackdropFilter: `brightness(${1 + (ior - 1) * 0.3})`,
        }}
      />
      {/* Top-left highlight */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '40%',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 100%)',
          borderRadius: `${cubeBorderRadius}px ${cubeBorderRadius}px 50% 50%`,
        }}
      />
    </div>
  );
});

// ─── Bar (fixed bottom bar) ───────────────────────────────────────────────────

const GlassBar = memo(function GlassBar({
  mouseCSS: _mouseCSS,
  barHeight = 52,
  barBorderRadius = 22,
  highlightOpacity = 0.3,
  ...rest
}: BarSpecificProps & {
  mouseCSS: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const filter = buildFilter(rest);

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 9999,
        pointerEvents: 'none',
        left: '50%',
        bottom: 12,
        transform: 'translateX(-50%)',
        width: 'min(480px, 90vw)',
        height: barHeight,
        borderRadius: barBorderRadius,
        overflow: 'hidden',
        backdropFilter: filter,
        WebkitBackdropFilter: filter,
        background: GLASS_BG,
        boxShadow: glassBoxShadow(highlightOpacity),
        border: `1px solid rgba(255,255,255,${highlightOpacity})`,
      }}
    >
      {/* Horizontal top highlight stripe */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '45%',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.38) 0%, transparent 100%)',
          borderRadius: `${barBorderRadius}px ${barBorderRadius}px 50% 50%`,
        }}
      />
    </div>
  );
});

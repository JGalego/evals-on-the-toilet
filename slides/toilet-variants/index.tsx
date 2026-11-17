import type { Page, SlideMeta } from '@open-slide/core';
import type { ReactNode, SVGProps } from 'react';

// Temporary contact sheet: the multiverse of white toilets. Delete once one is picked.

const W = '#ffffff';
const BG = '#0a0a0a';
const SZ = 300;
const MONO = '"Geist Mono", ui-monospace, Menlo, monospace';

// ─── One toilet, defined once (viewBox 0 0 100 100) ───────────────────────────
type R = { x: number; y: number; w: number; h: number; r: number };
const BTN: R = { x: 66, y: 2, w: 16, h: 4, r: 2 };
const TANK: R = { x: 58, y: 9, w: 32, h: 28, r: 4 };
const SEAT: R = { x: 10, y: 40, w: 80, h: 8, r: 4 };
const BASE: R = { x: 28, y: 88, w: 44, h: 6, r: 2 };
const BOWL = 'M18 51 H82 C82 64 70 73 62 77 L64 85 H36 L38 77 C30 73 18 64 18 51 Z';

const rr = (s: R) => <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={s.r} />;
const Shapes = (p: SVGProps<SVGGElement>) => (
  <g {...p}>
    {rr(BTN)}
    {rr(TANK)}
    {rr(SEAT)}
    <path d={BOWL} />
    {rr(BASE)}
  </g>
);

// clipPath can't contain a <g>, so the clip version is a bare fragment.
const ClipShapes = () => (
  <>
    {rr(BTN)}
    {rr(TANK)}
    {rr(SEAT)}
    <path d={BOWL} />
    {rr(BASE)}
  </>
);

// Deterministic PRNG so every render is identical.
const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Rasterise the same geometry onto an n×n grid.
const cache: Record<number, [number, number][]> = {};
const raster = (n: number): [number, number][] => {
  if (cache[n]) return cache[n];
  const p = new Path2D();
  for (const s of [BTN, TANK, SEAT, BASE]) p.roundRect(s.x, s.y, s.w, s.h, s.r);
  p.addPath(new Path2D(BOWL));
  const ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
  const out: [number, number][] = [];
  const cell = 100 / n;
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) if (ctx.isPointInPath(p, (i + 0.5) * cell, (j + 0.5) * cell)) out.push([i, j]);
  cache[n] = out;
  return out;
};

const Art = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 100 100" width={SZ} height={SZ} style={{ display: 'block' }} role="img" aria-label="toilet">
    {children}
  </svg>
);

// ─── 1 · Digital & print ──────────────────────────────────────────────────────
const Pixel = () => {
  const c = 100 / 32;
  return (
    <Art>
      <g fill={W} shapeRendering="crispEdges">
        {raster(32).map(([i, j]) => (
          <rect key={`${i}-${j}`} x={i * c} y={j * c} width={c} height={c} />
        ))}
      </g>
    </Art>
  );
};

const Dither = () => {
  const n = 64;
  const c = 100 / n;
  const bayer = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ];
  return (
    <Art>
      <g fill={W} shapeRendering="crispEdges">
        {raster(n).map(([i, j]) => {
          const t = 1.05 - 0.75 * (j / n) - 0.25 * (i / n);
          return bayer[j % 4][i % 4] / 16 < t ? (
            <rect key={`${i}-${j}`} x={i * c} y={j * c} width={c} height={c} />
          ) : null;
        })}
      </g>
    </Art>
  );
};

const Halftone = () => {
  const dots: ReactNode[] = [];
  for (let y = 3; y < 98; y += 4)
    for (let x = ((y / 4) | 0) % 2 ? 3 : 5; x < 98; x += 4) {
      const r = 0.45 + 1.75 * Math.max(0, 1 - 0.55 * (y / 100) - 0.35 * (x / 100));
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={r} />);
    }
  return (
    <Art>
      <defs>
        <clipPath id="tv-ht">
          <ClipShapes />
        </clipPath>
      </defs>
      <g fill={W} clipPath="url(#tv-ht)">
        {dots}
      </g>
    </Art>
  );
};

const Scanlines = () => {
  const bars: ReactNode[] = [];
  for (let k = 0; k < 34; k++) bars.push(<rect key={k} x="0" y={k * 3} width="100" height="1.9" />);
  return (
    <Art>
      <defs>
        <clipPath id="tv-sl">
          <ClipShapes />
        </clipPath>
      </defs>
      <g fill={W} clipPath="url(#tv-sl)">
        {bars}
      </g>
    </Art>
  );
};

const Ascii = () => {
  const n = 24;
  const c = 100 / n;
  const ramp = '@%#*+=-:';
  return (
    <Art>
      <g fill={W} fontFamily={MONO} fontSize={c * 1.35} textAnchor="middle" fontWeight={500}>
        {raster(n).map(([i, j]) => {
          const t = Math.min(0.99, (j / n) * 0.7 + (i / n) * 0.3);
          return (
            <text key={`${i}-${j}`} x={(i + 0.5) * c} y={(j + 0.5) * c} dominantBaseline="central">
              {ramp[(t * ramp.length) | 0]}
            </text>
          );
        })}
      </g>
    </Art>
  );
};

const Stencil = () => (
  <Art>
    <defs>
      <mask id="tv-st-m" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
        <rect width="100" height="100" fill="#fff" />
        <g fill="#000">
          <rect x="35" y="49" width="3.4" height="34" />
          <rect x="62" y="49" width="3.4" height="30" />
          <rect x="72" y="8" width="3.4" height="30" />
          <rect x="22" y="38" width="30" height="3.4" />
        </g>
      </mask>
      <filter id="tv-st-f" x="-15%" y="-15%" width="130%" height="130%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2.6" result="halo" />
        <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="1" seed="4" result="n" />
        <feColorMatrix
          in="n"
          type="matrix"
          values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  10 0 0 0 -5.6"
          result="sp"
        />
        <feComposite in="sp" in2="halo" operator="in" result="spk" />
        <feMerge>
          <feMergeNode in="spk" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#tv-st-f)">
      <g mask="url(#tv-st-m)">
        <Shapes fill={W} />
      </g>
    </g>
  </Art>
);

const Linocut = () => (
  <Art>
    <defs>
      <clipPath id="tv-lc">
        <ClipShapes />
      </clipPath>
    </defs>
    <Shapes fill={W} />
    <g clipPath="url(#tv-lc)" stroke={BG} strokeLinecap="round" fill="none">
      <g strokeWidth="1.5">
        <path d="M26 56 C28 66 36 72 44 75" />
        <path d="M32 55 C33 63 38 68 46 72" />
        <path d="M24 53 C24 60 28 65 33 69" />
        <path d="M74 56 C72 64 68 70 62 74" />
        <path d="M68 55 C68 61 65 66 60 70" />
      </g>
      <g strokeWidth="1.2">
        <path d="M80 14 L80 34" />
        <path d="M84 12 L84 33" />
        <path d="M76 16 L76 30" />
        <path d="M62 14 L62 22" />
        <path d="M18 43 L24 43" />
        <path d="M32 43 L36 43" />
        <path d="M44 43 L50 43" />
        <path d="M34 90.5 L66 90.5" />
      </g>
    </g>
  </Art>
);

const Blueprint = () => (
  <Art>
    <g fill="none" stroke={W} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <Shapes />
      <rect x="62" y="13" width="24" height="5" rx="2" strokeWidth="0.9" />
      <path d="M24 56 H76" strokeWidth="0.9" />
      <path d="M50 2 V98" strokeWidth="0.5" strokeDasharray="4 2 1 2" opacity="0.6" />
      <g strokeWidth="0.7" opacity="0.75">
        <path d="M10 97 H90" />
        <path d="M10 94.5 V99.5" />
        <path d="M90 94.5 V99.5" />
        <path d="M95 9 V37" />
        <path d="M92.5 9 H97.5" />
        <path d="M92.5 37 H97.5" />
      </g>
    </g>
  </Art>
);

// ─── 2 · By hand ──────────────────────────────────────────────────────────────
const wobble = (id: string, seed: number, scale: number, freq = 0.04) => (
  <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves="2" seed={seed} result="n" />
    <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} />
  </filter>
);

const HandDrawn = () => (
  <Art>
    <defs>
      {wobble('tv-hd1', 2, 3.2)}
      {wobble('tv-hd2', 9, 3.8)}
    </defs>
    <g fill="none" stroke={W} strokeLinecap="round" strokeLinejoin="round">
      <g filter="url(#tv-hd1)" strokeWidth="2.2">
        <Shapes />
      </g>
      <g filter="url(#tv-hd2)" strokeWidth="1.1" opacity="0.75" transform="translate(0.7 -0.5) rotate(0.6 50 50)">
        <Shapes />
      </g>
    </g>
  </Art>
);

const Painted = () => (
  <Art>
    <defs>
      <filter id="tv-pt" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="3" result="edge" />
        <feDisplacementMap in="SourceGraphic" in2="edge" scale="5" result="d" />
        <feTurbulence type="fractalNoise" baseFrequency="0.015 0.42" numOctaves="2" seed="8" result="streak" />
        <feColorMatrix
          in="streak"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.6 0 0 0 -0.45"
          result="m"
        />
        <feComposite in="d" in2="m" operator="in" />
      </filter>
    </defs>
    <Shapes fill={W} filter="url(#tv-pt)" />
  </Art>
);

const Chalk = () => (
  <Art>
    <defs>
      <filter id="tv-ch" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="5" result="w" />
        <feDisplacementMap in="SourceGraphic" in2="w" scale="2.4" result="d" />
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" result="g" />
        <feColorMatrix
          in="g"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  4 0 0 0 -1.1"
          result="gm"
        />
        <feComposite in="d" in2="gm" operator="in" />
      </filter>
    </defs>
    <Shapes fill="none" stroke={W} strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" filter="url(#tv-ch)" />
  </Art>
);

const hatch = (() => {
  let d = 'M-5 0';
  for (let k = 1; k < 52; k++) d += ` L${k % 2 ? 105 : -5} ${k * 2.5 + (k % 2 ? 16 : 0) - 8}`;
  return d;
})();

const Crayon = () => (
  <Art>
    <defs>
      <clipPath id="tv-cr-c">
        <ClipShapes />
      </clipPath>
      <filter id="tv-cr-f" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="6" result="w" />
        <feDisplacementMap in="SourceGraphic" in2="w" scale="2.6" result="d" />
        <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="2" result="g" />
        <feColorMatrix
          in="g"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5 0 0 0 -1.5"
          result="gm"
        />
        <feComposite in="d" in2="gm" operator="in" />
      </filter>
    </defs>
    <g filter="url(#tv-cr-f)">
      <g clipPath="url(#tv-cr-c)">
        <path d={hatch} fill="none" stroke={W} strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      <Shapes fill="none" stroke={W} strokeWidth="2.6" strokeLinejoin="round" />
    </g>
  </Art>
);

const Splatter = () => {
  const r = rng(7);
  const drops: ReactNode[] = [];
  for (let i = 0; i < 34; i++) {
    const a = r() * Math.PI * 2;
    const d = 40 + r() * 8 + (r() < 0.3 ? r() * 8 : 0);
    const s = r() ** 3 * 2.4 + 0.3;
    drops.push(<circle key={i} cx={50 + Math.cos(a) * d} cy={48 + Math.sin(a) * d} r={s} />);
  }
  return (
    <Art>
      <defs>
        <filter id="tv-sp" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="12" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="8" />
        </filter>
      </defs>
      <g fill={W}>
        <Shapes filter="url(#tv-sp)" />
        {drops}
      </g>
    </Art>
  );
};

const Watercolor = () => (
  <Art>
    <defs>
      <filter id="tv-wc1" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="21" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="7" result="d" />
        <feGaussianBlur in="d" stdDeviation="0.7" />
      </filter>
      <filter id="tv-wc2" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="6" result="d" />
        <feGaussianBlur in="d" stdDeviation="1.1" />
      </filter>
    </defs>
    <Shapes fill={W} opacity="0.34" filter="url(#tv-wc1)" />
    <Shapes fill={W} opacity="0.34" filter="url(#tv-wc2)" transform="translate(0.8 0.6)" />
    <Shapes fill="none" stroke={W} strokeWidth="0.9" opacity="0.7" filter="url(#tv-wc1)" />
  </Art>
);

const Scribble = () => (
  <Art>
    <defs>
      <clipPath id="tv-sc-c">
        <ClipShapes />
      </clipPath>
      {wobble('tv-sc-f', 14, 2.2, 0.06)}
    </defs>
    <g filter="url(#tv-sc-f)" fill="none" stroke={W} strokeLinecap="round" strokeLinejoin="round">
      <g clipPath="url(#tv-sc-c)">
        <path d={hatch} strokeWidth="0.95" />
      </g>
      <Shapes strokeWidth="1.3" />
    </g>
  </Art>
);

const Collage = () => (
  <Art>
    <defs>
      <filter id="tv-co" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="17" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
      </filter>
    </defs>
    <g fill={W} filter="url(#tv-co)">
      <g transform="rotate(-4 74 23)">{rr(BTN)}</g>
      <g transform="rotate(-3.5 74 23)">{rr(TANK)}</g>
      <g transform="rotate(2.4 50 44)">{rr(SEAT)}</g>
      <g transform="rotate(-2.2 50 68)">
        <path d={BOWL} />
      </g>
      <g transform="rotate(1.8 50 91)">{rr(BASE)}</g>
    </g>
  </Art>
);

// ─── 3 · Other universes ──────────────────────────────────────────────────────
const Neon = () => (
  <Art>
    <defs>
      <filter id="tv-ne" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="b1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.1" result="b2" />
        <feMerge>
          <feMergeNode in="b1" />
          <feMergeNode in="b1" />
          <feMergeNode in="b2" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <Shapes fill="none" stroke={W} strokeWidth="1.8" strokeLinejoin="round" filter="url(#tv-ne)" />
  </Art>
);

const CrossStitch = () => {
  const n = 28;
  const c = 100 / n;
  const p = c * 0.16;
  return (
    <Art>
      <g stroke={W} strokeWidth="0.75" strokeLinecap="round" fill="none">
        {raster(n).map(([i, j]) => (
          <path
            key={`${i}-${j}`}
            d={`M${i * c + p} ${j * c + p} L${(i + 1) * c - p} ${(j + 1) * c - p} M${(i + 1) * c - p} ${j * c + p} L${i * c + p} ${(j + 1) * c - p}`}
          />
        ))}
      </g>
    </Art>
  );
};

const Dotted = () => (
  <Art>
    <Shapes fill="none" stroke={W} strokeWidth="2.1" strokeLinecap="round" strokeDasharray="0.01 3.3" />
  </Art>
);

const Glitch = () => {
  const r = rng(31);
  const bands: ReactNode[] = [];
  const defs: ReactNode[] = [];
  let y = 0;
  let k = 0;
  while (y < 100) {
    const h = 3 + r() * 9;
    const dx = r() < 0.5 ? 0 : (r() - 0.5) * 14;
    defs.push(
      <clipPath key={`c${k}`} id={`tv-gl-${k}`}>
        <rect x="-20" y={y} width="140" height={h + 0.2} />
      </clipPath>,
    );
    bands.push(
      <g key={`b${k}`} clipPath={`url(#tv-gl-${k})`}>
        <Shapes fill={W} transform={`translate(${dx.toFixed(2)} 0)`} />
      </g>,
    );
    y += h;
    k++;
  }
  return (
    <Art>
      <defs>{defs}</defs>
      {bands}
    </Art>
  );
};

const Bubble = () => (
  <Art>
    <Shapes fill="none" stroke={W} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
  </Art>
);

const Felt = () => (
  <Art>
    <defs>
      <filter id="tv-fe" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="2" seed="9" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" result="d" />
        <feGaussianBlur in="d" stdDeviation="0.55" result="b" />
        <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="3" result="f" />
        <feColorMatrix
          in="f"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.4 0 0 0 0.35"
          result="fm"
        />
        <feComposite in="b" in2="fm" operator="in" />
      </filter>
    </defs>
    <Shapes fill={W} filter="url(#tv-fe)" />
  </Art>
);

const Tile = () => {
  const n = 24;
  const c = 100 / n;
  const r = rng(5);
  return (
    <Art>
      <g fill={W}>
        {raster(n).map(([i, j]) => {
          const s = c * (0.8 + r() * 0.14);
          const o = (c - s) / 2;
          return <rect key={`${i}-${j}`} x={i * c + o} y={j * c + o} width={s} height={s} rx="0.5" />;
        })}
      </g>
    </Art>
  );
};

const Wireframe = () => {
  const lines: ReactNode[] = [];
  for (let k = 0; k <= 100; k += 3.5) {
    lines.push(<path key={`h${k}`} d={`M0 ${k} H100`} />);
    lines.push(<path key={`v${k}`} d={`M${k} 0 V100`} />);
  }
  return (
    <Art>
      <defs>
        <clipPath id="tv-wf">
          <ClipShapes />
        </clipPath>
      </defs>
      <g clipPath="url(#tv-wf)" stroke={W} strokeWidth="0.35" opacity="0.8">
        {lines}
      </g>
      <Shapes fill="none" stroke={W} strokeWidth="1.2" strokeLinejoin="round" />
    </Art>
  );
};

// ─── Sheet layout ─────────────────────────────────────────────────────────────
const Cell = ({ n, name, children }: { n: string; name: string; children: ReactNode }) => (
  <div>
    <div
      style={{
        width: SZ,
        height: SZ,
        background: '#111111',
        border: '1px solid #292929',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
    <div
      style={{
        marginTop: 14,
        fontFamily: MONO,
        fontSize: 20,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#929292',
      }}
    >
      {n} · {name}
    </div>
  </div>
);

const Sheet = ({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: BG,
      color: '#ededed',
      boxSizing: 'border-box',
      padding: '72px 128px 0',
      fontFamily: '"Geist", system-ui, sans-serif',
    }}
  >
    <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#929292' }}>
      {eyebrow}
    </div>
    <div style={{ fontSize: 64, fontWeight: 500, letterSpacing: '-0.04em', margin: '16px 0 52px' }}>{title}</div>
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(4, ${SZ}px)`, columnGap: 74, rowGap: 40 }}>{children}</div>
  </div>
);

const Digital: Page = () => (
  <Sheet eyebrow="Multiverse · 1 / 3" title="Digital & print.">
    <Cell n="01" name="Pixel">
      <Pixel />
    </Cell>
    <Cell n="02" name="Dither">
      <Dither />
    </Cell>
    <Cell n="03" name="Halftone">
      <Halftone />
    </Cell>
    <Cell n="04" name="Scanlines">
      <Scanlines />
    </Cell>
    <Cell n="05" name="ASCII">
      <Ascii />
    </Cell>
    <Cell n="06" name="Stencil">
      <Stencil />
    </Cell>
    <Cell n="07" name="Linocut">
      <Linocut />
    </Cell>
    <Cell n="08" name="Blueprint">
      <Blueprint />
    </Cell>
  </Sheet>
);

const Hand: Page = () => (
  <Sheet eyebrow="Multiverse · 2 / 3" title="By hand.">
    <Cell n="09" name="Hand-drawn">
      <HandDrawn />
    </Cell>
    <Cell n="10" name="Painted">
      <Painted />
    </Cell>
    <Cell n="11" name="Chalk">
      <Chalk />
    </Cell>
    <Cell n="12" name="Crayon">
      <Crayon />
    </Cell>
    <Cell n="13" name="Ink splatter">
      <Splatter />
    </Cell>
    <Cell n="14" name="Watercolor">
      <Watercolor />
    </Cell>
    <Cell n="15" name="Scribble">
      <Scribble />
    </Cell>
    <Cell n="16" name="Paper collage">
      <Collage />
    </Cell>
  </Sheet>
);

const Other: Page = () => (
  <Sheet eyebrow="Multiverse · 3 / 3" title="Other universes.">
    <Cell n="17" name="Neon">
      <Neon />
    </Cell>
    <Cell n="18" name="Cross-stitch">
      <CrossStitch />
    </Cell>
    <Cell n="19" name="Dotted">
      <Dotted />
    </Cell>
    <Cell n="20" name="Glitch">
      <Glitch />
    </Cell>
    <Cell n="21" name="Bubble">
      <Bubble />
    </Cell>
    <Cell n="22" name="Felt">
      <Felt />
    </Cell>
    <Cell n="23" name="Bathroom tile">
      <Tile />
    </Cell>
    <Cell n="24" name="Wireframe">
      <Wireframe />
    </Cell>
  </Sheet>
);

export const meta: SlideMeta = {
  title: 'Toilet variants (temporary)',
  createdAt: '2026-11-17T13:18:23.113Z',
};
export default [Digital, Hand, Other] satisfies Page[];

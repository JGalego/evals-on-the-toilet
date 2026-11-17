import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  Step,
  Steps,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';
import logo from '@assets/logo.svg';
import book from './assets/how-google-tests-software.jpg';
import stall from './assets/tott-stall.jpg';

// ─── Panel-tweakable design tokens ────────────────────────────────────────────
export const design: DesignSystem = {
  palette: {
    bg: '#0a0a0a',
    text: '#ededed',
    accent: '#52a8ff',
  },
  fonts: {
    display: '"Geist", "Inter", system-ui, -apple-system, sans-serif',
    body: '"Geist", "Inter", system-ui, -apple-system, sans-serif',
  },
  typeScale: {
    hero: 150,
    body: 34,
  },
  radius: 12,
};

// ─── Local constants ──────────────────────────────────────────────────────────
const c = {
  muted: '#929292',
  dim: '#606060',
  rule: '#292929',
  surface: '#111111',
  surfaceHi: '#171717',
  bar: '#2e2e2e',
  green: '#23703f',
  red: '#e5484d',
};
const mono = '"Geist Mono", "JetBrains Mono", ui-monospace, Menlo, monospace';
const condensed = '"Oswald", "Arial Narrow", Impact, sans-serif';
const EASE = 'cubic-bezier(.2,.7,.2,1)';

// ─── Fonts + keyframes, injected once ─────────────────────────────────────────
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Oswald:wght@700&display=swap';
const FONT_LINK_ID = 'osd-webfont-evals-on-the-toilet';
const STYLE_ID = 'osd-style-evals-on-the-toilet';
if (typeof document !== 'undefined') {
  document.getElementById(FONT_LINK_ID)?.remove();
  const link = document.createElement('link');
  link.id = FONT_LINK_ID;
  link.rel = 'stylesheet';
  link.href = FONT_HREF;
  document.head.appendChild(link);
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      @keyframes eot-up    { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
      @keyframes eot-fade  { from { opacity: 0; } to { opacity: 1; } }
      @keyframes eot-draw  { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
      @keyframes eot-grow  { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      @keyframes eot-spin  { to { transform: rotate(360deg); } }
      @keyframes eot-hl    { 0%, 16% { opacity: 1; } 24%, 92% { opacity: 0; } 100% { opacity: 1; } }
      @keyframes eot-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
    `;
    document.head.appendChild(style);
  }
}

/** Entrance animations only play on the page the audience is watching. */
const useReveal = () => {
  const on = useIsActivePage();
  return (delay = 0, kind = 'up', ms = 700): CSSProperties =>
    on ? { animation: `eot-${kind} ${ms}ms ${EASE} ${delay}ms both` } : {};
};

// ─── Transitions: one quiet family ────────────────────────────────────────────
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

export const transition: SlideTransition = {
  duration: 200,
  exit: {
    duration: 140,
    easing: EASE_IN,
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-4px)' },
    ],
  },
  enter: {
    duration: 220,
    delay: 80,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

const settle: SlideTransition = {
  duration: 280,
  exit: {
    duration: 160,
    easing: EASE_IN,
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-6px)' },
    ],
  },
  enter: {
    duration: 280,
    delay: 100,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' },
      { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
    ],
  },
};

// ─── Shared chrome ────────────────────────────────────────────────────────────
const PAD = 128;

const monoText = (size: number, extra?: CSSProperties): CSSProperties => ({
  fontFamily: mono,
  fontFeatureSettings: '"calt" 0, "liga" 0',
  fontSize: size,
  ...extra,
});

const Footer = () => {
  const { current } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: PAD,
        right: PAD,
        top: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        ...monoText(18, { letterSpacing: '0.08em', textTransform: 'uppercase', color: c.dim }),
      }}
    >
      <span>Evals on the Toilet</span>
      <span>{String(current).padStart(2, '0')}</span>
    </div>
  );
};

const Frame = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: `112px ${PAD}px 0`,
      boxSizing: 'border-box',
    }}
  >
    {children}
    <Footer />
  </div>
);

const Eyebrow = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div
    style={monoText(20, {
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: c.muted,
      ...style,
    })}
  >
    {children}
  </div>
);

/** Gray lead-in, white payoff — the two-tone headline. */
const Dim = ({ children }: { children: ReactNode }) => <span style={{ color: c.muted }}>{children}</span>;

const sans = (size: number, extra?: CSSProperties): CSSProperties => ({
  fontFamily: 'var(--osd-font-display)',
  fontWeight: 500,
  fontSize: size,
  lineHeight: 1.1,
  letterSpacing: '-0.04em',
  ...extra,
});

const Head = ({ eyebrow, title }: { eyebrow: string; title: ReactNode }) => {
  const r = useReveal();
  return (
    <div>
      <Eyebrow style={r(0, 'fade', 600)}>{eyebrow}</Eyebrow>
      <h2 style={sans(80, { margin: '24px 0 0', ...r(60) })}>{title}</h2>
    </div>
  );
};

const Label = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div
    style={monoText(18, {
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: c.dim,
      ...style,
    })}
  >
    {children}
  </div>
);

/** Card with a code-editor title bar. */
const Window = ({
  title,
  tag,
  children,
  style,
}: {
  title: string;
  tag?: string;
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <div
    style={{
      background: c.surface,
      border: `1px solid ${c.rule}`,
      borderRadius: 'var(--osd-radius)',
      overflow: 'hidden',
      ...style,
    }}
  >
    <div
      style={{
        height: 52,
        display: 'grid',
        gridTemplateColumns: '120px 1fr 120px',
        alignItems: 'center',
        padding: '0 22px',
        borderBottom: `1px solid ${c.rule}`,
        ...monoText(18, { color: c.dim }),
      }}
    >
      <span style={{ letterSpacing: 6, color: c.bar, fontSize: 14 }}>●●●</span>
      <span style={{ textAlign: 'center', color: c.muted }}>{title}</span>
      <span style={{ textAlign: 'right' }}>{tag}</span>
    </div>
    {children}
  </div>
);

// ─── 01 · Cover ───────────────────────────────────────────────────────────────
const Cover: Page = () => {
  const r = useReveal();
  return (
    <Frame>
      <h1
        style={{
          fontFamily: condensed,
          fontWeight: 700,
          fontSize: 'var(--osd-size-hero)',
          lineHeight: 1,
          letterSpacing: '-0.01em',
          textTransform: 'uppercase',
          margin: '48px 0 0',
          ...r(0, 'up', 900),
        }}
      >
        Evals on the Toilet
      </h1>
      <div style={{ position: 'absolute', left: PAD, top: 700, ...r(400) }}>
        <div style={sans(64)}>Evals are to models</div>
        <div style={sans(64, { color: c.muted })}>what tests are to software.</div>
      </div>
      {/* one slot, 24 universes: the same animated toilet as the README */}
      <img
        src={logo}
        alt="A white toilet that keeps shifting between art styles"
        style={{
          position: 'absolute',
          right: PAD + 112,
          top: 441,
          width: 400,
          height: 400,
          ...r(600, 'fade', 900),
        }}
      />
      {/* vertical hairline + rotated caption, right edge */}
      <div
        style={{
          position: 'absolute',
          right: PAD + 56,
          top: 170,
          height: 750,
          width: 1,
          background: c.rule,
          transformOrigin: 'top',
          ...r(300, 'grow', 1200),
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: PAD,
          top: 690,
          writingMode: 'vertical-rl',
          ...monoText(18, { letterSpacing: '0.2em', color: c.dim }),
          ...r(900, 'fade'),
        }}
      >
        ASSERT → MEASURE
      </div>
    </Frame>
  );
};
Cover.transition = settle;

// ─── 02 · Origin ──────────────────────────────────────────────────────────────
const Photo = ({ src, alt, width, delay }: { src: string; alt: string; width: number; delay: number }) => {
  const r = useReveal();
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width,
        height: 620,
        objectFit: 'cover',
        borderRadius: 'var(--osd-radius)',
        border: `1px solid ${c.rule}`,
        ...r(delay),
      }}
    />
  );
};

const Origin: Page = () => {
  const r = useReveal();
  return (
    <Frame>
      <Head
        eyebrow="Where the name comes from"
        title={
          <>
            <Dim>Borrowed from</Dim> Google.
          </>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 471px 470px', gap: 64, marginTop: 80, height: 620 }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={r(250)}>
            <Label>Testing → Tech on the Toilet</Label>
            <div style={{ fontSize: 38, lineHeight: 1.3, letterSpacing: '-0.02em', marginTop: 16 }}>
              A weekly one-pager in Google’s bathroom stalls.
            </div>
          </div>
          <div style={r(450)}>
            <Label>The books</Label>
            <div style={sans(40, { marginTop: 16 })}>How Google Tests Software</div>
            <div style={{ fontSize: 28, color: c.muted, marginTop: 10, letterSpacing: '-0.01em' }}>
              Whittaker, Arbon &amp; Carollo, 2012
            </div>
            <div style={sans(40, { marginTop: 28 })}>Software Engineering at Google</div>
            <div style={{ fontSize: 28, color: c.muted, marginTop: 10, letterSpacing: '-0.01em' }}>
              Winters, Manshreck &amp; Wright, 2020
            </div>
          </div>
          <Label style={{ fontSize: 16, ...r(900, 'fade') }}>Images: Google Testing Blog · Addison-Wesley</Label>
        </div>
        <Photo src={stall} alt="Tech on the Toilet pages posted on a bathroom stall door" width={471} delay={300} />
        <Photo src={book} alt="Cover of How Google Tests Software" width={470} delay={500} />
      </div>
    </Frame>
  );
};

// ─── 03 · The analogy ─────────────────────────────────────────────────────────
const AnalogyRow = ({ domain, tool, noun, delay }: { domain: string; tool: string; noun: string; delay: number }) => {
  const r = useReveal();
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '300px 460px 1fr',
        alignItems: 'baseline',
        padding: '48px 0',
        borderTop: `1px solid ${c.rule}`,
        ...r(delay),
      }}
    >
      <Label>{domain}</Label>
      <div style={sans(128)}>{tool}</div>
      <div style={{ fontSize: 40, color: c.muted, letterSpacing: '-0.02em' }}>
        check the <span style={{ color: 'var(--osd-text)' }}>{noun}</span>.
      </div>
    </div>
  );
};

const Analogy: Page = () => {
  const r = useReveal();
  return (
    <Frame>
      <Head
        eyebrow="The analogy"
        title={
          <>
            <Dim>Same job,</Dim> different material.
          </>
        }
      />
      <div style={{ marginTop: 88, borderBottom: `1px solid ${c.rule}` }}>
        <AnalogyRow domain="Software" tool="Tests" noun="code" delay={250} />
        <AnalogyRow domain="Models" tool="Evals" noun="model" delay={450} />
      </div>
      <p style={{ fontSize: 32, color: c.muted, letterSpacing: '-0.02em', margin: '44px 0 0', ...r(750, 'fade') }}>
        “Model” here is the whole system: weights, prompt, tools, harness.
      </p>
    </Frame>
  );
};

// ─── 04 · Assert vs measure ───────────────────────────────────────────────────
const Pill = ({ children, on }: { children: ReactNode; on?: boolean }) => (
  <div
    style={{
      ...monoText(28),
      padding: '16px 40px',
      borderRadius: 999,
      background: on ? 'var(--osd-text)' : 'transparent',
      color: on ? 'var(--osd-bg)' : c.dim,
      border: `1px solid ${on ? 'var(--osd-text)' : c.rule}`,
    }}
  >
    {children}
  </div>
);

const Histogram = () => {
  const r = useReveal();
  // A deterministic, slightly lumpy bell — scores from many runs.
  const jitter = [0.02, -0.03, 0.04, -0.02, 0.03, 0.05, -0.04, 0.02, -0.03, 0.03, -0.02, 0.04, -0.03, 0.02, -0.01];
  const bars = jitter.map((j, i) => Math.max(0.06, Math.exp(-(((i - 8.2) / 2.8) ** 2) / 2) + j));
  return (
    <div style={{ position: 'relative', height: 210 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 190 }}>
        {bars.map((h, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: decorative
            key={i}
            style={{
              flex: 1,
              height: `${h * 100}%`,
              background: c.bar,
              borderRadius: '4px 4px 0 0',
              transformOrigin: 'bottom',
              ...r(500 + i * 45, 'grow', 600),
            }}
          />
        ))}
      </div>
      <div style={{ height: 1, background: c.dim }} />
      {/* 95% interval around the mean. The tint sits on an inner node: the fade-in
          animation ends at opacity 1 and would override a static opacity on the same node. */}
      <div style={{ position: 'absolute', left: '51%', width: '14%', top: -6, bottom: 20, ...r(1250, 'fade') }}>
        <div style={{ width: '100%', height: '100%', background: 'var(--osd-accent)', opacity: 0.14 }} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: '58%',
          top: -6,
          bottom: 0,
          borderLeft: '2px dashed var(--osd-accent)',
          ...r(1200, 'fade'),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '58%',
          top: -40,
          transform: 'translateX(-50%)',
          ...monoText(22, { color: 'var(--osd-accent)' }),
          ...r(1300, 'fade'),
        }}
      >
        0.87
      </div>
      <Label style={{ position: 'absolute', right: 0, top: -36, ...r(1400, 'fade') }}>n = 500 · 95% CI</Label>
    </div>
  );
};

const PanelBody = ({ children }: { children: ReactNode }) => (
  <div style={{ padding: '44px 52px 48px', display: 'flex', flexDirection: 'column', gap: 36 }}>{children}</div>
);

const Code = ({ children }: { children: ReactNode }) => <div style={monoText(32)}>{children}</div>;

const AssertMeasure: Page = () => {
  const r = useReveal();
  return (
    <Frame>
      <Head
        eyebrow="The difference"
        title={
          <>
            <Dim>Tests assert.</Dim> Evals measure.
          </>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 72 }}>
        <Window title="test_model.py" tag="PY" style={r(200)}>
          <PanelBody>
            <Code>assert f(x) == y</Code>
            <div style={{ height: 210, display: 'flex', alignItems: 'center', gap: 20 }}>
              <Pill on>pass</Pill>
              <Pill>fail</Pill>
            </div>
            <div style={sans(44)}>A verdict.</div>
          </PanelBody>
        </Window>
        <Window title="eval_model.py" tag="PY" style={r(380)}>
          <PanelBody>
            <Code>
              score(model, D) <span style={{ color: c.dim }}>→</span> 0.87{' '}
              <span style={{ color: c.muted }}>± 0.03</span>
            </Code>
            <Histogram />
            <div style={sans(44)}>A distribution.</div>
          </PanelBody>
        </Window>
      </div>
    </Frame>
  );
};

// ─── 05 · Expansion ───────────────────────────────────────────────────────────
const Term = ({ term, title, lead }: { term: ReactNode; title: string; lead?: boolean }) => (
  <div style={{ borderTop: `1px solid ${lead ? 'var(--osd-text)' : c.rule}`, paddingTop: 36 }}>
    <div style={sans(64, { height: 80, color: lead ? 'var(--osd-text)' : c.muted })}>{term}</div>
    <Label style={{ marginTop: 32, color: lead ? 'var(--osd-text)' : c.dim }}>{title}</Label>
  </div>
);

const Plus = () => <span style={{ color: c.dim, marginRight: 14 }}>+</span>;

const Expansion: Page = () => {
  const r = useReveal();
  return (
    <Frame>
      <Head
        eyebrow="A Taylor series, loosely"
        title={
          <>
            <Dim>Evals,</Dim> expanded around tests.
          </>
        }
      />
      <div style={monoText(26, { color: c.dim, marginTop: 72, ...r(200) })}>eval(m) ≈</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 48,
          marginTop: 28,
          ...r(300),
        }}
      >
        <Steps>
          <Term lead term="Test" title="Pass / fail" />
          <Step duration={320}>
            <Term
              term={
                <>
                  <Plus />
                  δ·score
                </>
              }
              title="Partial credit"
            />
          </Step>
          <Step duration={320}>
            <Term
              term={
                <>
                  <Plus />½ σ²
                </>
              }
              title="Variance"
            />
          </Step>
          <Step duration={320}>
            <Term
              term={
                <>
                  <Plus />
                  O(shift)
                </>
              }
              title="Drift"
            />
          </Step>
        </Steps>
      </div>
      <p style={{ fontSize: 32, color: c.muted, letterSpacing: '-0.02em', marginTop: 112, ...r(500, 'fade') }}>
        Even at temperature 0, every term survives.
      </p>
    </Frame>
  );
};

// ─── 06 · Same toolbox ────────────────────────────────────────────────────────
const MapRow = ({ from, to, delay }: { from: string; to: string; delay: number }) => {
  const r = useReveal();
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '640px 200px 1fr',
        alignItems: 'center',
        height: 112,
        borderTop: `1px solid ${c.rule}`,
        ...r(delay),
      }}
    >
      <div style={sans(46, { color: c.muted })}>{from}</div>
      <svg width="140" height="16" viewBox="0 0 140 16" aria-hidden>
        <path
          d="M0 8 H134 M126 1 L136 8 L126 15"
          fill="none"
          stroke={c.dim}
          strokeWidth="2"
          pathLength={1}
          strokeDasharray="1"
          style={r(delay + 200, 'draw', 600)}
        />
      </svg>
      <div style={sans(46)}>{to}</div>
    </div>
  );
};

const Toolbox: Page = () => {
  const r = useReveal();
  return (
    <Frame>
      <Head
        eyebrow="The mapping"
        title={
          <>
            <Dim>Same toolbox,</Dim> new material.
          </>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: '840px 1fr', marginTop: 72, marginBottom: 20 }}>
        <Label>In software</Label>
        <Label style={{ color: 'var(--osd-text)' }}>In evals</Label>
      </div>
      <div style={{ borderBottom: `1px solid ${c.rule}` }}>
        <MapRow from="Unit test" to="Component eval" delay={200} />
        <MapRow from="Integration test" to="End-to-end task eval" delay={320} />
        <MapRow from="Regression suite" to="Golden set" delay={440} />
        <MapRow from="Presubmit, then post-submit" to="Smoke evals, then the full suite" delay={560} />
      </div>
      <p style={{ fontSize: 32, color: c.muted, letterSpacing: '-0.02em', margin: '44px 0 0', ...r(900, 'fade') }}>
        Borrow the workflow, not the certainty.
      </p>
    </Frame>
  );
};

// ─── 07 · Pydantic Evals ──────────────────────────────────────────────────────
const ApiRow = ({ api, meaning, delay }: { api: string; meaning: string; delay: number }) => {
  const r = useReveal();
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '760px 1fr',
        alignItems: 'center',
        height: 88,
        padding: '0 48px',
        borderTop: `1px solid ${c.rule}`,
        ...r(delay),
      }}
    >
      <div style={monoText(30)}>{api}</div>
      <div style={{ fontSize: 32, color: c.muted, letterSpacing: '-0.02em' }}>{meaning}</div>
    </div>
  );
};

const Pydantic: Page = () => {
  const r = useReveal();
  return (
    <Frame>
      <Head
        eyebrow="In practice"
        title={
          <>
            <Dim>Pydantic Evals,</Dim> read as pytest.
          </>
        }
      />
      <Window title="pydantic_evals  ↔  pytest" style={{ marginTop: 64, ...r(160) }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '760px 1fr',
            padding: '22px 48px',
          }}
        >
          <Label>Pydantic Evals</Label>
          <Label>Unit testing</Label>
        </div>
        <ApiRow api="Case" meaning="Test case" delay={260} />
        <ApiRow api="Evaluator" meaning="Assertion, with scores" delay={340} />
        <ApiRow api="Dataset" meaning="Test suite" delay={420} />
        <ApiRow api="dataset.evaluate_sync(task)" meaning="pytest" delay={500} />
        <ApiRow api="EvaluationReport" meaning="Test report" delay={580} />
      </Window>
      <p style={{ fontSize: 30, color: c.muted, letterSpacing: '-0.02em', margin: '30px 0 0', ...r(800, 'fade') }}>
        Their table, and their caveat:{' '}
        <span style={{ color: 'var(--osd-text)' }}>“a useful metaphor (although not perfect).”</span>
      </p>
    </Frame>
  );
};

// ─── 08 · Where it breaks ─────────────────────────────────────────────────────
const Icon = ({ children }: { children: ReactNode }) => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    stroke="var(--osd-text)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {children}
  </svg>
);

const Card = ({ children, delay, style }: { children: ReactNode; delay: number; style?: CSSProperties }) => {
  const r = useReveal();
  return (
    <div
      style={{
        background: c.surface,
        border: `1px solid ${c.rule}`,
        borderRadius: 'var(--osd-radius)',
        ...style,
        ...r(delay),
      }}
    >
      {children}
    </div>
  );
};

const BreakCard = ({ icon, title, body, delay }: { icon: ReactNode; title: string; body: string; delay: number }) => (
  <Card delay={delay} style={{ padding: '44px 32px', height: 420, boxSizing: 'border-box' }}>
    {icon}
    <div style={sans(44, { marginTop: 48 })}>{title}</div>
    <div style={{ fontSize: 28, lineHeight: 1.45, color: c.muted, marginTop: 16, letterSpacing: '-0.01em' }}>
      {body}
    </div>
  </Card>
);

const Breaks: Page = () => (
  <Frame>
    <Head
      eyebrow="Caveats"
      title={
        <>
          <Dim>Where the analogy</Dim> breaks.
        </>
      }
    />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24, marginTop: 80 }}>
      <BreakCard
        delay={200}
        title="Noise"
        body="Same input, different output."
        icon={
          <Icon>
            <path d="M4 32 L12 22 L18 40 L26 16 L32 44 L40 20 L46 38 L52 26 L60 32" />
          </Icon>
        }
      />
      <BreakCard
        delay={300}
        title="No spec"
        body="The eval set is a proxy, not the spec."
        icon={
          <Icon>
            <path d="M16 6 H40 L50 16 V58 H16 Z" strokeDasharray="5 5" />
            <path d="M28 28 a5 5 0 1 1 6 5 v4 M33 44 v1" />
          </Icon>
        }
      />
      <BreakCard
        delay={400}
        title="Goodhart"
        body="Optimized scores stop meaning things."
        icon={
          <Icon>
            <circle cx="30" cy="34" r="24" />
            <circle cx="30" cy="34" r="14" />
            <circle cx="30" cy="34" r="4" />
            <path d="M30 34 L58 6 M50 6 H58 V14" />
          </Icon>
        }
      />
      <BreakCard
        delay={500}
        title="Leakage"
        body="Answers leak: in training, and at run time."
        icon={
          <Icon>
            <circle cx="24" cy="32" r="18" />
            <circle cx="40" cy="32" r="18" />
            <path d="M32 18 V46" strokeDasharray="3 4" />
          </Icon>
        }
      />
      <BreakCard
        delay={600}
        title="Gaming"
        body="The model can spot the test, then exploit it."
        icon={
          <Icon>
            <path d="M4 32 C16 12 48 12 60 32 C48 52 16 52 4 32 Z" />
            <circle cx="32" cy="32" r="9" />
          </Icon>
        }
      />
    </div>
  </Frame>
);

// ─── 09 · Testing on the Toilet ───────────────────────────────────────────────
const TipCard = ({ from, title, body, delay }: { from: string; title: string; body: string; delay: number }) => (
  <Card delay={delay} style={{ padding: '36px 44px' }}>
    <Label>← {from}</Label>
    <div style={sans(44, { marginTop: 18 })}>{title}</div>
    <div style={{ fontSize: 29, color: c.muted, marginTop: 10, letterSpacing: '-0.01em' }}>{body}</div>
  </Card>
);

const Toilet: Page = () => (
  <Frame>
    <Head
      eyebrow="Stall, blog and book"
      title={
        <>
          <Dim>Google’s testing tips,</Dim> ported to evals.
        </>
      }
    />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 80 }}>
      <TipCard
        delay={250}
        from="Mutation testing"
        title="Mutation-test your graders"
        body="Seed known-bad answers. Read the survivors."
      />
      <TipCard
        delay={350}
        from="Narrow assertions"
        title="Spare the paraphrases"
        body="Accept correct rewordings."
      />
      <TipCard delay={450} from="A/B diff testing" title="Run A vs A before A vs B" body="Know the noise floor first." />
      <TipCard
        delay={550}
        from="Verify state-changing calls"
        title="Grade writes, not reads"
        body="Judge outcomes, not steps. Then read the transcript."
      />
    </div>
  </Frame>
);

// ─── 10 · The fine print becomes the rule ─────────────────────────────────────
const FlipRow = ({
  rule,
  finePrint,
  next,
  delay,
}: {
  rule: string;
  finePrint: string;
  next: ReactNode;
  delay: number;
}) => {
  const r = useReveal();
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '700px 1fr',
        alignItems: 'center',
        minHeight: 150,
        borderTop: `1px solid ${c.rule}`,
      }}
    >
      <div>
        <div style={sans(46, { color: c.dim, ...r(delay, 'fade') })}>{rule}</div>
        <div style={monoText(22, { color: c.muted, marginTop: 14, ...r(delay + 400, 'fade') })}>
          <span style={{ color: 'var(--osd-accent)' }}>*</span> {finePrint}
        </div>
      </div>
      <div style={sans(46, r(delay + 800))}>{next}</div>
    </div>
  );
};

const Flips: Page = () => (
  <Frame>
    <Head
      eyebrow="Fine print"
      title={
        <>
          <Dim>Google’s exceptions</Dim> become the rule.
        </>
      }
    />
    <div style={{ display: 'grid', gridTemplateColumns: '700px 1fr', marginTop: 72, marginBottom: 16 }}>
      <Label>In software: the fine print</Label>
      <Label style={{ color: 'var(--osd-text)' }}>In evals: the main text</Label>
    </div>
    <div style={{ borderBottom: `1px solid ${c.rule}` }}>
      <FlipRow
        delay={200}
        rule="Tests have no tests."
        finePrint="nontrivial test utilities get their own"
        next="Test graders against human labels."
      />
      <FlipRow
        delay={900}
        rule="Fix flakiness."
        finePrint="unless production code is nondeterministic"
        next={
          <>
            Report pass<sup style={{ fontSize: '0.6em' }}>k</sup>. Still fix the harness.
          </>
        }
      />
      <FlipRow
        delay={1600}
        rule="Never change tests."
        finePrint="unless the requirements change"
        next="Rotate what you tune on. Keep regressions."
      />
    </div>
  </Frame>
);

// ─── 11 · Green dashboard ─────────────────────────────────────────────────────
const COLS = 41;
const ROWS = 5;
const isFail = (i: number) => (i * 53 + 11) % (COLS * ROWS) < 16; // 16 / 205 fail → 92.2%

const Dashboard: Page = () => {
  const r = useReveal();
  const on = useIsActivePage();
  const cells = Array.from({ length: COLS * ROWS }, (_, i) => i);
  return (
    <Frame>
      <Eyebrow style={r(0, 'fade')}>A warning</Eyebrow>
      <h2 style={sans(112, { lineHeight: 1.02, margin: '28px 0 0', ...r(100, 'up', 900) })}>
        A green dashboard
        <br />
        <Dim>is not a good model.</Dim>
      </h2>
      <p style={{ fontSize: 36, color: c.muted, margin: '40px 0 0', letterSpacing: '-0.02em', ...r(400) }}>
        Read the failures.
      </p>
      <div
        style={{
          position: 'absolute',
          left: PAD,
          right: PAD,
          top: 690,
          display: 'flex',
          justifyContent: 'space-between',
          ...monoText(20, { letterSpacing: '0.08em', color: c.dim }),
          ...r(600, 'fade'),
        }}
      >
        <span>
          PASS RATE <span style={{ color: 'var(--osd-text)' }}>92.2%</span> ▲ 0.4
        </span>
        <span>
          N = 205 · ONE CASE = 0.49 · 95% CI <span style={{ color: 'var(--osd-text)' }}>± 3.7</span>
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: PAD,
          right: PAD,
          top: 740,
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: 10,
        }}
      >
        {cells.map((i) => (
          <div
            key={i}
            style={{
              height: 30,
              borderRadius: 4,
              background: isFail(i) ? c.red : c.green,
              ...r(700 + (i % COLS) * 22, 'fade', 400),
              ...(on && isFail(i)
                ? {
                    animation: `eot-fade 400ms ${EASE} ${700 + (i % COLS) * 22}ms both, eot-pulse 2.4s ease-in-out 2200ms infinite`,
                  }
                : {}),
            }}
          />
        ))}
      </div>
    </Frame>
  );
};
Dashboard.transition = settle;

// ─── 12 · The eval loop ───────────────────────────────────────────────────────
const LOOP_S = 8; // seconds per lap — the list highlight and the orbiting dot share it

const LoopStep = ({ n, title }: { n: number; title: string }) => {
  const on = useIsActivePage();
  const r = useReveal();
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'baseline',
        gap: 32,
        padding: '24px 32px',
        ...r(150 + n * 100),
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'var(--osd-radius)',
          background: c.surfaceHi,
          border: `1px solid ${c.rule}`,
          opacity: 0,
          ...(on
            ? { animation: `eot-hl ${LOOP_S}s ease-in-out ${((n - 1) * LOOP_S) / 4 + 1.2 - 0.64}s infinite` }
            : {}),
        }}
      />
      <span style={{ position: 'relative', ...monoText(22, { color: c.dim }) }}>{String(n).padStart(2, '0')}</span>
      <span style={{ position: 'relative', ...sans(50) }}>{title}</span>
    </div>
  );
};

const LoopNode = ({ x, y, n }: { x: number; y: number; n: number }) => (
  <g>
    <circle cx={x} cy={y} r="30" fill="var(--osd-bg)" stroke={c.dim} strokeWidth="1.5" />
    <text x={x} y={y + 7} textAnchor="middle" fontFamily={mono} fontSize="20" fill="var(--osd-text)">
      {String(n).padStart(2, '0')}
    </text>
  </g>
);

const Loop: Page = () => {
  const r = useReveal();
  const on = useIsActivePage();
  const C = 280;
  const R = 210;
  return (
    <Frame>
      <Head
        eyebrow="The workflow"
        title={
          <>
            <Dim>The eval</Dim> loop.
          </>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 600px', alignItems: 'center', marginTop: 12 }}>
        <div>
          <LoopStep n={1} title="Inspect failures" />
          <LoopStep n={2} title="Write the eval" />
          <LoopStep n={3} title="Change the system" />
          <LoopStep n={4} title="Run it" />
          <p style={{ fontSize: 34, color: c.muted, letterSpacing: '-0.02em', margin: '44px 0 0 32px', ...r(800, 'fade') }}>
            Repeat until the failures are boring.
          </p>
        </div>
        <svg width="600" height="600" viewBox="0 0 560 560" style={r(200, 'fade', 900)} aria-hidden>
          <circle cx={C} cy={C} r={R} fill="none" stroke={c.dim} strokeWidth="1.5" strokeDasharray="4 10" />
          <g
            style={{
              transformBox: 'view-box',
              transformOrigin: `${C}px ${C}px`,
              animation: on ? `eot-spin ${LOOP_S}s linear 1.2s infinite` : undefined,
            }}
          >
            {/* comet tail trailing the dot */}
            <circle
              cx={C}
              cy={C}
              r={R}
              fill="none"
              stroke="var(--osd-accent)"
              strokeOpacity="0.45"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * R * 0.12} 4000`}
              transform={`rotate(${-90 - 0.12 * 360} ${C} ${C})`}
            />
            <circle cx={C} cy={C - R} r="10" fill="var(--osd-accent)" />
          </g>
          <LoopNode x={C} y={C - R} n={1} />
          <LoopNode x={C + R} y={C} n={2} />
          <LoopNode x={C} y={C + R} n={3} />
          <LoopNode x={C - R} y={C} n={4} />
          <text
            x={C}
            y={C + 8}
            textAnchor="middle"
            fontFamily={mono}
            fontSize="20"
            letterSpacing="4"
            fill={c.dim}
          >
            REPEAT
          </text>
        </svg>
      </div>
    </Frame>
  );
};

// ─── 13 · Habits ──────────────────────────────────────────────────────────────
const Habit = ({ n, title, note, delay }: { n: string; title: string; note?: string; delay: number }) => {
  const r = useReveal();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 40,
        borderTop: `1px solid ${c.rule}`,
        padding: '36px 0',
        ...r(delay),
      }}
    >
      <span style={monoText(22, { color: c.dim })}>{n}</span>
      <span style={sans(88)}>{title}</span>
      {note ? <span style={{ fontSize: 34, color: c.muted, letterSpacing: '-0.02em' }}>{note}</span> : null}
    </div>
  );
};

const Habits: Page = () => {
  const r = useReveal();
  return (
    <Frame>
      <Eyebrow style={{ marginTop: 40, ...r(0, 'fade') }}>Habits worth stealing from software</Eyebrow>
      <div style={{ marginTop: 56 }}>
        <Habit delay={150} n="01" title="Eval-driven development" note="for failures you’ve seen" />
        <Habit delay={300} n="02" title="Version your evals" />
        <Habit delay={450} n="03" title="Every bug becomes a case" />
      </div>
    </Frame>
  );
};

// ─── 14 · Closing ─────────────────────────────────────────────────────────────
const Closing: Page = () => {
  const r = useReveal();
  return (
    <Frame>
      <div style={{ height: 820, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1
          style={{
            fontFamily: condensed,
            fontWeight: 700,
            fontSize: 220,
            lineHeight: 1,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          <span style={{ display: 'block', ...r(100, 'up', 900) }}>No evals,</span>
          <span style={{ display: 'block', color: c.muted, ...r(350, 'up', 900) }}>no deploy.</span>
        </h1>
        <p style={{ fontSize: 40, letterSpacing: '-0.02em', margin: '56px 0 0', ...r(900, 'fade') }}>
          A gate, not a guarantee. <span style={{ color: c.muted }}>Then watch production.</span>
        </p>
      </div>
    </Frame>
  );
};
Closing.transition = settle;

export const meta: SlideMeta = {
  title: 'Evals on the Toilet',
  createdAt: '2026-09-24T11:51:19.336Z',
};

export default [
  Cover,
  Origin,
  Analogy,
  AssertMeasure,
  Expansion,
  Toolbox,
  Pydantic,
  Breaks,
  Toilet,
  Flips,
  Dashboard,
  Loop,
  Habits,
  Closing,
] satisfies Page[];

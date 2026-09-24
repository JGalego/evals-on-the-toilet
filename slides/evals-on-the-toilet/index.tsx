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

// ─── Panel-tweakable design tokens ────────────────────────────────────────────
export const design: DesignSystem = {
  palette: {
    bg: '#f5f2ea',
    text: '#15171c',
    accent: '#0e7a5b',
  },
  fonts: {
    display: '"Newsreader", "Iowan Old Style", Georgia, serif',
    body: '"Inter", system-ui, -apple-system, sans-serif',
  },
  typeScale: {
    hero: 132,
    body: 34,
  },
  radius: 20,
};

// ─── Local constants ──────────────────────────────────────────────────────────
const c = {
  muted: '#6e6b63',
  faint: '#a9a395',
  rule: '#dcd6c8',
  surface: '#ece7dc',
  red: '#c0412b',
  ink: '#121418',
  inkText: '#f2eee5',
  inkMuted: '#8d8a82',
  inkRule: '#2a2d33',
  inkAccent: '#4cc393',
};
const mono = '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace';
const EASE = 'cubic-bezier(.2,.7,.2,1)';

// ─── Fonts + keyframes, injected once ─────────────────────────────────────────
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
const FONT_LINK_ID = 'osd-webfont-evals-on-the-toilet';
const STYLE_ID = 'osd-style-evals-on-the-toilet';
if (typeof document !== 'undefined') {
  if (!document.getElementById(FONT_LINK_ID)) {
    const link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      @keyframes eot-up    { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
      @keyframes eot-fade  { from { opacity: 0; } to { opacity: 1; } }
      @keyframes eot-draw  { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
      @keyframes eot-grow  { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      @keyframes eot-growx { from { transform: scaleX(0); } to { transform: scaleX(1); } }
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

const Footer = ({ dark }: { dark?: boolean }) => {
  const { current, total } = useSlidePageNumber();
  const color = dark ? c.inkMuted : c.faint;
  return (
    <>
      {/* perforation — the only toilet joke in the deck */}
      <div
        style={{
          position: 'absolute',
          left: PAD,
          right: PAD,
          top: 986,
          height: 2,
          backgroundImage: `repeating-linear-gradient(90deg, ${dark ? c.inkRule : c.rule} 0 14px, transparent 14px 26px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: PAD,
          right: PAD,
          top: 1010,
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: mono, fontFeatureSettings: '"calt" 0, "liga" 0',
          fontSize: 18,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color,
        }}
      >
        <span>Evals on the Toilet</span>
        <span>
          {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>
    </>
  );
};

const Frame = ({ children, dark }: { children: ReactNode; dark?: boolean }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: dark ? c.ink : 'var(--osd-bg)',
      color: dark ? c.inkText : 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: `104px ${PAD}px 0`,
      boxSizing: 'border-box',
    }}
  >
    {children}
    <Footer dark={dark} />
  </div>
);

const Eyebrow = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div
    style={{
      fontFamily: mono, fontFeatureSettings: '"calt" 0, "liga" 0',
      fontSize: 22,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--osd-accent)',
      ...style,
    }}
  >
    {children}
  </div>
);

const Head = ({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub?: string }) => {
  const r = useReveal();
  return (
    <div>
      <Eyebrow style={r(0, 'fade', 600)}>{eyebrow}</Eyebrow>
      <h2
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontWeight: 500,
          fontSize: 76,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          margin: '20px 0 0',
          ...r(60),
        }}
      >
        {title}
      </h2>
      {sub && (
        <p style={{ fontSize: 30, color: c.muted, margin: '18px 0 0', ...r(160) }}>{sub}</p>
      )}
    </div>
  );
};

const serif = (size: number, extra?: CSSProperties): CSSProperties => ({
  fontFamily: 'var(--osd-font-display)',
  fontWeight: 500,
  fontSize: size,
  lineHeight: 1.15,
  letterSpacing: '-0.015em',
  ...extra,
});

const Label = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div
    style={{
      fontFamily: mono, fontFeatureSettings: '"calt" 0, "liga" 0',
      fontSize: 20,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: c.faint,
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── 01 · Cover ───────────────────────────────────────────────────────────────
const Cover: Page = () => {
  const r = useReveal();
  return (
    <Frame>
      <div
        style={{
          height: 880,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <h1
          style={serif(132, {
            fontWeight: 400,
            lineHeight: 1.04,
            letterSpacing: '-0.03em',
            margin: 0,
          })}
        >
          <span style={{ display: 'block', ...r(120, 'up', 900) }}>
            Evals are to <em style={{ color: 'var(--osd-accent)' }}>models</em>
          </span>
          <span style={{ display: 'block', ...r(280, 'up', 900) }}>
            what tests are to <em>software</em>.
          </span>
        </h1>
      </div>
    </Frame>
  );
};
Cover.transition = settle;

// ─── 02 · The analogy ─────────────────────────────────────────────────────────
const AnalogyRow = ({
  domain,
  tool,
  noun,
  delay,
  accent,
}: {
  domain: string;
  tool: string;
  noun: string;
  delay: number;
  accent?: boolean;
}) => {
  const r = useReveal();
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '300px 420px 1fr',
        alignItems: 'baseline',
        padding: '52px 0',
        borderTop: `1px solid ${c.rule}`,
        ...r(delay),
      }}
    >
      <Label>{domain}</Label>
      <div style={serif(120, { fontWeight: 400, color: accent ? 'var(--osd-accent)' : undefined })}>
        {tool}
      </div>
      <div style={{ fontSize: 38, lineHeight: 1.4, color: c.muted }}>
        check the <span style={{ color: 'var(--osd-text)', fontWeight: 500 }}>{noun}</span>.
      </div>
    </div>
  );
};

const Analogy: Page = () => (
  <Frame>
    <Head eyebrow="The analogy" title="Same job, different material." />
    <div style={{ marginTop: 88, borderBottom: `1px solid ${c.rule}` }}>
      <AnalogyRow domain="Software" tool="Tests" noun="code" delay={250} />
      <AnalogyRow domain="Models" tool="Evals" noun="model" delay={450} accent />
    </div>
  </Frame>
);

// ─── 03 · Assert vs measure ───────────────────────────────────────────────────
const Panel = ({ children, delay }: { children: ReactNode; delay: number }) => {
  const r = useReveal();
  return (
    <div
      style={{
        background: c.surface,
        borderRadius: 'var(--osd-radius)',
        padding: '48px 56px',
        display: 'flex',
        flexDirection: 'column',
        gap: 36,
        ...r(delay),
      }}
    >
      {children}
    </div>
  );
};

const Code = ({ children }: { children: ReactNode }) => (
  <div style={{ fontFamily: mono, fontFeatureSettings: '"calt" 0, "liga" 0', fontSize: 36, color: 'var(--osd-text)' }}>{children}</div>
);

const Pill = ({ children, on }: { children: ReactNode; on?: boolean }) => (
  <div
    style={{
      fontFamily: mono, fontFeatureSettings: '"calt" 0, "liga" 0',
      fontSize: 30,
      padding: '18px 44px',
      borderRadius: 999,
      background: on ? 'var(--osd-accent)' : 'transparent',
      color: on ? '#fff' : c.faint,
      border: `2px solid ${on ? 'var(--osd-accent)' : c.rule}`,
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
              background: '#cdc6b7',
              borderRadius: '6px 6px 0 0',
              transformOrigin: 'bottom',
              ...r(500 + i * 45, 'grow', 600),
            }}
          />
        ))}
      </div>
      <div style={{ height: 2, background: c.faint }} />
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
          fontFamily: mono, fontFeatureSettings: '"calt" 0, "liga" 0',
          fontSize: 22,
          color: 'var(--osd-accent)',
          transform: 'translateX(-50%)',
          ...r(1300, 'fade'),
        }}
      >
        0.87
      </div>
    </div>
  );
};

const PanelCaption = ({ big }: { big: string }) => <div style={serif(44)}>{big}</div>;

const AssertMeasure: Page = () => (
  <Frame>
    <Head
      eyebrow="The difference"
      title={
        <>
          Tests <em style={{ fontWeight: 400 }}>assert.</em> Evals{' '}
          <em style={{ fontWeight: 400, color: 'var(--osd-accent)' }}>measure.</em>
        </>
      }
    />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 72 }}>
      <Panel delay={200}>
        <Code>assert f(x) == y</Code>
        <div style={{ height: 210, display: 'flex', alignItems: 'center', gap: 24 }}>
          <Pill on>pass</Pill>
          <Pill>fail</Pill>
        </div>
        <PanelCaption big="A verdict." />
      </Panel>
      <Panel delay={380}>
        <Code>
          score(model, D) <span style={{ color: c.faint }}>→</span> 0.87
        </Code>
        <Histogram />
        <PanelCaption big="A distribution." />
      </Panel>
    </div>
  </Frame>
);

// ─── 04 · Expansion ───────────────────────────────────────────────────────────
const Term = ({
  term,
  title,
  lead,
}: {
  term: ReactNode;
  title: string;
  lead?: boolean;
}) => (
  <div style={{ borderTop: `2px solid ${lead ? 'var(--osd-accent)' : c.rule}`, paddingTop: 36 }}>
    <div
      style={serif(64, {
        fontWeight: 400,
        fontStyle: 'italic',
        height: 80,
        color: lead ? 'var(--osd-accent)' : 'var(--osd-text)',
      })}
    >
      {term}
    </div>
    <div style={serif(42, { marginTop: 36, color: lead ? 'var(--osd-accent)' : c.muted })}>{title}</div>
  </div>
);

const Plus = () => <span style={{ color: c.faint, fontStyle: 'normal', marginRight: 14 }}>+</span>;

const Expansion: Page = () => {
  const r = useReveal();
  return (
    <Frame>
      <Head eyebrow="A Taylor series, loosely" title="Evals, expanded around tests." />
      <div style={serif(40, { fontStyle: 'italic', fontWeight: 400, color: c.muted, marginTop: 60, ...r(200) })}>
        Eval(m) ≈
      </div>
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
      <p style={serif(34, { fontStyle: 'italic', fontWeight: 400, color: c.muted, marginTop: 96, ...r(500, 'fade') })}>
        At temperature 0, only the first term survives.
      </p>
    </Frame>
  );
};

// ─── 05 · Same toolbox ────────────────────────────────────────────────────────
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
      <div style={serif(46, { fontWeight: 400, color: c.muted })}>{from}</div>
      <svg width="140" height="16" viewBox="0 0 140 16" aria-hidden>
        <path
          d="M0 8 H134 M126 1 L136 8 L126 15"
          fill="none"
          stroke="var(--osd-accent)"
          strokeWidth="2"
          pathLength={1}
          strokeDasharray="1"
          style={r(delay + 200, 'draw', 600)}
        />
      </svg>
      <div style={serif(46)}>{to}</div>
    </div>
  );
};

const Toolbox: Page = () => (
  <Frame>
    <Head eyebrow="The mapping" title="Same toolbox, new material." />
    <div style={{ display: 'grid', gridTemplateColumns: '840px 1fr', marginTop: 72, marginBottom: 20 }}>
      <Label>In software</Label>
      <Label style={{ color: 'var(--osd-accent)' }}>In evals</Label>
    </div>
    <div style={{ borderBottom: `1px solid ${c.rule}` }}>
      <MapRow from="Unit test" to="Capability eval" delay={200} />
      <MapRow from="Integration test" to="End-to-end task eval" delay={320} />
      <MapRow from="Regression suite" to="Golden set" delay={440} />
      <MapRow from="CI on every commit" to="Evals on every checkpoint" delay={560} />
    </div>
  </Frame>
);

// ─── 06 · Pydantic Evals ──────────────────────────────────────────────────────
const ApiRow = ({ api, meaning, delay }: { api: string; meaning: string; delay: number }) => {
  const r = useReveal();
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '680px 1fr',
        alignItems: 'center',
        height: 96,
        borderTop: `1px solid ${c.rule}`,
        ...r(delay),
      }}
    >
      <div style={{ fontFamily: mono, fontFeatureSettings: '"calt" 0, "liga" 0', fontSize: 32, color: 'var(--osd-accent)' }}>{api}</div>
      <div style={{ fontSize: 32 }}>{meaning}</div>
    </div>
  );
};

const Pydantic: Page = () => {
  return (
    <Frame>
      <Head eyebrow="In practice" title="Pydantic Evals, read as pytest." />
      <div style={{ display: 'grid', gridTemplateColumns: '680px 1fr', marginTop: 72, marginBottom: 12 }}>
        <Label style={{ color: 'var(--osd-accent)' }}>Pydantic Evals</Label>
        <Label>Unit testing</Label>
      </div>
      <div style={{ borderBottom: `1px solid ${c.rule}` }}>
        <ApiRow api="Case" meaning="Test case" delay={260} />
        <ApiRow api="Evaluator" meaning="Assertion, with scores" delay={340} />
        <ApiRow api="Dataset" meaning="Test suite" delay={420} />
        <ApiRow api="dataset.evaluate_sync(task)" meaning="pytest" delay={500} />
        <ApiRow api="EvaluationReport" meaning="Test report" delay={580} />
      </div>
    </Frame>
  );
};

// ─── 07 · Where it breaks ─────────────────────────────────────────────────────
const Icon = ({ children }: { children: ReactNode }) => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    stroke="var(--osd-accent)"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {children}
  </svg>
);

const BreakCard = ({
  icon,
  title,
  body,
  delay,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  delay: number;
}) => {
  const r = useReveal();
  return (
    <div
      style={{
        background: c.surface,
        borderRadius: 'var(--osd-radius)',
        padding: '48px 40px',
        height: 400,
        boxSizing: 'border-box',
        ...r(delay),
      }}
    >
      {icon}
      <div style={serif(50, { marginTop: 48 })}>{title}</div>
      <div style={{ fontSize: 29, lineHeight: 1.5, color: c.muted, marginTop: 18 }}>{body}</div>
    </div>
  );
};

const Breaks: Page = () => (
  <Frame>
    <Head eyebrow="Caveats" title="Where the analogy breaks." />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, marginTop: 80 }}>
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
        body="The eval set is the spec."
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
        body="The test set is in the training data."
        icon={
          <Icon>
            <circle cx="24" cy="32" r="18" />
            <circle cx="40" cy="32" r="18" />
            <path d="M32 18 V46" strokeDasharray="3 4" />
          </Icon>
        }
      />
    </div>
  </Frame>
);

// ─── 08 · Testing on the Toilet ───────────────────────────────────────────────
const TipCard = ({
  from,
  title,
  body,
  delay,
}: {
  from: string;
  title: string;
  body: string;
  delay: number;
}) => {
  const r = useReveal();
  return (
    <div
      style={{
        border: `1px solid ${c.rule}`,
        borderRadius: 'var(--osd-radius)',
        padding: '34px 44px',
        background: '#faf8f3',
        ...r(delay),
      }}
    >
      <Label style={{ fontSize: 18 }}>← {from}</Label>
      <div style={serif(42, { marginTop: 16 })}>{title}</div>
      <div style={{ fontSize: 28, lineHeight: 1.45, color: c.muted, marginTop: 12 }}>{body}</div>
    </div>
  );
};

const Toilet: Page = () => (
  <Frame>
    <Head
      eyebrow="Testing on the Toilet"
      title="Google’s stall tips, ported to evals."
    />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 80 }}>
      <TipCard
        delay={250}
        from="Mutation testing"
        title="Give graders a mutation score"
        body="Seed known-bad answers."
      />
      <TipCard
        delay={350}
        from="Change-detector tests"
        title="Spare the paraphrases"
        body="Accept correct rewordings."
      />
      <TipCard
        delay={450}
        from="A/B diff testing"
        title="Run A vs A before A vs B"
        body="Know the noise floor first."
      />
      <TipCard
        delay={550}
        from="Verify state-changing calls"
        title="Grade writes, not reads"
        body="Judge outcomes, not steps."
      />
    </div>
  </Frame>
);

// ─── 09 · Where the rules flip ────────────────────────────────────────────────
const FlipRow = ({ old, next, delay }: { old: string; next: ReactNode; delay: number }) => {
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
      <div style={{ ...r(delay, 'fade') }}>
        <span style={{ position: 'relative', ...serif(42, { fontWeight: 400, color: c.faint }) }}>
          {old}
          <span
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '55%',
              height: 2,
              background: c.red,
              transformOrigin: 'left',
              ...r(delay + 500, 'growx', 500),
            }}
          />
        </span>
      </div>
      <div style={serif(42, { lineHeight: 1.3, ...r(delay + 800) })}>{next}</div>
    </div>
  );
};

const Flips: Page = () => (
  <Frame>
    <Head eyebrow="Inversions" title="Where Google’s rules flip." />
    <div style={{ display: 'grid', gridTemplateColumns: '700px 1fr', marginTop: 72, marginBottom: 16 }}>
      <Label>In software</Label>
      <Label style={{ color: 'var(--osd-accent)' }}>In evals</Label>
    </div>
    <div style={{ borderBottom: `1px solid ${c.rule}` }}>
      <FlipRow delay={200} old="Tests have no tests." next="Graders must." />
      <FlipRow
        delay={900}
        old="Fix flakiness."
        next={
          <>
            Report pass<sup style={{ fontSize: '0.6em' }}>k</sup>.
          </>
        }
      />
      <FlipRow
        delay={1600}
        old="Never change tests."
        next="Rotate the items."
      />
    </div>
  </Frame>
);

// ─── 10 · Green dashboard ─────────────────────────────────────────────────────
const COLS = 41;
const ROWS = 5;
const isFail = (i: number) => (i * 53 + 11) % (COLS * ROWS) < 16; // 16 / 205 fail → 92.2%

const Dashboard: Page = () => {
  const r = useReveal();
  const on = useIsActivePage();
  const cells = Array.from({ length: COLS * ROWS }, (_, i) => i);
  return (
    <Frame dark>
      <Eyebrow style={{ color: c.inkAccent, ...r(0, 'fade') }}>A warning</Eyebrow>
      <h2
        style={serif(112, {
          fontWeight: 400,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          margin: '28px 0 0',
          ...r(100, 'up', 900),
        })}
      >
        A green dashboard
        <br />
        <em style={{ color: c.inkMuted }}>is not a good model.</em>
      </h2>
      <p style={{ fontSize: 36, color: c.inkText, margin: '40px 0 0', ...r(400) }}>
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
          fontFamily: mono, fontFeatureSettings: '"calt" 0, "liga" 0',
          fontSize: 22,
          letterSpacing: '0.08em',
          color: c.inkMuted,
          ...r(600, 'fade'),
        }}
      >
        <span>
          PASS RATE <span style={{ color: c.inkAccent }}>92.2%</span> ▲ 0.4
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: PAD,
          right: PAD,
          top: 748,
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
              background: isFail(i) ? c.red : '#1f6b52',
              ...r(700 + (i % COLS) * 22, 'fade', 400),
              ...(on && isFail(i)
                ? { animation: `eot-fade 400ms ${EASE} ${700 + (i % COLS) * 22}ms both, eot-pulse 2.4s ease-in-out 2200ms infinite` }
                : {}),
            }}
          />
        ))}
      </div>
    </Frame>
  );
};
Dashboard.transition = settle;

// ─── 11 · The eval loop ───────────────────────────────────────────────────────
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
        padding: '26px 32px',
        ...r(150 + n * 100),
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'var(--osd-radius)',
          background: c.surface,
          opacity: 0,
          ...(on
            ? { animation: `eot-hl ${LOOP_S}s ease-in-out ${((n - 1) * LOOP_S) / 4 + 1.2 - 0.64}s infinite` }
            : {}),
        }}
      />
      <span style={{ position: 'relative', fontFamily: mono, fontFeatureSettings: '"calt" 0, "liga" 0', fontSize: 24, color: 'var(--osd-accent)' }}>
        {String(n).padStart(2, '0')}
      </span>
      <span style={{ position: 'relative', ...serif(48) }}>{title}</span>
    </div>
  );
};

const LoopNode = ({ x, y, n }: { x: number; y: number; n: number }) => (
  <g>
    <circle cx={x} cy={y} r="30" fill="var(--osd-bg)" stroke={c.faint} strokeWidth="2" />
    <text
      x={x}
      y={y + 8}
      textAnchor="middle"
      fontFamily={mono}
      fontSize="22"
      fill="var(--osd-text)"
    >
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
      <Head eyebrow="The workflow" title="The eval loop." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 600px', alignItems: 'center', marginTop: 12 }}>
        <div>
          <LoopStep n={1} title="Write the eval" />
          <LoopStep n={2} title="Change the model" />
          <LoopStep n={3} title="Run it" />
          <LoopStep n={4} title="Inspect failures" />
          <p
            style={serif(38, {
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'var(--osd-accent)',
              margin: '44px 0 0 32px',
              ...r(800, 'fade'),
            })}
          >
            Repeat until the failures are boring.
          </p>
        </div>
        <svg width="600" height="600" viewBox="0 0 560 560" style={r(200, 'fade', 900)} aria-hidden>
          <circle cx={C} cy={C} r={R} fill="none" stroke={c.rule} strokeWidth="2" strokeDasharray="4 10" />
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
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * R * 0.12} 4000`}
              transform={`rotate(${-90 - 0.12 * 360} ${C} ${C})`}
            />
            <circle cx={C} cy={C - R} r="12" fill="var(--osd-accent)" />
          </g>
          <LoopNode x={C} y={C - R} n={1} />
          <LoopNode x={C + R} y={C} n={2} />
          <LoopNode x={C} y={C + R} n={3} />
          <LoopNode x={C - R} y={C} n={4} />
          <text
            x={C}
            y={C + 12}
            textAnchor="middle"
            fontFamily='"Newsreader", Georgia, serif'
            fontStyle="italic"
            fontSize="40"
            fill={c.faint}
          >
            repeat
          </text>
        </svg>
      </div>
    </Frame>
  );
};

// ─── 12 · Habits ──────────────────────────────────────────────────────────────
const Habit = ({ n, title, delay }: { n: string; title: string; delay: number }) => {
  const r = useReveal();
  return (
    <div style={{ borderTop: `1px solid ${c.rule}`, padding: '44px 0', ...r(delay) }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 28 }}>
        <span style={{ fontFamily: mono, fontFeatureSettings: '"calt" 0, "liga" 0', fontSize: 22, color: 'var(--osd-accent)' }}>{n}</span>
        <span style={serif(48)}>{title}</span>
      </div>
    </div>
  );
};

const Habits: Page = () => {
  const r = useReveal();
  return (
    <Frame>
      <div style={{ height: 846, display: 'grid', gridTemplateColumns: '620px 1fr', gap: 96, alignItems: 'center' }}>
        <div>
          <Eyebrow style={r(0, 'fade')}>Habits</Eyebrow>
          <h2 style={serif(92, { fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.025em', margin: '28px 0 0', ...r(80) })}>
            Worth stealing <em style={{ color: 'var(--osd-accent)' }}>from software.</em>
          </h2>
        </div>
        <div style={{ borderBottom: `1px solid ${c.rule}` }}>
          <Habit delay={250} n="01" title="Eval-driven development" />
          <Habit delay={400} n="02" title="Version your evals" />
          <Habit delay={550} n="03" title="Every bug becomes a case" />
        </div>
      </div>
    </Frame>
  );
};

// ─── 13 · Closing ─────────────────────────────────────────────────────────────
const Closing: Page = () => {
  const r = useReveal();
  return (
    <Frame dark>
      <div style={{ height: 846, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Eyebrow style={{ color: c.inkAccent, ...r(0, 'fade') }}>The rule</Eyebrow>
        <h1
          style={serif(180, {
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: '-0.035em',
            margin: '36px 0 0',
            ...r(100, 'up', 900),
          })}
        >
          No evals, <em style={{ color: c.inkAccent }}>no deploy.</em>
        </h1>
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

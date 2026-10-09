import { useState, useEffect } from "react";
import "./LoadingScreen.css";

const HINTS = [
  "Braking is optional. Merge conflicts are not.",
  "Dark mode adds +5 horsepower.",
  "On a loading screen, 99% always takes the longest.",
  "Pit stops are just code reviews with more tire changes.",
  "Turning it off and on again fixes more than you'd think.",
  "The Resume button is a shortcut. Recruiters love shortcuts.",
];

const STEPS = ["projects", "experience", "skills", "contact"];

// ── Variants: same progress/hint/skip, different centerpiece ──────────────────

function NameLoader({ progress }) {
  return (
    <div className="ls-name">
      <p className="eyebrow">Loading portfolio</p>
      <h1 className="ls-name-title">Prince <span>Klair</span></h1>
      <div className="ls-line"><div style={{ width: `${progress}%` }} /></div>
      <span className="ls-mono ls-muted">{Math.floor(progress)}%</span>
    </div>
  );
}

function TerminalLoader({ progress }) {
  const filled = Math.round(progress / 5);
  return (
    <div className="ls-term ls-mono">
      <p><span className="ls-muted">{"< "}</span><span className="ls-blue">Prince Klair</span><span className="ls-muted">{" />"}</span></p>
      {STEPS.map((step, i) => {
        const at = ((i + 1) / (STEPS.length + 1)) * 100;
        if (progress < at - 100 / (STEPS.length + 1)) return null;
        return (
          <p key={step}>
            <span className="ls-muted">&gt;</span> loading {step}…{" "}
            {progress >= at ? <span className="ls-ok">ok</span> : <span className="cursor-blink">_</span>}
          </p>
        );
      })}
      <p className="ls-term-bar">
        [<span className="ls-blue">{"#".repeat(filled)}</span><span className="ls-muted">{".".repeat(20 - filled)}</span>] {Math.floor(progress)}%
      </p>
    </div>
  );
}

function RingLoader({ progress }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="ls-ring">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r={r} className="ls-ring-track" />
        <circle
          cx="60" cy="60" r={r}
          className="ls-ring-fill"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - progress / 100)}
        />
      </svg>
      <span className="ls-ring-mark">P<span>K</span></span>
      <span className="ls-mono ls-muted ls-ring-pct">{Math.floor(progress)}%</span>
    </div>
  );
}

const VARIANTS = { name: NameLoader, terminal: TerminalLoader, ring: RingLoader };

// ── Loading screen ────────────────────────────────────────────────────────────

export default function LoadingScreen({ variant = "name", onDone }) {
  const [duration] = useState(() => 5000 + Math.random() * 10000); // 5–15s
  const [hint] = useState(() => HINTS[Math.floor(Math.random() * HINTS.length)]);
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  // Ease-out progress: quick start, slow finish.
  useEffect(() => {
    if (leaving) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(100 * (1 - Math.pow(1 - t, 2)));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setLeaving(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, leaving]);

  // Fade out, then hand off to the page.
  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(onDone, 500);
    return () => clearTimeout(t);
  }, [leaving, onDone]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setLeaving(true); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const Centerpiece = VARIANTS[variant] ?? NameLoader;

  return (
    <div
      className={`ls${leaving ? " ls-leaving" : ""}`}
      role="progressbar"
      aria-label="Loading portfolio"
      aria-valuenow={Math.floor(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <button type="button" className="ls-skip" onClick={() => setLeaving(true)}>
        Skip <span aria-hidden="true">→</span>
      </button>

      <Centerpiece progress={leaving ? 100 : progress} />

      <p className="ls-hint">
        <span className="ls-hint-label">Hint</span>
        {hint}
      </p>
    </div>
  );
}

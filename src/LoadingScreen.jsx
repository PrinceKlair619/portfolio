import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import "./LoadingScreen.css";

// ── DATA ─────────────────────────────────────────────────────────────────────

const HINTS = [
  "Braking is optional. Merge conflicts are not.",
  "Pit stops are just code reviews with more tire changes.",
  "You can't git push your way out of a gravel trap.",
  "Dark mode adds +5 horsepower.",
  "Hold SHIFT to drift. It does nothing here, but it feels cool.",
  "On a loading screen, 99% always takes the longest.",
  "Turning it off and on again restores 100% tire grip.",
  "This loading bar is completely fake. The vibes are real.",
  "Hiring Prince grants +15 team morale.",
];

const PUFFS = 12;
const TREADS = 24;

// Random total load time in ms (5–15s).
const randomDuration = () => 5000 + Math.random() * 10000;

// Build a bumpy-but-monotonic progress curve: a handful of segments with
// random durations and random progress gains, so the bar bursts and stalls
// like a real loading screen while still landing on 100% at `total`.
function buildCurve(total) {
  const count = 6 + Math.floor(Math.random() * 4);
  const times = Array.from({ length: count }, () => 0.4 + Math.random());
  const gains = Array.from({ length: count }, () => Math.pow(Math.random(), 1.6) + 0.05);
  const tSum = times.reduce((a, b) => a + b, 0);
  const gSum = gains.reduce((a, b) => a + b, 0);
  let t = 0;
  let p = 0;
  return times.map((tv, i) => {
    const seg = { t0: t, p0: p, t1: t + (tv / tSum) * total, p1: p + (gains[i] / gSum) * 100 };
    t = seg.t1;
    p = seg.p1;
    return seg;
  });
}

function progressAt(curve, elapsed) {
  const seg = curve.find((s) => elapsed < s.t1);
  if (!seg) return 100;
  const f = (elapsed - seg.t0) / (seg.t1 - seg.t0);
  const eased = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
  return seg.p0 + (seg.p1 - seg.p0) * eased;
}

// ── TIRE ─────────────────────────────────────────────────────────────────────

function Tire() {
  return (
    <svg className="ls-tire" viewBox="0 0 200 200" aria-hidden="true">
      <g className="ls-tire-spin">
        <circle cx="100" cy="100" r="96" fill="#111" />
        {Array.from({ length: TREADS }, (_, i) => (
          <rect
            key={i}
            x="94" y="4" width="12" height="14" rx="2"
            fill="#1f1f1f"
            transform={`rotate(${(360 / TREADS) * i} 100 100)`}
          />
        ))}
        <circle cx="100" cy="100" r="72" fill="#161616" stroke="#242424" strokeWidth="2" />
        <circle cx="100" cy="100" r="56" fill="#2a2a2e" stroke="#4a4a52" strokeWidth="3" />
        {Array.from({ length: 5 }, (_, i) => (
          <path
            key={i}
            d="M92 98 L96 50 L104 50 L108 98 Z"
            fill="#8a8a94"
            transform={`rotate(${72 * i} 100 100)`}
          />
        ))}
        <circle cx="100" cy="100" r="14" fill="#9a9aa4" />
        <circle cx="100" cy="100" r="5" fill="#2a2a2e" />
      </g>
    </svg>
  );
}

// ── LOADING SCREEN ───────────────────────────────────────────────────────────

/**
 * Burnout loading screen. Calls `onReveal` once loading hits 100% (so the
 * page can mount underneath), then fades out and removes itself.
 */
export default function LoadingScreen({ onReveal }) {
  const curve = useMemo(() => buildCurve(randomDuration()), []);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading"); // loading → exit → done
  const [hint] = useState(() => HINTS[Math.floor(Math.random() * HINTS.length)]);
  const skipped = useRef(false);

  const finish = useCallback(() => {
    skipped.current = true;
    setProgress(100);
  }, []);

  // Drive progress with rAF.
  useEffect(() => {
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      if (skipped.current) return;
      const p = progressAt(curve, now - t0);
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [curve]);

  // 100% → reveal the page and fade out.
  useEffect(() => {
    if (progress < 100 || phase !== "loading") return;
    const t = setTimeout(() => { onReveal?.(); setPhase("exit"); }, 400);
    return () => clearTimeout(t);
  }, [progress, phase, onReveal]);

  useEffect(() => {
    if (phase !== "exit") return;
    const t = setTimeout(() => setPhase("done"), 700);
    return () => clearTimeout(t);
  }, [phase]);

  // Skip with Escape.
  useEffect(() => {
    if (phase !== "loading") return;
    const onKey = (e) => { if (e.key === "Escape") finish(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, finish]);

  // Lock scroll while the overlay is up.
  useEffect(() => {
    if (phase === "done") return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`ls-root${phase === "exit" ? " ls-out" : ""}`}
      style={{ "--p": progress / 100 }}
      role="progressbar"
      aria-label="Loading portfolio"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      {phase === "loading" && (
        <button type="button" className="ls-skip" onClick={finish}>
          Skip <span aria-hidden="true">→</span>
        </button>
      )}

      <div className="ls-center">
        <div className="ls-burnout">
          <div className="ls-smoke" aria-hidden="true">
            {Array.from({ length: PUFFS }, (_, i) => <span key={i} style={{ "--i": i }} />)}
          </div>
          <Tire />
          <div className="ls-ground" />
        </div>

        <div className="ls-bar">
          <div className="ls-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="ls-percent">{Math.floor(progress)}%</span>
      </div>

      <p className="ls-hint">Hint: {hint}</p>
    </div>
  );
}

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import "./LoadingScreen.css";

// ── DATA ─────────────────────────────────────────────────────────────────────

const HINTS = [
  "Braking is optional. Merge conflicts are not.",
  "Drafting behind a senior dev increases your top speed by 20%.",
  "Pit stops are just code reviews with more tire changes.",
  "You can't git push your way out of a gravel trap.",
  "Dark mode adds +5 horsepower. Light mode adds +5 visibility. Choose wisely.",
  "The Resume button is a shortcut. Recruiters love shortcuts.",
  "Hiring Prince grants +15 team morale and +30 features shipped.",
  "Hold SHIFT to drift. It does nothing here, but it feels cool.",
  "On a loading screen, 99% always takes the longest.",
  "console.log() is the racing line. Everyone takes it eventually.",
  "Turning it off and on again restores 100% tire grip.",
  "This loading bar is completely fake. The vibes are real.",
  "Rubber-banding is real. So is the recruiter who ghosted you.",
  "Rear-ending the car in front counts as a pair programming session.",
];

const STATUSES = [
  "Warming up tires",
  "Checking tire pressure",
  "Fueling up on coffee",
  "Compiling JSX",
  "Calibrating telemetry",
  "Polishing the paint job",
  "Lining up on the grid",
];

const GEARS = 6;
const LIGHTS = 5;

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

// ── TACHOMETER ───────────────────────────────────────────────────────────────

// Angles are degrees clockwise from 12 o'clock; the dial runs 7:30 → 4:30.
const TACH_START = -135;
const TACH_SWEEP = 270;
const MAX_RPM = 9;
const REDLINE = 7.5;

function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function arc(cx, cy, r, from, to) {
  const [x0, y0] = polar(cx, cy, r, from);
  const [x1, y1] = polar(cx, cy, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
}

function Tachometer({ rpm, gear, speed }) {
  const angleFor = (v) => TACH_START + (v / MAX_RPM) * TACH_SWEEP;
  const needle = angleFor(Math.min(rpm, MAX_RPM));
  const [hx, hy] = polar(100, 100, 20, needle);
  const [nx, ny] = polar(100, 100, 74, needle);

  return (
    <div className="ls-tach">
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <path className="ls-tach-track" d={arc(100, 100, 84, angleFor(0), angleFor(MAX_RPM))} />
        <path className="ls-tach-red" d={arc(100, 100, 84, angleFor(REDLINE), angleFor(MAX_RPM))} />
        <path className="ls-tach-fill" d={arc(100, 100, 84, angleFor(0), Math.max(angleFor(0) + 0.01, needle))} />
        {Array.from({ length: MAX_RPM + 1 }, (_, i) => {
          const a = angleFor(i);
          const [x0, y0] = polar(100, 100, 70, a);
          const [x1, y1] = polar(100, 100, 76, a);
          const [tx, ty] = polar(100, 100, 58, a);
          return (
            <g key={i} className={i >= REDLINE ? "ls-tick-red" : ""}>
              <line className="ls-tick" x1={x0} y1={y0} x2={x1} y2={y1} />
              <text className="ls-tick-label" x={tx} y={ty}>{i}</text>
            </g>
          );
        })}
        <line className="ls-needle" x1={hx} y1={hy} x2={nx} y2={ny} />
        <circle className="ls-hub" cx="100" cy="100" r="20" />
      </svg>
      <div className="ls-tach-readout">
        <span className="ls-gear">{gear}</span>
        <span className="ls-speed">{String(Math.round(speed)).padStart(3, "0")}</span>
        <span className="ls-unit">KM/H</span>
      </div>
    </div>
  );
}

// ── LOADING SCREEN ───────────────────────────────────────────────────────────

/**
 * Racing-game style loading screen. Calls `onReveal` once loading hits 100%
 * (so the page can mount underneath), then removes itself after the exit
 * animation.
 */
export default function LoadingScreen({ onReveal }) {
  const curve = useMemo(() => buildCurve(randomDuration()), []);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading"); // loading → go → exit → done
  const [hintIndex, setHintIndex] = useState(() => Math.floor(Math.random() * HINTS.length));
  const [rev, setRev] = useState(0);
  const skipped = useRef(false);

  const skip = useCallback(() => {
    skipped.current = true;
    setProgress(100);
    setPhase("go");
  }, []);

  // Drive progress with rAF.
  useEffect(() => {
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      if (skipped.current) return;
      const p = progressAt(curve, now - t0);
      setProgress(p);
      setRev(Math.random());
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [curve]);

  // Rotate hints.
  useEffect(() => {
    const id = setInterval(() => setHintIndex((i) => (i + 1) % HINTS.length), 3800);
    return () => clearInterval(id);
  }, []);

  // 100% → lights out, GO, exit.
  useEffect(() => {
    if (progress < 100 || phase !== "loading") return;
    const t1 = setTimeout(() => setPhase("go"), 350);
    return () => clearTimeout(t1);
  }, [progress, phase]);

  useEffect(() => {
    if (phase === "go") {
      const t = setTimeout(() => { onReveal?.(); setPhase("exit"); }, 750);
      return () => clearTimeout(t);
    }
    if (phase === "exit") {
      const t = setTimeout(() => setPhase("done"), 900);
      return () => clearTimeout(t);
    }
  }, [phase, onReveal]);

  // Skip with Escape / Enter / Space.
  useEffect(() => {
    if (phase !== "loading") return;
    const onKey = (e) => {
      if (["Escape", "Enter", " "].includes(e.key)) skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, skip]);

  // Lock scroll while the overlay is up.
  useEffect(() => {
    if (phase === "done") return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  if (phase === "done") return null;

  // Derived telemetry: progress is split across the gears, so RPM climbs
  // within each gear and drops when it shifts up.
  const perGear = 100 / GEARS;
  const gear = Math.min(GEARS, Math.floor(progress / perGear) + 1);
  const inGear = progress >= 100 ? 1 : (progress % perGear) / perGear;
  const jitter = phase === "loading" ? (rev - 0.5) * 0.25 : 0;
  const rpm = 2.2 + inGear * 5.8 + jitter;
  const speed = progress * 2.9 + (rev - 0.5) * 2;
  const litLights = Math.min(LIGHTS, Math.floor(progress / (100 / LIGHTS)));
  const status = progress >= 100
    ? "Ready"
    : STATUSES[Math.min(STATUSES.length - 1, Math.floor((progress / 100) * STATUSES.length))];

  return (
    <div
      className={`ls-root ls-phase-${phase}`}
      role="progressbar"
      aria-label="Loading portfolio"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      {/* Scenery */}
      <div className="ls-sky" />
      <div className="ls-road-wrap" aria-hidden="true">
        <div className="ls-road">
          <div className="ls-road-lines" />
          <div className="ls-road-edge ls-road-edge-l" />
          <div className="ls-road-edge ls-road-edge-r" />
        </div>
      </div>
      <div className="ls-streaks" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => <span key={i} style={{ "--i": i }} />)}
      </div>
      <div className="ls-vignette" />

      {/* HUD */}
      <div className="ls-hud">
        <header className="ls-top">
          <div className="ls-event">
            <span className="ls-kicker">Event 01 · Career Mode</span>
            <h1 className="ls-title">Portfolio <em>Grand Prix</em></h1>
            <p className="ls-sub">Prince Klair · Full-Stack Developer</p>
          </div>

          <dl className="ls-card">
            <div><dt>Track</dt><dd>Buffalo → Pace Raceway</dd></div>
            <div><dt>Class</dt><dd><span className="ls-class">S1</span> Full-Stack</dd></div>
            <div><dt>Laps</dt><dd>5 sections</dd></div>
            <div><dt>Conditions</dt><dd>Clear · 0 known bugs*</dd></div>
          </dl>
        </header>

        <div className="ls-middle">
          <div className={`ls-lights${phase !== "loading" ? " ls-lights-out" : ""}`} aria-hidden="true">
            {Array.from({ length: LIGHTS }, (_, i) => (
              <span key={i} className={i < litLights ? "on" : ""}><i /><i /></span>
            ))}
          </div>
          <div className="ls-go-text" aria-hidden="true">GO!</div>
        </div>

        <div className="ls-bottom">
          <div className="ls-progress-block">
            <div className="ls-progress-head">
              <span className="ls-status">
                {status}
                {progress < 100 && <span className="ls-dots"><b>.</b><b>.</b><b>.</b></span>}
              </span>
              <span className="ls-percent">{Math.floor(progress)}<small>%</small></span>
            </div>
            <div className="ls-bar">
              <div className="ls-bar-fill" style={{ width: `${progress}%` }} />
              <div className="ls-bar-segments" />
            </div>

            <div className="ls-hint">
              <span className="ls-hint-tag">Hint</span>
              <p key={hintIndex} className="ls-hint-text">{HINTS[hintIndex]}</p>
            </div>
          </div>

          <Tachometer rpm={rpm} gear={gear} speed={speed} />
        </div>

        {phase === "loading" && (
          <button type="button" className="ls-skip" onClick={skip}>
            Skip <kbd>Esc</kbd>
          </button>
        )}
      </div>
    </div>
  );
}

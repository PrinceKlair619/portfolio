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

// Each step: what's running, and what it reports when done.
// tone: "ok" (green), "warn" (amber), "err" (red)
const STEPS = [
  { task: "booting portfolio.exe", result: "ok", tone: "ok" },
  { task: "loading projects", result: "ok", tone: "ok" },
  { task: "brewing coffee", result: "ok (3 cups)", tone: "ok" },
  { task: "loading experience", result: "ok", tone: "ok" },
  { task: "loading sleep schedule", result: "error: 404 not found", tone: "err" },
  { task: "installing node_modules", result: "ok (4.2 GB)", tone: "ok" },
  { task: "centering a div", result: "still trying…", tone: "warn" },
  { task: "loading skills", result: "ok", tone: "ok" },
  { task: "fixing bugs", result: "1 fixed, 3 created", tone: "warn" },
  { task: "checking social life", result: "error: deprecated", tone: "err" },
  { task: "loading resume", result: "ok", tone: "ok" },
  { task: "loading contact", result: "ok", tone: "ok" },
];

function TerminalLoader({ progress }) {
  const filled = Math.round(progress / 5);
  const slot = 100 / (STEPS.length + 1);
  return (
    <div className="ls-term ls-mono">
      <p>
        <span className="ls-muted">{"< "}</span>test subject: <span className="ls-blue">Prince Klair</span>
        <span className="ls-muted">{" />"}</span>
      </p>
      {STEPS.map((step, i) => {
        const doneAt = (i + 1) * slot;
        if (progress < doneAt - slot) return null;
        return (
          <p key={step.task}>
            <span className="ls-muted">&gt;</span> {step.task}…{" "}
            {progress >= doneAt
              ? <span className={`ls-${step.tone}`}>{step.result}</span>
              : <span className="cursor-blink">_</span>}
          </p>
        );
      })}
      <p className="ls-term-bar">
        [<span className="ls-blue">{"#".repeat(filled)}</span><span className="ls-muted">{".".repeat(20 - filled)}</span>] {Math.floor(progress)}%
      </p>
    </div>
  );
}

// ── Loading screen ────────────────────────────────────────────────────────────

export default function LoadingScreen({ onDone }) {
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

      <TerminalLoader progress={leaving ? 100 : progress} />

      <p className="ls-hint">
        <span className="ls-hint-label">Hint</span>
        {hint}
      </p>
    </div>
  );
}

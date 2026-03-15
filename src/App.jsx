import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import { useState, useEffect, useRef } from "react";
import "./App.css";

// ─── PROJECT DATA ────────────────────────────────────────────────────────────
// Replace this array with your own project details
const PROJECTS = [
  {
    id: 1,
    title: "Pupperazzi",
    subtitle: "Dog Matching Platform",
    description:
      "A social platform for dog owners to connect, match, and build community. Features real-time profiles, swipe-based matching, and a social feed.",
    tech: ["React", "Node.js", "PostgreSQL", "Socket.io"],
    role: "Full Stack Developer",
    features: [
      "Real-time messaging between matched users",
      "Profile builder with photo upload",
      "Location-based discovery",
      "Social feed with likes and comments",
    ],
    color: "#00d4ff",
    placeholder: "🐾",
  },
  {
    id: 2,
    title: "Cats of the Cattibean",
    subtitle: "Unreal Engine 5 Adventure Game",
    description:
      "A third-person exploration adventure game set on a vibrant island archipelago. Built in UE5 with custom blueprints, cinematic lighting, and original level design.",
    tech: ["Unreal Engine 5", "Blueprints", "C++", "Blender"],
    role: "Game Developer & Designer",
    features: [
      "Open-world island exploration",
      "Custom character controller and animations",
      "Dynamic weather and lighting system",
      "Original 3D assets and environments",
    ],
    color: "#7c3aed",
    placeholder: "🏝️",
  },
  {
    id: 3,
    title: "Buffalo Crime Analyzer",
    subtitle: "Interactive Data Visualization",
    description:
      "A geospatial crime analysis tool for Buffalo, NY. Processes public datasets and renders an interactive map with filtering, heatmaps, and trend charts.",
    tech: ["Python", "React", "D3.js", "Leaflet", "Pandas"],
    role: "Data Engineer & Frontend Developer",
    features: [
      "Interactive choropleth heatmaps",
      "Time-series trend analysis",
      "Neighborhood-level filtering",
      "CSV dataset ingestion pipeline",
    ],
    color: "#f59e0b",
    placeholder: "📊",
  },
];

// ─── NAME LETTERS ANIMATION ──────────────────────────────────────────────────
// Splits the name into individual letter spans for the drop-in animation
function AnimatedName({ name }) {
  return (
    <div className="animated-name" aria-label={name}>
      {name.split("").map((char, i) => (
        <span
          key={i}
          className="name-letter"
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}

// ─── ANIMATED SUBTITLE (TYPEWRITER CYCLE) ────────────────────────────────────
const ROLES = [
  "Software Engineer",
  "Full Stack Developer",
  "Systems Programmer",
  "Builder of Cool Things",
];

function TypewriterSubtitle() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing"); // 'typing' | 'pausing' | 'erasing'
  const charRef = useRef(0);

  useEffect(() => {
    const target = ROLES[roleIndex];

    if (phase === "typing") {
      if (charRef.current < target.length) {
        const t = setTimeout(() => {
          charRef.current++;
          setDisplayed(target.slice(0, charRef.current));
        }, 55);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("erasing"), 1800);
        return () => clearTimeout(t);
      }
    }

    if (phase === "erasing") {
      if (charRef.current > 0) {
        const t = setTimeout(() => {
          charRef.current--;
          setDisplayed(target.slice(0, charRef.current));
        }, 30);
        return () => clearTimeout(t);
      } else {
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
        setPhase("typing");
      }
    }
  }, [phase, displayed, roleIndex]);

  return (
    <p className="hero-subtitle">
      <span className="subtitle-label">{"< "}</span>
      <span className="subtitle-role">{displayed}</span>
      <span className="cursor-blink">|</span>
      <span className="subtitle-label">{" />"}</span>
    </p>
  );
}

// ─── SPACE PARTICLE CANVAS BACKGROUND ────────────────────────────────────────
function SpaceBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let W, H;

    // Particles: stars + floating glowing orbs
    const STAR_COUNT = 200;
    const ORB_COUNT = 6;
    const stars = [];
    const orbs = [];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function init() {
      stars.length = 0;
      orbs.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.4 + 0.2,
          alpha: Math.random() * 0.6 + 0.2,
          speed: Math.random() * 0.12 + 0.02,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
      for (let i = 0; i < ORB_COUNT; i++) {
        orbs.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 180 + 80,
          dx: (Math.random() - 0.5) * 0.18,
          dy: (Math.random() - 0.5) * 0.18,
          hue: Math.random() > 0.5 ? 195 : 260, // cyan or violet
          alpha: Math.random() * 0.06 + 0.02,
        });
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);

      // Grid lines (very subtle)
      ctx.save();
      ctx.strokeStyle = "rgba(0,200,255,0.03)";
      ctx.lineWidth = 1;
      const GRID = 80;
      for (let x = 0; x < W; x += GRID) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += GRID) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.restore();

      // Glowing orbs
      for (const orb of orbs) {
        orb.x += orb.dx;
        orb.y += orb.dy;
        if (orb.x < -orb.r) orb.x = W + orb.r;
        if (orb.x > W + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = H + orb.r;
        if (orb.y > H + orb.r) orb.y = -orb.r;

        const grad = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.r
        );
        grad.addColorStop(0, `hsla(${orb.hue},100%,70%,${orb.alpha})`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Stars
      for (const star of stars) {
        star.y += star.speed;
        star.twinkle += 0.02;
        if (star.y > H) { star.y = 0; star.x = Math.random() * W; }
        const a = star.alpha * (0.6 + 0.4 * Math.sin(star.twinkle));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,240,255,${a})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", () => { resize(); init(); });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="space-canvas" />;
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
function ProjectCard({ project, onClick }) {
  return (
    <div
      className="project-card"
      onClick={() => onClick(project)}
      style={{ "--card-accent": project.color }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(project)}
      aria-label={`View project: ${project.title}`}
    >
      {/* Glow top bar */}
      <div className="card-bar" />

      {/* Placeholder / image area */}
      <div className="card-visual">
        <span className="card-emoji">{project.placeholder}</span>
        <div className="card-shine" />
      </div>

      <div className="card-body">
        <h3 className="card-title">{project.title}</h3>
        <p className="card-subtitle">{project.subtitle}</p>
        <p className="card-desc">{project.description}</p>
        <div className="card-tags">
          {project.tech.slice(0, 3).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
          {project.tech.length > 3 && (
            <span className="tag tag-more">+{project.tech.length - 3}</span>
          )}
        </div>
        <button className="card-cta">View Project →</button>
      </div>
    </div>
  );
}

// ─── PROJECT MODAL (EXPANDED) ─────────────────────────────────────────────────
function ProjectModal({ project, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div
        className="modal-panel"
        style={{ "--card-accent": project.color }}
      >
        {/* Top accent bar */}
        <div className="modal-bar" />

        {/* Close button */}
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* Visual header */}
        <div className="modal-visual">
          <span className="modal-emoji">{project.placeholder}</span>
          <div className="modal-glow" />
        </div>

        <div className="modal-content">
          <span className="modal-role-tag">{project.role}</span>
          <h2 className="modal-title">{project.title}</h2>
          <p className="modal-subtitle">{project.subtitle}</p>
          <p className="modal-desc">{project.description}</p>

          {/* Features list */}
          <div className="modal-section">
            <h4 className="modal-section-title">Key Features</h4>
            <ul className="modal-features">
              {project.features.map((f, i) => (
                <li key={i} className="modal-feature-item">
                  <span className="feature-dot" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div className="modal-section">
            <h4 className="modal-section-title">Tech Stack</h4>
            <div className="modal-tags">
              {project.tech.map((t) => (
                <span key={t} className="tag tag-large">{t}</span>
              ))}
            </div>
          </div>

          {/* Action links */}
          <div className="modal-actions">
            <a href="#" className="btn-modal primary-btn">
              View Live
            </a>
            <a href="https://github.com/PrinceKlair619" target="_blank" rel="noreferrer" className="btn-modal ghost-btn">
              GitHub →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SKILL CHIPS ──────────────────────────────────────────────────────────────
const SKILLS = [
  { name: "Python", icon: "🐍" },
  { name: "Java", icon: "☕" },
  { name: "C", icon: "⚙️" },
  { name: "C++", icon: "⚡" },
  { name: "JavaScript", icon: "🌐" },
  { name: "React", icon: "⚛️" },
  { name: "Node.js", icon: "🟢" },
  { name: "Git", icon: "🔀" },
  { name: "SQL", icon: "🗄️" },
  { name: "Unreal Engine", icon: "🎮" },
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeProject, setActiveProject] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);

  // Detect scroll for navbar styling
  useEffect(() => {
    const handler = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="page">
      {/* ── Animated space background ── */}
      <SpaceBackground />

      {/* ── NAVBAR ── */}
      <nav className={`navbar ${navScrolled ? "navbar-scrolled" : ""}`}>
        <div className="logo">
          <span className="logo-bracket">[</span>
          PK
          <span className="logo-bracket">]</span>
        </div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-inner">
          {/* Scan line overlay for Tron feel */}
          <div className="scanline" />

          <p className="hero-eyebrow">// hello, world — I'm</p>
          <AnimatedName name="Prince Klair" />
          <TypewriterSubtitle />

          <p className="hero-desc">
            CS student at the University at Buffalo. I build full-stack web apps,
            systems programs, and games — projects that are clean, functional, and
            actually worth shipping.
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">
              View Projects
            </a>
            <a
              href="https://github.com/PrinceKlair619"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/prince-k1"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
            >
              LinkedIn
            </a>
          </div>

          {/* Scroll cue */}
          <div className="scroll-cue">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="section about-section">
        <div className="section-inner">
          <span className="section-label">01 // About</span>
          <h2 className="section-title">Who I Am</h2>
          <div className="about-grid">
            <div className="about-text">
              <p>
                I'm a Computer Science student at the University at Buffalo who
                loves turning ideas into polished software. My work spans full-stack
                web development, systems programming in C/C++, and game development
                in Unreal Engine 5.
              </p>
              <p>
                I care about clean code, smart architecture, and building things that
                actually work well. Whether it's a social platform, a data tool, or an
                adventure game — I like the whole process: design, build, ship.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat">
                <span className="stat-num">3+</span>
                <span className="stat-label">Shipped Projects</span>
              </div>
              <div className="stat">
                <span className="stat-num">10+</span>
                <span className="stat-label">Technologies</span>
              </div>
              <div className="stat">
                <span className="stat-num">UB</span>
                <span className="stat-label">CS Degree</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="section projects-section">
        <div className="section-inner">
          <span className="section-label">02 // Projects</span>
          <h2 className="section-title">What I've Built</h2>
          <p className="section-sub">
            Click any project to explore it in full detail.
          </p>
          {/* Project cards carousel */}
          <div className="projects-carousel">
            {PROJECTS.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onClick={setActiveProject}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="section skills-section">
        <div className="section-inner">
          <span className="section-label">03 // Skills</span>
          <h2 className="section-title">Tools & Tech</h2>
          <div className="skills-grid">
            {SKILLS.map((s, i) => (
              <div
                key={s.name}
                className="skill-chip"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="skill-icon">{s.icon}</span>
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="section contact-section">
        <div className="section-inner contact-inner">
          <span className="section-label">04 // Contact</span>
          <h2 className="section-title">Let's Build Something</h2>
          <p className="contact-sub">
            Open to internships, collaborations, and interesting projects.
            Drop me a line — I respond fast.
          </p>
          <a href="mailto:Klairprince619@gmail.com" className="btn btn-primary btn-large">
            Send an Email
          </a>
          <div className="contact-links">
            <a href="https://github.com/PrinceKlair619" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <span className="divider">·</span>
            <a href="https://linkedin.com/in/prince-k1" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <span>© 2025 Prince Klair</span>
        <span className="footer-tag">Built with React</span>
      </footer>

      {/* ── PROJECT MODAL ── */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </div>
  );
}
import { useState, useEffect, useRef } from "react";
import "./App.css";

// ═══════════════════════════════════════════════════════
//  PROJECT DATA
// ═══════════════════════════════════════════════════════
const PROJECTS = [
  {
    id: 1,
    title: "Pupperazzi",
    subtitle: "Full-Stack Web Application",
    summary:
      "A full-stack pet-matching platform with user accounts, dog profiles, real-time messaging, and a social feed.",
    description:
      "Developed a full-stack pet-matching platform using React (Vite) on the frontend and a PHP/MySQL REST API backend, supporting user accounts, dog profiles, and dynamic content rendering. Implemented major frontend features including profile creation/editing, matches feed, messaging UI, event listings, RSVP flows, and responsive component-based layouts. Built backend endpoints for authentication, profile management, messages, events, matching, data retrieval, and form submissions.",
    tech: ["React", "PHP", "MySQL", "Vite", "REST API"],
    role: "Full-Stack Developer",
    period: "Sept 2025 – Dec 2025",
    features: [
      "User authentication and session management",
      "Swipe-based dog matching feed with dynamic profiles",
      "Real-time messaging UI between matched users",
      "Event listings with RSVP and attendance flows",
      "Secure REST API with CORS and input validation",
    ],
    accent: "#00d4ff",
    images: [],
  },
  {
    id: 2,
    title: "Chat Server & Client",
    subtitle: "C++ Socket Programming",
    summary:
      "A full-duplex TCP chat platform built with BSD sockets, non-blocking I/O, and concurrent session management.",
    description:
      "Engineered a full-duplex TCP chat platform using BSD sockets with non-blocking communication and select()-based I/O multiplexing. Designed a scalable server architecture supporting concurrent sessions, connection state tracking, message routing, and protocol-driven request handling. Implemented command parsing for login/logout, broadcasts, direct messages, blocklists, and complete server-side event logging.",
    tech: ["C++", "BSD Sockets", "TCP/IP", "POSIX", "select()"],
    role: "Systems Engineer",
    period: "Sept 2025 – Nov 2025",
    features: [
      "Full-duplex TCP communication via BSD sockets",
      "Non-blocking I/O with select()-based multiplexing",
      "Concurrent session tracking and message routing",
      "Command system: login, logout, broadcast, DM, blocklist",
      "Complete server-side event logging for audit trails",
    ],
    accent: "#38bdf8",
    images: [],
  },
  {
    id: 3,
    title: "Cats of the Caribbean",
    subtitle: "Unreal Engine 5 Open-World Game",
    summary:
      "A modular UE5 open-world game with a real-time day-night cycle, fishing minigame, and a fully custom player character.",
    description:
      "Developed a modular UE5 open-world framework with a real-time day-night cycle, island traversal, interactable objects, and trigger-based tutorial systems. Implemented a systems-driven fishing minigame using Blueprint state machines, timing-based input validation, reward logic, and inventory integration. Built an advanced keybind menu using Enhanced Input with runtime remapping and persistent storage.",
    tech: ["Unreal Engine 5", "Blueprints", "C++", "Blender", "UMG"],
    role: "Game Developer & Designer",
    period: "Sept 2025 – Dec 2025",
    features: [
      "Real-time day/night cycle with dynamic lighting",
      "Fishing minigame driven by Blueprint state machines",
      "Enhanced Input system with runtime key remapping",
      "Custom player character modeled and animated in Blender",
      "Layered UMG widget hierarchy with persistent settings",
    ],
    accent: "#818cf8",
    images: [],
  },
  {
    id: 4,
    title: "Buffalo Crime Analyzer",
    subtitle: "Data Visualization Web App",
    summary:
      "Analyzes 10,000+ Buffalo crime records with interactive heatmaps, temporal charts, and geographic filtering.",
    description:
      "Built a data-driven web application to preprocess and analyze 10,000+ Buffalo crime records with temporal, categorical, and geographic filtering. Implemented interactive visualizations including line graphs, bar charts, and 24-hour heatmaps to expose correlations across year, day, and hour dimensions. Designed efficient client-side navigation and query flows.",
    tech: ["Python", "React", "D3.js", "Leaflet", "Pandas"],
    role: "Data Engineer & Frontend Dev",
    period: "Sept 2022 – Dec 2022",
    features: [
      "10,000+ crime record ingestion pipeline",
      "Interactive choropleth heatmaps",
      "Line graphs and 24-hour bar chart breakdowns",
      "Multi-dimensional filter: year, day, category",
      "Client-side query flows for real-time exploration",
    ],
    accent: "#fb923c",
    images: [],
  },
  {
    id: 5,
    title: "Media Rater",
    subtitle: "Java Backend System",
    summary:
      "A Java backend for ingesting and querying large-scale media datasets using custom data structures and a CSV pipeline.",
    description:
      "Engineered a Java backend for ingesting, storing, and querying large-scale media rating datasets using optimized in-memory data representations. Implemented custom data structures and comparison logic to accelerate sorting, filtering, and multi-criteria search. Developed a high-throughput CSV pipeline with validation, type coercion, and error handling.",
    tech: ["Java", "CSV Processing", "Data Structures", "Algorithms"],
    role: "Backend Developer",
    period: "Jan 2023 – Mar 2023",
    features: [
      "Custom in-memory data structures for fast lookups",
      "Multi-criteria sort, filter, and search operations",
      "High-throughput CSV ingestion with type coercion",
      "Validation and error handling for malformed records",
      "Optimized for large-scale dataset performance",
    ],
    accent: "#34d399",
    images: [],
  },
];

// ═══════════════════════════════════════════════════════
//  SKILLS DATA — grouped by category
// ═══════════════════════════════════════════════════════
const SKILL_GROUPS = [
  {
    category: "Languages",
    color: "#00d4ff",
    skills: ["Python", "Java", "C", "C++", "JavaScript", "PHP", "OCaml", "HTML/CSS"],
  },
  {
    category: "Frameworks & APIs",
    color: "#818cf8",
    skills: ["React", "Node.js", "Express", "REST APIs", "Vite"],
  },
  {
    category: "Data & Databases",
    color: "#34d399",
    skills: ["MySQL", "Pandas", "D3.js", "Leaflet", "CSV Pipelines"],
  },
  {
    category: "Tools & Platforms",
    color: "#fb923c",
    skills: ["Git", "Linux", "Figma", "Blender", "VS Code", "IntelliJ"],
  },
  {
    category: "Game Dev",
    color: "#f472b6",
    skills: ["Unreal Engine 5", "Blueprints", "UMG", "Enhanced Input", "SFX Integration"],
  },
];

// ═══════════════════════════════════════════════════════
//  TECH / SPEED BACKGROUND CANVAS
//  — motion streaks, HUD grid, neon trails, speed lines
// ═══════════════════════════════════════════════════════
function TechBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let W, H, t = 0;

    // Speed streaks — horizontal motion lines evoking speed/dashboards
    const streaks = [];
    // Floating node particles — circuit-board energy
    const nodes = [];
    // Scan line that sweeps vertically — radar/HUD feel
    let scanY = 0;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function init() {
      streaks.length = 0;
      nodes.length = 0;
      // Create horizontal speed streaks at varying Y positions
      for (let i = 0; i < 28; i++) {
        streaks.push({
          x: Math.random() * W,
          y: Math.random() * H,
          len: Math.random() * 180 + 40,
          speed: Math.random() * 2.5 + 0.8,
          alpha: Math.random() * 0.18 + 0.04,
          width: Math.random() * 1.2 + 0.3,
          hue: Math.random() > 0.7 ? 195 : Math.random() > 0.5 ? 210 : 220,
        });
      }
      // Floating circuit nodes
      for (let i = 0; i < 55; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.2 + 0.4,
          alpha: Math.random() * 0.4 + 0.1,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      t += 0.008;
      ctx.clearRect(0, 0, W, H);

      // ── 1. Subtle perspective grid (HUD / dashboard feel) ──
      ctx.save();
      const vanishY = H * 0.52;
      const horizonLeft  = W * 0.15;
      const horizonRight = W * 0.85;
      const GRID_LINES = 14;

      for (let i = 0; i <= GRID_LINES; i++) {
        const frac = i / GRID_LINES;
        const bx = horizonLeft + frac * (horizonRight - horizonLeft);
        // Vertical lines converging at vanish point
        ctx.beginPath();
        ctx.moveTo(bx, vanishY);
        ctx.lineTo(i < GRID_LINES / 2 ? 0 : i > GRID_LINES / 2 ? W : bx, H + 40);
        ctx.strokeStyle = `rgba(0,180,255,${0.025 * (1 - Math.abs(frac - 0.5) * 1.6)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      // Horizontal recession lines
      for (let j = 0; j < 10; j++) {
        const frac = j / 9;
        const ease = frac * frac; // perspective easing
        const y = vanishY + ease * (H - vanishY + 40);
        const alpha = ease * 0.06;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.strokeStyle = `rgba(0,200,255,${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
      ctx.restore();

      // ── 2. Speed streaks (motion lines, moving right) ──
      for (const s of streaks) {
        s.x += s.speed;
        if (s.x > W + s.len) s.x = -s.len;

        const grad = ctx.createLinearGradient(s.x - s.len, s.y, s.x, s.y);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(1, `hsla(${s.hue},100%,70%,${s.alpha})`);
        ctx.beginPath();
        ctx.moveTo(s.x - s.len, s.y);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.stroke();
      }

      // ── 3. Circuit nodes + edges ──
      // Draw edges between nearby nodes first
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,210,255,${0.045 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      // Draw nodes
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy; n.pulse += 0.025;
        if (n.x < 0) n.x = W; if (n.x > W) n.x = 0;
        if (n.y < 0) n.y = H; if (n.y > H) n.y = 0;
        const a = n.alpha * (0.65 + 0.35 * Math.sin(n.pulse));
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,220,255,${a})`;
        ctx.fill();
      }

      // ── 4. Ambient glow pools (nightlife / neon underbelly) ──
      const glows = [
        { x: W * 0.15, y: H * 0.72, r: 280, hue: 205, a: 0.032 + 0.008 * Math.sin(t * 0.7) },
        { x: W * 0.82, y: H * 0.3,  r: 220, hue: 240, a: 0.025 + 0.007 * Math.sin(t * 0.5 + 1) },
        { x: W * 0.5,  y: H * 0.1,  r: 180, hue: 195, a: 0.018 + 0.005 * Math.sin(t * 0.9 + 2) },
      ];
      for (const g of glows) {
        const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
        grad.addColorStop(0, `hsla(${g.hue},100%,65%,${g.a})`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // ── 5. Slow scan line (radar / instrument feel) ──
      scanY = (scanY + 0.35) % H;
      const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 2);
      scanGrad.addColorStop(0, "transparent");
      scanGrad.addColorStop(1, "rgba(0,210,255,0.04)");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 40, W, 42);

      animId = requestAnimationFrame(draw);
    }

    resize(); init(); animId = requestAnimationFrame(draw);
    window.addEventListener("resize", () => { resize(); init(); });
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="tech-canvas" />;
}

// ═══════════════════════════════════════════════════════
//  ANIMATED NAME
// ═══════════════════════════════════════════════════════
function AnimatedName({ name }) {
  return (
    <div className="animated-name" aria-label={name}>
      {name.split("").map((char, i) => (
        <span key={i} className="name-letter" style={{ animationDelay: `${0.3 + i * 0.07}s` }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  TYPEWRITER SUBTITLE
// ═══════════════════════════════════════════════════════
const ROLES = ["Software Engineer", "Full-Stack Developer", "Systems Programmer", "Builder of Real Products"];

function TypewriterSubtitle() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing");
  const charRef = useRef(0);

  useEffect(() => {
    const target = ROLES[roleIndex];
    if (phase === "typing") {
      if (charRef.current < target.length) {
        const t = setTimeout(() => { charRef.current++; setDisplayed(target.slice(0, charRef.current)); }, 52);
        return () => clearTimeout(t);
      } else { const t = setTimeout(() => setPhase("erasing"), 2000); return () => clearTimeout(t); }
    }
    if (phase === "erasing") {
      if (charRef.current > 0) {
        const t = setTimeout(() => { charRef.current--; setDisplayed(target.slice(0, charRef.current)); }, 26);
        return () => clearTimeout(t);
      } else { setRoleIndex((p) => (p + 1) % ROLES.length); setPhase("typing"); }
    }
  }, [phase, displayed, roleIndex]);

  return (
    <p className="hero-subtitle">
      <span className="subtitle-bracket">{"< "}</span>
      <span className="subtitle-role">{displayed}</span>
      <span className="cursor-blink">|</span>
      <span className="subtitle-bracket">{" />"}</span>
    </p>
  );
}

// ═══════════════════════════════════════════════════════
//  PROJECT MODAL
// ═══════════════════════════════════════════════════════
function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);
  if (!project) return null;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true">
      <div className="modal-panel" style={{ "--accent": project.accent }}>
        <div className="modal-topbar" />
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal-header">
          <div className="modal-header-glow" />
          <div className="modal-header-text">
            <div className="modal-meta-row">
              <span className="modal-role-chip">{project.role}</span>
              <span className="modal-period">{project.period}</span>
            </div>
            <h2 className="modal-title">{project.title}</h2>
            <p className="modal-subtitle-text">{project.subtitle}</p>
          </div>
        </div>

        <div className="modal-body">
          {project.images && project.images.length > 0 ? (
            <div className="modal-images">
              {project.images.map((src, i) => (
                <img key={i} src={src} alt={`${project.title} screenshot ${i + 1}`} className="modal-img" />
              ))}
            </div>
          ) : (
            <div className="modal-img-placeholder">
              <span className="modal-img-placeholder-title">Project Screenshots</span>
              <p className="modal-img-placeholder-sub">
                Add image paths to the <code>images</code> array in the project data to display them here.
              </p>
            </div>
          )}
          <p className="modal-desc">{project.description}</p>
          <div className="modal-section">
            <h4 className="modal-section-heading">Key Features</h4>
            <ul className="modal-feature-list">
              {project.features.map((f, i) => (
                <li key={i} className="modal-feature-item">
                  <span className="feature-dot" style={{ background: project.accent, boxShadow: `0 0 6px ${project.accent}` }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="modal-section">
            <h4 className="modal-section-heading">Tech Stack</h4>
            <div className="modal-tags">
              {project.tech.map((t) => (
                <span key={t} className="tech-tag" style={{ "--tag-color": project.accent }}>{t}</span>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <a href="#" className="btn btn-primary">View Live</a>
            <a href="https://github.com/PrinceKlair619" target="_blank" rel="noreferrer" className="btn btn-ghost">GitHub</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  PROJECT CAROUSEL — smooth sliding transition
// ═══════════════════════════════════════════════════════
function ProjectCarousel({ onCardClick }) {
  const [index, setIndex]       = useState(0);
  const [animDir, setAnimDir]   = useState(null);   // 'left' | 'right' | null
  const [isAnimating, setIsAnimating] = useState(false);
  const total = PROJECTS.length;

  const go = (dir) => {
    if (isAnimating) return;
    setAnimDir(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setIndex((prev) => dir === "right" ? (prev + 1) % total : (prev - 1 + total) % total);
      setAnimDir(null);
      setIsAnimating(false);
    }, 340);
  };

  // Three visible slots: prev, active, next
  const slots = [
    PROJECTS[(index - 1 + total) % total],
    PROJECTS[index],
    PROJECTS[(index + 1) % total],
  ];

  return (
    <div className="carousel-wrapper">
      <button className="carousel-arrow carousel-arrow-left"  onClick={() => go("left")}  aria-label="Previous project">&#8592;</button>
      <button className="carousel-arrow carousel-arrow-right" onClick={() => go("right")} aria-label="Next project">&#8594;</button>

      <div className={`carousel-track ${animDir ? `carousel-track--slide-${animDir}` : ""}`}>
        {slots.map((project, slot) => {
          const pos = slot === 0 ? "left" : slot === 1 ? "center" : "right";
          const isCenter = pos === "center";
          return (
            <div
              key={`${project.id}-${slot}`}
              className={`carousel-card carousel-card--${pos}`}
              style={{ "--accent": project.accent }}
              onClick={() => isCenter && !isAnimating && onCardClick(project)}
              role={isCenter ? "button" : undefined}
              tabIndex={isCenter ? 0 : -1}
              onKeyDown={(e) => isCenter && e.key === "Enter" && !isAnimating && onCardClick(project)}
            >
              <div className="carousel-card-bar" />
              <div className="carousel-card-visual">
                <div className="carousel-img-placeholder">
                  <span className="carousel-img-initial" style={{ color: project.accent }}>
                    {project.title.charAt(0)}
                  </span>
                  {/* Subtle accent glow behind initial */}
                  <div className="carousel-img-glow" style={{ background: project.accent }} />
                </div>
              </div>
              <div className="carousel-card-body">
                <p className="carousel-card-period">{project.period}</p>
                <h3 className="carousel-card-title">{project.title}</h3>
                <p className="carousel-card-subtitle">{project.subtitle}</p>
                {isCenter && <p className="carousel-card-summary">{project.summary}</p>}
                <div className="carousel-card-tags">
                  {project.tech.slice(0, 3).map((t) => (
                    <span key={t} className="tech-tag" style={{ "--tag-color": project.accent }}>{t}</span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="tech-tag tech-tag-more">+{project.tech.length - 3}</span>
                  )}
                </div>
                {isCenter && (
                  <button className="carousel-card-cta">
                    View Details &rarr;
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="carousel-dots">
        {PROJECTS.map((_, i) => (
          <button key={i} className={`carousel-dot ${i === index ? "carousel-dot--active" : ""}`}
            onClick={() => { if (!isAnimating) { const dir = i > index ? "right" : "left"; go(dir); } }}
            aria-label={`Project ${i + 1}`}
          />
        ))}
      </div>

      <p className="carousel-counter">
        <span className="carousel-counter-current">{String(index + 1).padStart(2, "0")}</span>
        <span className="carousel-counter-sep"> / </span>
        <span className="carousel-counter-total">{String(total).padStart(2, "0")}</span>
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  SKILLS — HUD-PANEL LAYOUT (redesigned)
// ═══════════════════════════════════════════════════════
function SkillsPanel() {
  const [activeGroup, setActiveGroup] = useState(0);

  return (
    <div className="skills-hud">
      {/* Category tabs — like a cockpit instrument selector */}
      <div className="skills-tabs">
        {SKILL_GROUPS.map((g, i) => (
          <button
            key={g.category}
            className={`skills-tab ${i === activeGroup ? "skills-tab--active" : ""}`}
            style={{ "--tab-color": g.color }}
            onClick={() => setActiveGroup(i)}
          >
            <span className="skills-tab-indicator" />
            <span className="skills-tab-label">{g.category}</span>
          </button>
        ))}
      </div>

      {/* Active panel */}
      <div className="skills-panel-body">
        {SKILL_GROUPS.map((g, i) => (
          <div
            key={g.category}
            className={`skills-panel ${i === activeGroup ? "skills-panel--active" : ""}`}
            style={{ "--panel-color": g.color }}
            aria-hidden={i !== activeGroup}
          >
            {/* Panel header bar */}
            <div className="skills-panel-header">
              <span className="skills-panel-title">{g.category}</span>
              <span className="skills-panel-count">{g.skills.length} entries</span>
            </div>

            {/* Skills list — like a system readout */}
            <div className="skills-readout">
              {g.skills.map((skill, si) => (
                <div
                  key={skill}
                  className="skills-readout-row"
                  style={{ animationDelay: `${si * 0.055}s` }}
                >
                  <span className="readout-index">{String(si + 1).padStart(2, "0")}</span>
                  <span className="readout-bar-track">
                    <span className="readout-bar-fill" style={{ "--bar-color": g.color, animationDelay: `${si * 0.055 + 0.1}s` }} />
                  </span>
                  <span className="readout-name">{skill}</span>
                  <span className="readout-status">ACTIVE</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  CONTACT FORM
// ═══════════════════════════════════════════════════════
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => { setStatus("sent"); setForm({ name: "", email: "", message: "" }); }, 1400);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="cf-name">Name</label>
          <input id="cf-name" name="name" type="text" className="form-input" placeholder="Your name"
            value={form.name} onChange={handleChange} required autoComplete="name" />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" className="form-input" placeholder="your@email.com"
            value={form.email} onChange={handleChange} required autoComplete="email" />
        </div>
      </div>
      <div className="form-field">
        <label className="form-label" htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" className="form-input form-textarea"
          placeholder="Tell me what you're working on..."
          value={form.message} onChange={handleChange} required rows={5} />
      </div>
      <div className="form-footer-row">
        <button type="submit" className="btn btn-primary" disabled={status === "sending" || status === "sent"}>
          {status === "sending" ? "Transmitting..." : status === "sent" ? "Message Sent" : "Send Message"}
        </button>
        {status === "sent" && <p className="form-success">Message received. I'll be in touch soon.</p>}
      </div>
    </form>
  );
}

// ═══════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════
export default function App() {
  const [activeProject, setActiveProject] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const h = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="page">
      <TechBackground />

      {/* ── NAVBAR ── */}
      <nav className={`navbar ${navScrolled ? "navbar-scrolled" : ""}`}>
        <div className="logo">
          <span className="logo-bracket">[</span>PK<span className="logo-bracket">]</span>
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
          {/* Angled accent line — speed/motion motif */}
          <div className="hero-slash" />
          <p className="hero-eyebrow">// hello, world — I'm</p>
          <AnimatedName name="Prince Klair" />
          <TypewriterSubtitle />
          <p className="hero-desc">
            CS student at the University at Buffalo. I build full-stack web apps,
            systems programs, and games — fast, clean, and built to last.
          </p>
          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">View Projects</a>
            <a href="https://github.com/PrinceKlair619" target="_blank" rel="noreferrer" className="btn btn-ghost">GitHub</a>
            <a href="https://linkedin.com/in/prince-k1" target="_blank" rel="noreferrer" className="btn btn-ghost">LinkedIn</a>
          </div>
          <div className="scroll-cue"><span /><span /><span /></div>
        </div>

        {/* Floating HUD telemetry numbers — subtle ambiance */}
        <div className="hero-hud" aria-hidden="true">
          <span className="hud-item">SYS_LOAD <em>0.04</em></span>
          <span className="hud-item">BUILD <em>READY</em></span>
          <span className="hud-item">STATUS <em>ONLINE</em></span>
        </div>
      </section>

      {/* ── SECTION DIVIDER ── */}
      <div className="section-divider" aria-hidden="true" />

      {/* ── ABOUT ── */}
      <section id="about" className="section about-section">
        <div className="section-inner">
          <span className="section-label">01 // About</span>
          <h2 className="section-title">Who I Am</h2>
          <div className="about-layout">
            <div className="about-image-col">
              <div className="about-image-frame">
                {/*
                  Replace this div with:
                  <img src="your-photo.jpg" alt="Prince Klair" className="about-photo" />
                */}
                <div className="about-image-placeholder">
                  <span className="about-initials">PK</span>
                  <div className="about-img-scan" />
                </div>
                <div className="about-corner about-corner-tl" />
                <div className="about-corner about-corner-br" />
              </div>
            </div>
            <div className="about-content-col">
              <p className="about-bio">
                I'm a Computer Science student at the University at Buffalo who enjoys
                building ideas into real, functional products. I've worked on full-stack
                web applications, interactive software, and large collaborative projects
                that required both technical execution and strong teamwork.
              </p>
              <p className="about-bio">
                I like seeing projects through from early planning stages to final
                implementation, making sure they're reliable, polished, and user-friendly.
                I'm naturally curious and driven to understand how systems work beneath
                the surface.
              </p>
              <p className="about-bio">
                When I build something, I focus on clarity, organization, and long-term
                structure — not just getting it done, but getting it done well. I'm
                comfortable working in fast-paced environments, communicating with
                different types of people, and adapting quickly when challenges come up.
                I take pride in being dependable, detail-oriented, and consistent.
              </p>
              <div className="about-meta-grid">
                <div className="about-meta-item">
                  <span className="meta-label">University</span>
                  <span className="meta-value">University at Buffalo</span>
                </div>
                <div className="about-meta-item">
                  <span className="meta-label">Degree</span>
                  <span className="meta-value">B.S. Computer Science</span>
                </div>
                <div className="about-meta-item">
                  <span className="meta-label">Expected</span>
                  <span className="meta-value">May 2026</span>
                </div>
                <div className="about-meta-item">
                  <span className="meta-label">Location</span>
                  <span className="meta-value">Yonkers, NY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ── PROJECTS ── */}
      <section id="projects" className="section projects-section">
        <div className="section-inner">
          <span className="section-label">02 // Projects</span>
          <h2 className="section-title">What I've Built</h2>
          <p className="section-sub">Navigate with the arrows. Click the center card for full details.</p>
          <ProjectCarousel onCardClick={setActiveProject} />
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ── SKILLS ── */}
      <section id="skills" className="section skills-section">
        <div className="section-inner">
          <span className="section-label">03 // Skills</span>
          <h2 className="section-title">Tools & Tech</h2>
          <p className="section-sub">Select a category to load the system readout.</p>
          <SkillsPanel />
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ── CONTACT ── */}
      <section id="contact" className="section contact-section">
        <div className="section-inner">
          <span className="section-label">04 // Contact</span>
          <h2 className="section-title">Let's Build Something</h2>
          <p className="contact-intro">
            Open to internships, collaborations, and interesting projects.
            Fill out the form or reach out directly.
          </p>
          <div className="contact-layout">
            <div className="contact-form-panel">
              <ContactForm />
            </div>
            <div className="contact-sidebar">
              <div className="contact-direct-block">
                <h4 className="contact-direct-heading">Direct Contact</h4>
                <a href="mailto:Klairprince619@gmail.com" className="contact-link-item">
                  <span className="contact-link-label">Email</span>
                  <span className="contact-link-value">Klairprince619@gmail.com</span>
                </a>
                <a href="https://linkedin.com/in/prince-k1" target="_blank" rel="noreferrer" className="contact-link-item">
                  <span className="contact-link-label">LinkedIn</span>
                  <span className="contact-link-value">linkedin.com/in/prince-k1</span>
                </a>
                <a href="https://github.com/PrinceKlair619" target="_blank" rel="noreferrer" className="contact-link-item">
                  <span className="contact-link-label">GitHub</span>
                  <span className="contact-link-value">github.com/PrinceKlair619</span>
                </a>
              </div>
              <div className="availability-badge">
                <span className="availability-pulse" />
                <span>Available for opportunities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <span>© 2025 Prince Klair</span>
        <span className="footer-tag">Built with React</span>
      </footer>

      {activeProject && (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </div>
  );
}
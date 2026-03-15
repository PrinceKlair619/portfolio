import { useState, useEffect, useRef } from "react";
import "./App.css";

// ═══════════════════════════════════════════════════════
//  PROJECT DATA — Add new projects here easily
// ═══════════════════════════════════════════════════════
const PROJECTS = [
  {
    id: 1,
    title: "Pupperazzi",
    subtitle: "Full-Stack Web Application",
    summary:
      "A full-stack pet-matching platform with user accounts, dog profiles, real-time messaging, and a social feed.",
    description:
      "Developed a full-stack pet-matching platform using React (Vite) on the frontend and a PHP/MySQL REST API backend, supporting user accounts, dog profiles, and dynamic content rendering. Implemented major frontend features including profile creation/editing, matches feed, messaging UI, event listings, RSVP flows, and responsive component-based layouts. Built backend endpoints for authentication, profile management, messages, events, matching, data retrieval, and form submissions. Integrated CORS, JSON responses, and secure request validation throughout.",
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
      "Engineered a full-duplex TCP chat platform using BSD sockets with non-blocking communication and select()-based I/O multiplexing. Designed a scalable server architecture supporting concurrent sessions, connection state tracking, message routing, and protocol-driven request handling. Implemented command parsing for login/logout, broadcasts, direct messages, blocklists, and complete server-side event logging for auditing and debugging.",
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
    accent: "#22d3ee",
    images: [],
  },
  {
    id: 3,
    title: "Cats of the Caribbean",
    subtitle: "Unreal Engine 5 Open-World Game",
    summary:
      "A modular UE5 open-world game featuring a real-time day-night cycle, a fishing minigame, and a custom player character.",
    description:
      "Developed a modular UE5 open-world framework featuring a real-time day-night cycle, island traversal, interactable objects, and trigger-based tutorial systems. Implemented a systems-driven fishing minigame using Blueprint state machines, timing-based input validation, reward logic, and inventory integration. Built an advanced options and keybind menu using Enhanced Input with runtime remapping, layered UMG widget hierarchies, and persistent input mapping storage. Created a custom player character in Blender with optimized meshes, bespoke animations, blendspaces, and spatially mixed SFX.",
    tech: ["Unreal Engine 5", "Blueprints", "C++", "Blender", "UMG", "Enhanced Input"],
    role: "Game Developer & Designer",
    period: "Sept 2025 – Dec 2025",
    features: [
      "Real-time day/night cycle with dynamic lighting",
      "Fishing minigame driven by Blueprint state machines",
      "Enhanced Input system with runtime key remapping",
      "Custom player character modeled and animated in Blender",
      "Layered UMG widget hierarchy with persistent settings storage",
    ],
    accent: "#a78bfa",
    images: [],
  },
  {
    id: 4,
    title: "Buffalo Crime Analyzer",
    subtitle: "Data Visualization Web App",
    summary:
      "A data-driven web app analyzing 10,000+ Buffalo crime records with interactive heatmaps, charts, and geographic filtering.",
    description:
      "Built a data-driven web application to preprocess and analyze 10,000+ Buffalo crime records with temporal, categorical, and geographic filtering. Implemented interactive visualizations including line graphs, bar charts, and 24-hour heatmaps to expose correlations across year, day, and hour dimensions. Designed efficient client-side navigation and query flows enabling users to dynamically explore incident distributions and trend patterns across the city.",
    tech: ["Python", "React", "D3.js", "Leaflet", "Pandas"],
    role: "Data Engineer & Frontend Developer",
    period: "Sept 2022 – Dec 2022",
    features: [
      "10,000+ crime record ingestion and preprocessing pipeline",
      "Interactive choropleth heatmaps with geographic drill-down",
      "Line graphs and 24-hour bar chart breakdowns",
      "Multi-dimensional filter system: year, day, category",
      "Client-side query flows for real-time exploration",
    ],
    accent: "#f59e0b",
    images: [],
  },
  {
    id: 5,
    title: "Media Rater",
    subtitle: "Java Backend System",
    summary:
      "A Java backend for ingesting and querying large-scale media rating datasets using custom data structures and a CSV pipeline.",
    description:
      "Engineered a Java backend for ingesting, storing, and querying large-scale media rating datasets using optimized in-memory data representations. Implemented custom data structures and comparison logic to accelerate sorting, filtering, and multi-criteria search operations. Developed a high-throughput CSV processing pipeline with validation, type coercion, and error handling for multi-thousand-record files.",
    tech: ["Java", "CSV Processing", "Custom Data Structures", "Algorithms"],
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
//  SKILLS DATA
// ═══════════════════════════════════════════════════════
const SKILLS = [
  { name: "Python",        category: "Language" },
  { name: "Java",          category: "Language" },
  { name: "C",             category: "Language" },
  { name: "C++",           category: "Language" },
  { name: "JavaScript",    category: "Language" },
  { name: "PHP",           category: "Language" },
  { name: "OCaml",         category: "Language" },
  { name: "HTML / CSS",    category: "Language" },
  { name: "React",         category: "Framework" },
  { name: "Node.js",       category: "Framework" },
  { name: "Express",       category: "Framework" },
  { name: "REST APIs",     category: "Framework" },
  { name: "MySQL",         category: "Database" },
  { name: "Git",           category: "Tool" },
  { name: "Linux",         category: "Tool" },
  { name: "Figma",         category: "Tool" },
  { name: "Blender",       category: "Tool" },
  { name: "Unreal Engine", category: "Tool" },
];

const CATEGORY_COLORS = {
  Language:  "#00d4ff",
  Framework: "#a78bfa",
  Database:  "#34d399",
  Tool:      "#f59e0b",
};

// ═══════════════════════════════════════════════════════
//  SPACE BACKGROUND CANVAS
// ═══════════════════════════════════════════════════════
function SpaceBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let W, H;
    const stars = [], orbs = [];

    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    function init() {
      stars.length = 0; orbs.length = 0;
      for (let i = 0; i < 220; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + 0.2, alpha: Math.random() * 0.5 + 0.2, speed: Math.random() * 0.1 + 0.02, twinkle: Math.random() * Math.PI * 2 });
      for (let i = 0; i < 5; i++) orbs.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 200 + 100, dx: (Math.random() - 0.5) * 0.15, dy: (Math.random() - 0.5) * 0.15, hue: Math.random() > 0.5 ? 195 : 260, alpha: Math.random() * 0.055 + 0.018 });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.save(); ctx.strokeStyle = "rgba(0,200,255,0.022)"; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 90) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 90) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.restore();
      for (const o of orbs) {
        o.x += o.dx; o.y += o.dy;
        if (o.x < -o.r) o.x = W + o.r; if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r; if (o.y > H + o.r) o.y = -o.r;
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, `hsla(${o.hue},100%,70%,${o.alpha})`); g.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      }
      for (const s of stars) {
        s.y += s.speed; s.twinkle += 0.018;
        if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
        const a = s.alpha * (0.6 + 0.4 * Math.sin(s.twinkle));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(200,240,255,${a})`; ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    resize(); init(); animId = requestAnimationFrame(draw);
    window.addEventListener("resize", () => { resize(); init(); });
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="space-canvas" />;
}

// ═══════════════════════════════════════════════════════
//  ANIMATED NAME — letter drop-in
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
      } else { const t = setTimeout(() => setPhase("erasing"), 1900); return () => clearTimeout(t); }
    }
    if (phase === "erasing") {
      if (charRef.current > 0) {
        const t = setTimeout(() => { charRef.current--; setDisplayed(target.slice(0, charRef.current)); }, 28);
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
//  PROJECT MODAL — expanded detail view
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
          {/* Image area — swap placeholder with real <img> tags when ready */}
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
                  <span className="feature-dot" style={{ background: project.accent }} />
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
//  PROJECT CAROUSEL — horizontal navigation
// ═══════════════════════════════════════════════════════
function ProjectCarousel({ onCardClick }) {
  const [index, setIndex] = useState(0);
  const total = PROJECTS.length;
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  // Three visible slots: left (prev), center (active), right (next)
  const slots = [
    PROJECTS[(index - 1 + total) % total],
    PROJECTS[index],
    PROJECTS[(index + 1) % total],
  ];

  return (
    <div className="carousel-wrapper">
      <button className="carousel-arrow carousel-arrow-left" onClick={prev} aria-label="Previous project">&#8592;</button>

      <div className="carousel-track">
        {slots.map((project, slot) => {
          const pos = slot === 0 ? "left" : slot === 1 ? "center" : "right";
          const isCenter = pos === "center";
          return (
            <div
              key={`${project.id}-${slot}`}
              className={`carousel-card carousel-card--${pos}`}
              style={{ "--accent": project.accent }}
              onClick={() => isCenter && onCardClick(project)}
              role={isCenter ? "button" : undefined}
              tabIndex={isCenter ? 0 : -1}
              onKeyDown={(e) => isCenter && e.key === "Enter" && onCardClick(project)}
              aria-label={isCenter ? `Open ${project.title}` : undefined}
            >
              <div className="carousel-card-bar" />

              {/* Image placeholder — replace inner div with <img> when ready */}
              <div className="carousel-card-visual">
                <div className="carousel-img-placeholder">
                  <span className="carousel-img-initial" style={{ color: project.accent }}>
                    {project.title.charAt(0)}
                  </span>
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
                  <button className="carousel-card-cta" style={{ "--accent": project.accent }}>
                    View Details &rarr;
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button className="carousel-arrow carousel-arrow-right" onClick={next} aria-label="Next project">&#8594;</button>

      {/* Progress / dot indicators */}
      <div className="carousel-dots">
        {PROJECTS.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === index ? "carousel-dot--active" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Project ${i + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <p className="carousel-counter">
        <span className="carousel-counter-current">{String(index + 1).padStart(2, "0")}</span>
        <span className="carousel-counter-sep"> / </span>
        <span className="carousel-counter-total">{String(total).padStart(2, "0")}</span>
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  CONTACT FORM
// ═══════════════════════════════════════════════════════
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // null | 'sending' | 'sent'

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    // Integrate with EmailJS, Formspree, or your own API here
    setStatus("sending");
    setTimeout(() => { setStatus("sent"); setForm({ name: "", email: "", message: "" }); }, 1400);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="cf-name">Name</label>
          <input
            id="cf-name" name="name" type="text" className="form-input"
            placeholder="Your name" value={form.name} onChange={handleChange}
            required autoComplete="name"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="cf-email">Email</label>
          <input
            id="cf-email" name="email" type="email" className="form-input"
            placeholder="your@email.com" value={form.email} onChange={handleChange}
            required autoComplete="email"
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="cf-message">Message</label>
        <textarea
          id="cf-message" name="message" className="form-input form-textarea"
          placeholder="Tell me what you're working on..."
          value={form.message} onChange={handleChange}
          required rows={5}
        />
      </div>

      <div className="form-footer-row">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === "sending" || status === "sent"}
        >
          {status === "sending" ? "Transmitting..." : status === "sent" ? "Message Sent" : "Send Message"}
        </button>
        {status === "sent" && (
          <p className="form-success">Message received. I'll be in touch soon.</p>
        )}
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
    const handler = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="page">
      <SpaceBackground />

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
            <a href="#projects" className="btn btn-primary">View Projects</a>
            <a href="https://github.com/PrinceKlair619" target="_blank" rel="noreferrer" className="btn btn-ghost">GitHub</a>
            <a href="https://linkedin.com/in/prince-k1" target="_blank" rel="noreferrer" className="btn btn-ghost">LinkedIn</a>
          </div>
          <div className="scroll-cue"><span /><span /><span /></div>
        </div>
      </section>

      {/* ── ABOUT ── [UPDATED] */}
      <section id="about" className="section about-section">
        <div className="section-inner">
          <span className="section-label">01 // About</span>
          <h2 className="section-title">Who I Am</h2>

          <div className="about-layout">
            {/* Profile image slot */}
            <div className="about-image-col">
              <div className="about-image-frame">
                {/*
                  To add your photo, replace the div below with:
                  <img src="your-photo.jpg" alt="Prince Klair" className="about-photo" />
                */}
                <div className="about-image-placeholder">
                  <span className="about-initials">PK</span>
                </div>
                <div className="about-corner about-corner-tl" />
                <div className="about-corner about-corner-br" />
              </div>
            </div>

            {/* Bio */}
            <div className="about-content-col">
              <p className="about-bio">
                I'm a Computer Science student at the University at Buffalo who enjoys
                building ideas into real, functional products. I've worked on full-stack
                web applications, interactive software, and large collaborative projects
                that required both technical execution and strong teamwork.
              </p>
              <p className="about-bio">
                I like seeing projects through from early planning stages to final
                implementation, making sure they're reliable, polished, and
                user-friendly. I'm naturally curious and driven to understand how
                systems work beneath the surface.
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

      {/* ── PROJECTS ── [NEW CAROUSEL] */}
      <section id="projects" className="section projects-section">
        <div className="section-inner">
          <span className="section-label">02 // Projects</span>
          <h2 className="section-title">What I've Built</h2>
          <p className="section-sub">
            Navigate with the arrows to browse all projects. Click the center card to view full details.
          </p>
          <ProjectCarousel onCardClick={setActiveProject} />
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="section skills-section">
        <div className="section-inner">
          <span className="section-label">03 // Skills</span>
          <h2 className="section-title">Tools & Tech</h2>
          <div className="skills-legend">
            {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
              <span key={cat} className="legend-item">
                <span className="legend-dot" style={{ background: color }} />
                {cat}
              </span>
            ))}
          </div>
          <div className="skills-grid">
            {SKILLS.map((s, i) => (
              <div
                key={s.name}
                className="skill-chip"
                style={{
                  animationDelay: `${i * 0.04}s`,
                  "--chip-color": CATEGORY_COLORS[s.category],
                }}
              >
                <span className="skill-dot" />
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── [NEW FORM] */}
      <section id="contact" className="section contact-section">
        <div className="section-inner">
          <span className="section-label">04 // Contact</span>
          <h2 className="section-title">Let's Build Something</h2>
          <p className="contact-intro">
            Open to internships, collaborations, and interesting projects.
            Fill out the form below or reach out directly.
          </p>

          <div className="contact-layout">
            {/* Form */}
            <div className="contact-form-panel">
              <ContactForm />
            </div>

            {/* Sidebar */}
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

      {/* ── PROJECT MODAL ── */}
      {activeProject && (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </div>
  );
}
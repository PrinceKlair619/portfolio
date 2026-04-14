import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import pupperazziImg from "./assets/pupperazzi.png";
import BC from "./assets/buffalo-crime.png";
import media from "./assets/mediarater.png";
import SuitPicture from "./assets/SuitPicture.png";
import YoursTruly from "./assets/yourTruly.png";
import yoga from "./assets/Yoga.png";
import bookclub from "./assets/bookclub.png";
import chat from "./assets/chat.png";

// ── DATA ─────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: 1,
    title: "YOGA AI",
    subtitle: "Real-Time Pose Correction System",
    period: "2025 – Present",
    status: "In Progress",
    image: yoga,
    imageLabel: "YOGA AI · Pose Detection",
    github: "https://github.com/milindku7/Yoga-CSE474",
    summary: "AI-powered yoga posture correction using YOLOv11-pose with live webcam feedback and ML classification pipeline.",
    bullets: [
      "Real-time posture correction using YOLOv11-pose with live webcam overlay and per-joint visual feedback",
      "Angle-based feedback engine computing joint deviation and generating targeted correction suggestions",
      "ML pipeline on Yoga-82 dataset (28k+ images): keypoint extraction and Random Forest pose classification",
      "Flask backend with real-time frame processing, REST APIs, and live pose overlay rendering",
    ],
    tools: ["Python", "Flask", "YOLOv11", "OpenCV", "scikit-learn", "Yoga-82"],
  },
  {
    id: 2,
    title: "BookClub",
    subtitle: "Social Platform for Book Enthusiasts",
    period: "2025 – Present",
    status: "In Progress",
    image: bookclub,
    imageLabel: "BookClub · Social Platform",
    github: null,
    summary: "Full-stack social book platform — leading as PM with sprints, Git coordination, and end-to-end system design.",
    bullets: [
      "Acting as Project Manager: sprint planning, task breakdown, and Git workflow coordination across the team",
      "Features: posts, feeds, interactions, discussions, and scalable social graph architecture",
      "Driving full-stack system design decisions across frontend and backend for performance and scalability",
      "Modern React frontend with RESTful backend, user auth, and dynamic content rendering",
    ],
    tools: ["React", "Node.js", "REST API", "MySQL", "Git", "System Design"],
  },
  {
    id: 3,
    title: "Pupperazzi",
    subtitle: "Full-Stack Web Application",
    period: "Sept 2025 – Dec 2025",
    status: null,
    image: pupperazziImg,
    imageLabel: "Pupperazzi · Pet Matching Platform",
    github: "https://github.com/PrinceKlair619/Pupperazzi-app",
    summary: "Full-stack pet-matching platform with user accounts, dog profiles, messaging, events, and responsive frontend.",
    bullets: [
      "React (Vite) frontend + PHP/MySQL REST API backend with user accounts, dog profiles, and dynamic rendering",
      "Frontend: profile creation/editing, matches feed, messaging UI, event listings, and RSVP flows",
      "Backend: authentication, profile management, messaging, events, matching, and secure request validation",
      "Git-based team workflow with feature branches and production-ready delivery across frontend and backend",
    ],
    tools: ["React", "Vite", "PHP", "MySQL", "REST API"],
  },
  {
    id: 4,
    title: "Chat Server & Client",
    subtitle: "C++ Socket Programming",
    period: "Sept 2025 – Nov 2025",
    status: null,
    image: chat,
    imageLabel: "Chat Server · TCP/IP Networking",
    github: "https://github.com/PrinceKlair619/chat-project",
    live: "https://princeklair619.github.io/chat-project/",
    summary: "Full-duplex TCP chat using BSD sockets with non-blocking I/O and select()-based session multiplexing.",
    bullets: [
      "Full-duplex TCP chat platform using BSD sockets with non-blocking I/O and select()-based multiplexing",
      "Scalable server architecture with concurrent session tracking, message routing, and protocol handling",
      "Commands: login/logout, broadcasts, direct messages, blocklists, and complete server-side audit logging",
    ],
    tools: ["C++", "BSD Sockets", "TCP/IP", "Non-Blocking I/O", "select()"],
  },
  {
    id: 5,
    title: "Cats of the Caribbean",
    subtitle: "Unreal Engine 5 Open-World Game",
    period: "Sept 2025 – Dec 2025",
    status: null,
    image: null,
    imageLabel: "Cats of the Caribbean · UE5",
    github: null,
    summary: "Open-world UE5 game featuring a day-night cycle, fishing minigame, custom character, and remappable keybinds.",
    bullets: [
      "Modular UE5 open-world framework: real-time day-night cycle, island traversal, and trigger-based tutorials",
      "Fishing minigame with Blueprint state machines, timing-based input validation, rewards, and inventory",
      "Advanced options/keybind menu using Enhanced Input with runtime remapping and persistent input storage",
      "Custom player character in Blender — optimized meshes, animations, blendspaces, and spatial SFX",
    ],
    tools: ["Unreal Engine 5", "Blueprints", "C++", "Blender", "UMG", "Enhanced Input"],
  },
  {
    id: 6,
    title: "Media Rater",
    subtitle: "Data Processing Backend",
    period: "Jan 2023 – Mar 2023",
    status: null,
    image: media,
    imageLabel: "Media Rater · Java Backend",
    github: "https://github.com/PrinceKlair619/mediarater",
    live: "https://princeklair619.github.io/mediarater/",
    summary: "Java backend for ingesting, storing, and querying large-scale media rating datasets with optimized data structures.",
    bullets: [
      "Java backend for ingesting, storing, and querying large-scale media rating datasets in-memory",
      "Custom data structures and comparison logic for sorting, filtering, and multi-criteria search",
      "High-throughput CSV pipeline with validation, type coercion, and error handling for multi-thousand-record files",
    ],
    tools: ["Java", "Data Structures", "Algorithms", "CSV Processing"],
  },
  {
    id: 7,
    title: "Buffalo Crime Analyzer",
    subtitle: "Data Visualization Web App",
    period: "Sept 2022 – Dec 2022",
    status: null,
    image: BC,
    imageLabel: "Buffalo Crime Analyzer · Data Viz",
    github: "https://github.com/PrinceKlair619/Buffalo-crime",
    summary: "Data-driven web app analyzing 10,000+ crime records with interactive charts, heatmaps, and dynamic filtering.",
    bullets: [
      "Preprocessed and analyzed 10,000+ Buffalo crime records with temporal, categorical, and geographic filtering",
      "Interactive visualizations: line graphs, bar charts, and 24-hour heatmaps exposing multi-dimensional trends",
      "Efficient client-side query flows for dynamic exploration of incident distributions and trend patterns",
    ],
    tools: ["JavaScript", "Data Visualization", "Charts", "Filtering"],
  },
];

const EXPERIENCE = [
  {
    title: "Freelance Web Developer",
    company: "Yours Truly Contracting",
    location: "Yonkers, NY",
    period: "Mar 2024 – Jul 2024",
    image: YoursTruly,
    imageLabel: "Yours Truly Contracting · Web Project",
    bullets: [
      "Designed and deployed a responsive client website that increased inquiries by 40% within 3 months.",
      "Showcased 10+ projects, testimonials, and contracting services to strengthen customer trust.",
      "Optimized navigation and UI layouts, reducing bounce rate by 25% during user testing.",
    ],
  },
  {
    title: "Passenger Services Agent",
    company: "Swissport International",
    location: "Jamaica, NY",
    period: "Jun 2024 – Aug 2024",
    image: null,
    imageLabel: null,
    bullets: [
      "Directed boarding operations, coordinated gate changes, and ensured on-time departures.",
      "Assisted passengers with flight information, delays, and general inquiries.",
      "Processed passports and visas in compliance with international travel and customs regulations.",
    ],
  },
  {
    title: "Store Associate",
    company: "7 Days Gas and Food Mart",
    location: "New Rochelle, NY",
    period: "Jun 2021 – Present",
    image: null,
    imageLabel: null,
    bullets: [
      "Resolved operational issues efficiently while providing consistent, high-quality customer service.",
      "Maintained store organization, cleanliness, and safety standards to support daily operations.",
      "Handled transactions, assisted customers, and supported inventory management tasks.",
    ],
  },
];

const SKILLS = {
  Programming: ["Python", "Java", "C", "C++", "JavaScript", "HTML/CSS", "PHP", "OCaml"],
  "Full-Stack": ["React", "Node.js", "Express", "REST APIs", "MySQL", "Responsive UI/UX"],
  "Tools & Platforms": ["Git", "GitHub", "Linux", "VS Code", "IntelliJ", "Replit", "Figma", "Blender"],
  "Game Development": ["Unreal Engine 5", "Blueprints", "UMG", "Enhanced Input", "Animation Blueprints", "SFX"],
  Strengths: ["Debugging", "System Design", "Problem Solving", "Communication", "Attention to Detail"],
};

const ROLES = [
  "Full-Stack Developer",
  "Systems Programmer",
  "Software Engineer",
  "Builder of Real Products",
];

// ── ANIMATED BACKGROUND ───────────────────────────────────────────────────────

function AnimatedBackground({ isDark }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Speed lines — motorcycle at speed
    const lines = Array.from({ length: 52 }, () => {
      const isBright = Math.random() < 0.18; // occasional bright accent line
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: 1.8 + Math.random() * 7.2,
        len: 48 + Math.random() * 180,
        alpha: isBright ? 0.055 + Math.random() * 0.04 : 0.016 + Math.random() * 0.038,
        w: isBright ? 2.0 : (Math.random() < 0.28 ? 1.4 : 0.85),
        cyan: Math.random() < 0.12, // mix in teal-tinted lines for tech feel
      };
    });

    // Matrix drops — coding aesthetic
    const fontSize = 11;
    const colCount = Math.floor(W / fontSize);
    const drops = Array.from({ length: colCount }, () => Math.random() * -(H / fontSize));
    const matChars = "01アイウエオカキクケコ{}[]<>/\\;:~`_=+!?@#";

    let frame = 0;

    const draw = () => {
      frame++;
      // Slightly longer trail persistence = more dramatic streaks
      ctx.fillStyle = isDark ? "rgba(10,10,12,0.042)" : "rgba(244,244,248,0.09)";
      ctx.fillRect(0, 0, W, H);

      // Speed lines
      lines.forEach((l) => {
        const a = isDark ? l.alpha : l.alpha * 0.38;
        const r = l.cyan ? 0 : 42;
        const g = l.cyan ? 200 : 110;
        const b = l.cyan ? 180 : 245;
        const grad = ctx.createLinearGradient(l.x - l.len, l.y, l.x, l.y);
        grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        grad.addColorStop(0.55, `rgba(${r},${g},${b},${a * 0.28})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},${a})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = l.w;
        ctx.beginPath();
        ctx.moveTo(l.x - l.len, l.y);
        ctx.lineTo(l.x, l.y);
        ctx.stroke();
        l.x += l.vx;
        if (l.x > W + l.len) {
          l.x = -l.len;
          l.y = Math.random() * H;
          l.vx = 1.8 + Math.random() * 7.2;
        }
      });

      // Matrix characters every 2nd frame (faster, more present)
      if (frame % 2 === 0) {
        ctx.font = `${fontSize}px "DM Mono", monospace`;
        const ca = isDark ? 0.095 : 0.038;
        drops.forEach((drop, i) => {
          if (drop < 0) { drops[i] += 0.2; return; }
          const char = matChars[Math.floor(Math.random() * matChars.length)];
          // Occasional brighter "fresh" character for depth
          const bright = Math.random() < 0.04;
          ctx.fillStyle = bright
            ? `rgba(42,200,180,${ca * 2.2})`
            : `rgba(42,110,245,${ca})`;
          ctx.fillText(char, i * fontSize, drop * fontSize);
          if (drop * fontSize > H && Math.random() > 0.973) drops[i] = 0;
          drops[i] += 0.25;
        });
      }

      animId = requestAnimationFrame(draw);
    };

    ctx.fillStyle = isDark ? "#0a0a0c" : "#f4f4f8";
    ctx.fillRect(0, 0, W, H);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="bg-canvas" />;
}

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function AnimatedName({ name }) {
  return (
    <h1 className="animated-name" aria-label={name}>
      {name.split("").map((char, i) => (
        <span key={i} className="name-letter" style={{ animationDelay: `${0.18 + i * 0.048}s` }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}

function TypewriterSubtitle() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing");
  const charRef = useRef(0);

  useEffect(() => {
    const target = ROLES[roleIndex];
    if (phase === "typing") {
      if (charRef.current < target.length) {
        const t = setTimeout(() => { charRef.current += 1; setDisplayed(target.slice(0, charRef.current)); }, 52);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("erasing"), 1900);
      return () => clearTimeout(t);
    }
    if (phase === "erasing") {
      if (charRef.current > 0) {
        const t = setTimeout(() => { charRef.current -= 1; setDisplayed(target.slice(0, charRef.current)); }, 26);
        return () => clearTimeout(t);
      }
      setRoleIndex((p) => (p + 1) % ROLES.length);
      setPhase("typing");
    }
  }, [phase, roleIndex, displayed]);

  return (
    <p className="hero-role">
      <span className="role-bracket">{"< "}</span>
      <span className="role-text">{displayed}</span>
      <span className="cursor-blink">|</span>
      <span className="role-bracket">{" />"}</span>
    </p>
  );
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.06, rootMargin: "0px 0px -32px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", delay = "" }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${delay} ${className}`.trim()}>{children}</div>;
}

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// ── PROJECT CAROUSEL ──────────────────────────────────────────────────────────

function CarouselItem({ project, isActive, isExpanded, onItemClick }) {
  const handleClick = useCallback(
    (e) => { e.stopPropagation(); onItemClick(); },
    [onItemClick]
  );

  return (
    <div
      className={`carousel-item${isActive ? " active" : ""}${isExpanded ? " expanded" : ""}`}
      onClick={handleClick}
      role="button"
      tabIndex={isActive ? 0 : -1}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(e); }
      }}
      aria-label={`${project.title} — ${isExpanded ? "collapse" : "expand details"}`}
      aria-expanded={isExpanded}
    >
      <div className="carousel-card">
        {/* ── Image ── */}
        <div className="carousel-image-container">
          {project.image ? (
            <img src={project.image} alt={project.imageLabel} loading="lazy" />
          ) : (
            <div className="carousel-placeholder">
              <span className="carousel-placeholder-text">{project.imageLabel}</span>
            </div>
          )}

          <div className="carousel-image-overlay">
            <p className="carousel-period">{project.period}</p>
            <h3 className="carousel-title">{project.title}</h3>
            <p className="carousel-subtitle-label">{project.subtitle}</p>
            {isActive && (
              <p className="carousel-click-hint">
                {isExpanded ? "↑ click to collapse" : "↓ click to expand"}
              </p>
            )}
          </div>

          <div className="carousel-number">0{project.id}</div>
        </div>

        {/* ── Expand panel ── */}
        <div className="carousel-expand-panel">
          <div className="carousel-expand-inner">
            {project.status && (
              <div className="carousel-status-badge">
                <span className="carousel-status-dot" />
                {project.status}
              </div>
            )}
            <div className="carousel-expand-grid">
              {/* Left: bullet points */}
              <ul className="carousel-bullets">
                {project.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              {/* Right: tech stack + links */}
              <div className="carousel-expand-right">
                <div className="carousel-expand-tools">
                  {project.tools.map((t) => <span className="tool-tag" key={t}>{t}</span>)}
                </div>
                {(project.github || project.live) && (
                  <div className="carousel-expand-links">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="project-action-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GithubIcon /> GitHub
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="project-action-link project-action-link-live"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const trackRef = useRef(null);
  const isHovering = useRef(false);

  const scrollToItem = useCallback((index) => {
    const track = trackRef.current;
    if (!track) return;
    const items = track.children;
    if (!items[index]) return;
    const trackRect = track.getBoundingClientRect();
    const itemRect = items[index].getBoundingClientRect();
    const delta =
      itemRect.left + itemRect.width / 2 - (trackRect.left + trackRect.width / 2);
    track.scrollTo({ left: track.scrollLeft + delta, behavior: "smooth" });
  }, []);

  // Center on active item change
  useEffect(() => { scrollToItem(activeIndex); }, [activeIndex, scrollToItem]);

  // Initial center on mount
  useEffect(() => {
    const t = setTimeout(() => scrollToItem(0), 80);
    return () => clearTimeout(t);
  }, [scrollToItem]);

  // Auto-scroll (pauses on hover or when expanded)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovering.current && expandedIndex === null) {
        setActiveIndex((p) => (p + 1) % PROJECTS.length);
      }
    }, 4200);
    return () => clearInterval(interval);
  }, [expandedIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((p) => (p - 1 + PROJECTS.length) % PROJECTS.length);
        setExpandedIndex(null);
      } else if (e.key === "ArrowRight") {
        setActiveIndex((p) => (p + 1) % PROJECTS.length);
        setExpandedIndex(null);
      } else if (e.key === "Escape") {
        setExpandedIndex(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleItemClick = (index) => {
    if (activeIndex === index) {
      setExpandedIndex((prev) => (prev === index ? null : index));
    } else {
      setActiveIndex(index);
      setExpandedIndex(null);
    }
  };

  const goPrev = () => {
    setActiveIndex((p) => (p - 1 + PROJECTS.length) % PROJECTS.length);
    setExpandedIndex(null);
  };

  const goNext = () => {
    setActiveIndex((p) => (p + 1) % PROJECTS.length);
    setExpandedIndex(null);
  };

  return (
    <div
      className="carousel-wrapper"
      onMouseEnter={() => { isHovering.current = true; }}
      onMouseLeave={() => { isHovering.current = false; }}
    >
      <div className="carousel-track" ref={trackRef}>
        {PROJECTS.map((project, i) => (
          <CarouselItem
            key={project.id}
            project={project}
            isActive={activeIndex === i}
            isExpanded={expandedIndex === i}
            onItemClick={() => handleItemClick(i)}
          />
        ))}
      </div>

      <div className="carousel-nav">
        <button className="carousel-arrow" onClick={goPrev} aria-label="Previous project">‹</button>
        <div className="carousel-dots">
          {PROJECTS.map((p, i) => (
            <button
              key={i}
              className={`carousel-dot${activeIndex === i ? " active" : ""}`}
              onClick={() => { setActiveIndex(i); setExpandedIndex(null); }}
              aria-label={`Go to ${p.title}`}
            />
          ))}
        </div>
        <button className="carousel-arrow" onClick={goNext} aria-label="Next project">›</button>
      </div>
    </div>
  );
}

// ── CONTACT FORM ──────────────────────────────────────────────────────────────
const EMPTY = { name: "", email: "", message: "" };

function ContactForm() {
  const [fields, setFields] = useState(EMPTY);
  const [errors, setErrors] = useState(EMPTY);
  const [status, setStatus] = useState("idle");

  function validate() {
    const e = { name: "", email: "", message: "" };
    let ok = true;
    if (!fields.name.trim()) { e.name = "Name is required."; ok = false; }
    if (!fields.email.trim()) { e.email = "Email is required."; ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) { e.email = "Enter a valid email."; ok = false; }
    if (!fields.message.trim()) { e.message = "Message is required."; ok = false; }
    else if (fields.message.trim().length < 10) { e.message = "Message is too short."; ok = false; }
    setErrors(e);
    return ok;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    const subject = encodeURIComponent(`Portfolio message from ${fields.name}`);
    const body = encodeURIComponent(`Name: ${fields.name}\nEmail: ${fields.email}\n\n${fields.message}`);
    window.location.href = `mailto:Klairprince619@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => { setStatus("success"); setFields(EMPTY); setErrors(EMPTY); }, 600);
  }

  const statusLabel = { idle: "", sending: "Opening mail client…", success: "✓ Message ready to send.", error: "Something went wrong." }[status];
  const statusClass = { idle: "", sending: "sending", success: "success", error: "error-state" }[status];

  return (
    <div className="contact-form-card">
      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="cf-name">Name</label>
          <input id="cf-name" name="name" className={`form-input${errors.name ? " field-error" : ""}`} placeholder="Your name" value={fields.name} onChange={handleChange} autoComplete="name" />
          {errors.name && <span className="form-error-msg">{errors.name}</span>}
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="cf-email">Email</label>
          <input id="cf-email" name="email" type="email" className={`form-input${errors.email ? " field-error" : ""}`} placeholder="you@example.com" value={fields.email} onChange={handleChange} autoComplete="email" />
          {errors.email && <span className="form-error-msg">{errors.email}</span>}
        </div>
      </div>
      <div className="form-field">
        <label className="form-label" htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" className={`form-textarea${errors.message ? " field-error" : ""}`} placeholder="What's on your mind?" value={fields.message} onChange={handleChange} />
        {errors.message && <span className="form-error-msg">{errors.message}</span>}
      </div>
      <div className="form-footer">
        <span className={`form-status ${statusClass}`}>{statusLabel}</span>
        <button className="submit-btn" onClick={handleSubmit} disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send Message →"}
        </button>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Apply theme class to <html> so CSS variables cascade everywhere including body::before
  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", !darkMode);
  }, [darkMode]);

  const handleThemeToggle = () => {
    const html = document.documentElement;
    html.classList.add("theme-transitioning");
    setDarkMode((p) => !p);
    setTimeout(() => html.classList.remove("theme-transitioning"), 500);
  };

  return (
    <>
      <AnimatedBackground isDark={darkMode} />
      <div className="page">

        {/* ── NAVBAR ── */}
        <nav className={`navbar${navScrolled ? " navbar-scrolled" : ""}`}>
          <a href="#home" className="brand">Prince <span>Klair</span></a>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#experience">Experience</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
            <button
              className="theme-toggle"
              onClick={handleThemeToggle}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              <span className="theme-toggle-icon">{darkMode ? "☀" : "☾"}</span>
            </button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section id="home" className="hero section">
          <div className="hero-copy">
            <p className="eyebrow">Computer Science · University at Buffalo</p>
            <AnimatedName name="Prince Klair" />
            <TypewriterSubtitle />
            <p className="hero-summary">
              I build polished software across full-stack development, systems programming, backend engineering, and interactive products.
            </p>
            <p className="hero-summary secondary">
              "The people who succeed aren't the ones who avoid failure, they're the ones who run out of ways to fail."
            </p>
            <div className="hero-actions">
              <a href="#projects" className="button primary">View Projects</a>
              <a href="https://github.com/PrinceKlair619" target="_blank" rel="noreferrer" className="button secondary">GitHub</a>
              <a href="https://linkedin.com/in/prince-k1" target="_blank" rel="noreferrer" className="button secondary">LinkedIn</a>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-panel-label">Quick Snapshot</div>
            <ul>
              <li>B.S. in Computer Science, University at Buffalo</li>
              <li>Expected graduation: May 2026</li>
              <li>Experience across web, systems, game dev, and data</li>
              <li>Interested in clean products with real-world impact</li>
            </ul>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" className="section">
          <Reveal>
            <div className="section-header">
              <p className="section-kicker">About</p>
              <h2>About Me</h2>
            </div>
          </Reveal>
          <div className="about-grid">
            <Reveal className="slide-left">
              <div className="about-card">
                <img src={SuitPicture} alt="Prince Klair" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius-lg)", display: "block" }} />
              </div>
            </Reveal>
            <div className="about-text">
              <Reveal delay="reveal-delay-1">
                <p>I'm a Computer Science student at the University at Buffalo focused on building software that is both technically strong and thoughtfully designed. My experience spans full-stack applications, backend systems, data visualization, socket-based networking, and game development.</p>
              </Reveal>
              <Reveal delay="reveal-delay-2">
                <p>I enjoy taking projects from idea to implementation and making sure they feel polished, reliable, and user-friendly. I care a lot about structure, debugging, maintainability, and building things that feel complete rather than rushed.</p>
              </Reveal>
              <Reveal delay="reveal-delay-3">
                <p>Outside of tech, I'm interested in cars, motorcycles, traveling, and experiences that involve speed, movement, and energy. That mindset influences how I like my work to feel too: focused, confident, and built with purpose.</p>
              </Reveal>
              <Reveal delay="reveal-delay-4">
                <div className="meta-grid">
                  {[
                    { label: "University", value: "University at Buffalo" },
                    { label: "Degree", value: "B.S. Computer Science" },
                    { label: "Expected", value: "May 2026" },
                    { label: "Location", value: "Yonkers, NY" },
                  ].map((item) => (
                    <div className="meta-item" key={item.label}>
                      <span className="meta-label">{item.label}</span>
                      <span className="meta-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" className="section projects-section">
          <Reveal>
            <div className="section-header projects-section-header">
              <p className="section-kicker">Projects</p>
              <h2>Projects</h2>
              <p className="section-note">
                A few projects across full-stack, systems, data, and game development. Click any project to expand full details.
              </p>
            </div>
          </Reveal>
          <ProjectCarousel />
        </section>

        {/* ── EXPERIENCE ── */}
        <section id="experience" className="section">
          <Reveal>
            <div className="section-header">
              <p className="section-kicker">Experience</p>
              <h2>Experience</h2>
            </div>
          </Reveal>
          <div className="experience-list">
            {EXPERIENCE.map((job, i) => (
              <Reveal key={job.title + job.company} delay={`reveal-delay-${i + 1}`}>
                <article className="experience-item">
                  {job.image && (
                    <div className="experience-image">
                      <img src={job.image} alt={job.imageLabel} />
                    </div>
                  )}
                  <div className="experience-body">
                    <div className="experience-top">
                      <div>
                        <h3>{job.title}</h3>
                        <p className="experience-company">{job.company}{job.location ? ` · ${job.location}` : ""}</p>
                      </div>
                      <span className="experience-period">{job.period}</span>
                    </div>
                    <ul>
                      {job.bullets.map((b) => <li key={b}>{b}</li>)}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" className="section">
          <Reveal>
            <div className="section-header">
              <p className="section-kicker">Skills</p>
              <h2>Technical Skills</h2>
            </div>
          </Reveal>
          <div className="skills-grid">
            {Object.entries(SKILLS).map(([group, items], i) => (
              <Reveal key={group} delay={`reveal-delay-${(i % 4) + 1}`}>
                <div className="skill-group">
                  <h3>{group}</h3>
                  <div className="skill-tags">
                    {items.map((item) => <span className="skill-tag" key={item}>{item}</span>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="section">
          <Reveal>
            <div className="section-header">
              <p className="section-kicker">Contact</p>
              <h2>Let's Connect</h2>
              <p className="section-note">
                Open to internships, collaborations, and interesting software opportunities. Drop a message or reach out directly.
              </p>
            </div>
          </Reveal>
          <div className="contact-layout">
            <Reveal className="slide-left">
              <div className="contact-info">
                <p className="contact-info-heading">Get in touch</p>
                <p className="contact-info-note">
                  Whether you have a role in mind, a project to collaborate on, or just want to say hello — I'm always happy to hear from you.
                </p>
                <div className="contact-links-list">
                  <a href="mailto:Klairprince619@gmail.com" className="contact-link">
                    <span className="contact-link-icon">@</span>Klairprince619@gmail.com
                  </a>
                  <a href="https://linkedin.com/in/prince-k1" target="_blank" rel="noreferrer" className="contact-link">
                    <span className="contact-link-icon">in</span>linkedin.com/in/prince-k1
                  </a>
                  <a href="https://github.com/PrinceKlair619" target="_blank" rel="noreferrer" className="contact-link">
                    <span className="contact-link-icon">gh</span>github.com/PrinceKlair619
                  </a>
                  <a href="https://www.instagram.com/prince_k1air/" target="_blank" rel="noreferrer" className="contact-link">
                    <span className="contact-link-icon">ig</span>instagram.com/prince_k1air
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal delay="reveal-delay-2">
              <ContactForm />
            </Reveal>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <span>© 2025 Prince Klair</span>
          <span>Built with React · University at Buffalo</span>
        </footer>

      </div>
    </>
  );
}

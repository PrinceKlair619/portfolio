import { useState, useEffect, useRef } from "react";
import "./App.css";

const PROJECTS = [
  {
    id: 1,
    title: "Pupperazzi",
    subtitle: "Full-Stack Web App",
    period: "Sept – Dec 2025",
    summary:
      "Full-stack pet-matching platform with user accounts, dog profiles, messaging, events, and responsive frontend flows.",
    details:
      "Built with React (Vite) on the frontend and a PHP/MySQL REST API backend. Implemented profile creation and editing, matches feed, messaging UI, event listings, RSVP flows, authentication, profile management, and production-ready features across both frontend and backend.",
    tools: ["React", "Vite", "PHP", "MySQL", "REST API"],
  },
  {
    id: 2,
    title: "Chat Server & Client",
    subtitle: "C++ Socket Programming",
    period: "Sept – Nov 2025",
    summary:
      "Full-duplex TCP chat platform using BSD sockets with non-blocking communication and scalable session handling.",
    details:
      "Designed server architecture for concurrent sessions, connection state tracking, message routing, and protocol-driven request handling. Implemented login/logout, broadcasts, direct messaging, blocklists, and complete server-side event logging.",
    tools: ["C++", "BSD Sockets", "TCP/IP", "Non-Blocking I/O", "select()"],
  },
  {
    id: 3,
    title: "Cats of the Caribbean",
    subtitle: "Unreal Engine 5 Game",
    period: "Sept – Dec 2025",
    summary:
      "Open-world UE5 game with a day-night cycle, fishing systems, custom character work, and gameplay UI.",
    details:
      "Built island traversal systems, tutorial triggers, a fishing minigame using Blueprint state machines, timing-based validation, reward logic, inventory integration, and runtime keybinding with Enhanced Input. Created custom player assets, animations, blendspaces, and SFX integration.",
    tools: ["Unreal Engine 5", "Blueprints", "C++", "Blender", "UMG", "Enhanced Input"],
  },
  {
    id: 4,
    title: "Media Rater",
    subtitle: "Java Backend System",
    period: "Jan – Mar 2023",
    summary:
      "Java backend for ingesting, storing, and querying large-scale media rating datasets efficiently.",
    details:
      "Implemented custom data structures and comparison logic for faster sorting, filtering, and multi-criteria search operations. Built a high-throughput CSV processing pipeline with validation, type coercion, and error handling.",
    tools: ["Java", "Data Structures", "Algorithms", "CSV Processing"],
  },
  {
    id: 5,
    title: "Buffalo Crime Analyzer",
    subtitle: "Data Visualization Web App",
    period: "Sept – Dec 2022",
    summary:
      "Data-driven application for analyzing 10,000+ Buffalo crime records across time, category, and geography.",
    details:
      "Implemented interactive visualizations including line graphs, bar charts, and 24-hour heatmaps. Designed client-side navigation and filtering flows so users could dynamically explore incident distributions and trend patterns.",
    tools: ["Python", "React", "Data Visualization", "Charts", "Filtering"],
  },
];

const EXPERIENCE = [
  {
    title: "Freelance Web Developer",
    company: "Yours Truly Contracting",
    period: "Mar – Jul 2024",
    bullets: [
      "Designed and deployed a responsive client website that increased inquiries by 40% within 3 months.",
      "Showcased 10+ projects, testimonials, and services to strengthen customer trust.",
      "Optimized navigation and UI layouts, reducing bounce rate by 25% during user testing.",
    ],
  },
  {
    title: "Passenger Services Agent",
    company: "Swissport International",
    period: "Jun – Aug 2024",
    bullets: [
      "Directed boarding operations, coordinated gate changes, and supported on-time departures.",
      "Assisted passengers with flight information, delays, and general inquiries.",
      "Processed passports and visas in compliance with travel and customs regulations.",
    ],
  },
  {
    title: "Store Associate",
    company: "7 Days Gas and Food Mart",
    period: "Jun 2021 – Present",
    bullets: [
      "Resolved operational issues efficiently while providing consistent customer service.",
      "Maintained organization, cleanliness, and safety standards.",
      "Handled transactions, customer support, and inventory-related tasks.",
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

// ── Animated name
function AnimatedName({ name }) {
  return (
    <h1 className="animated-name" aria-label={name}>
      {name.split("").map((char, i) => (
        <span
          key={i}
          className="name-letter"
          style={{ animationDelay: `${0.18 + i * 0.048}s` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}

// ── Typewriter
function TypewriterSubtitle() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing");
  const charRef = useRef(0);

  useEffect(() => {
    const target = ROLES[roleIndex];
    if (phase === "typing") {
      if (charRef.current < target.length) {
        const timer = setTimeout(() => {
          charRef.current += 1;
          setDisplayed(target.slice(0, charRef.current));
        }, 52);
        return () => clearTimeout(timer);
      }
      const timer = setTimeout(() => setPhase("erasing"), 1900);
      return () => clearTimeout(timer);
    }
    if (phase === "erasing") {
      if (charRef.current > 0) {
        const timer = setTimeout(() => {
          charRef.current -= 1;
          setDisplayed(target.slice(0, charRef.current));
        }, 26);
        return () => clearTimeout(timer);
      }
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
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

// ── Scroll reveal hook
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", delay = "" }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${delay} ${className}`.trim()}>
      {children}
    </div>
  );
}

// ── Project card
function ProjectCard({ project }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article
      className={`project-item${expanded ? " expanded" : ""}`}
      onClick={() => setExpanded((p) => !p)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && setExpanded((p) => !p)}
    >
      <div className="project-meta">
        <span>{project.period}</span>
        <span>{project.subtitle}</span>
      </div>
      <h3>{project.title}</h3>
      <p className="project-summary-text">{project.summary}</p>

      <div className="project-expand">
        <p className="project-detail-text">{project.details}</p>
        <div className="project-tools">
          {project.tools.map((tool) => (
            <span className="tool-tag" key={tool}>{tool}</span>
          ))}
        </div>
      </div>

      {!expanded && (
        <div className="project-tools-always">
          {project.tools.slice(0, 3).map((tool) => (
            <span className="tool-tag" key={tool}>{tool}</span>
          ))}
          {project.tools.length > 3 && (
            <span className="tool-tag">+{project.tools.length - 3}</span>
          )}
        </div>
      )}

      <div className="expand-hint">
        <span>↓</span> click to expand
      </div>
    </article>
  );
}

// ── Contact form
const EMPTY_FORM = { name: "", email: "", message: "" };
const EMPTY_ERRORS = { name: "", email: "", message: "" };

function ContactForm() {
  const [fields, setFields] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  function validate() {
    const errs = { name: "", email: "", message: "" };
    let valid = true;
    if (!fields.name.trim()) { errs.name = "Name is required."; valid = false; }
    if (!fields.email.trim()) {
      errs.email = "Email is required."; valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errs.email = "Please enter a valid email."; valid = false;
    }
    if (!fields.message.trim()) { errs.message = "Message is required."; valid = false; }
    else if (fields.message.trim().length < 10) { errs.message = "Message is too short."; valid = false; }
    setErrors(errs);
    return valid;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");

    // ── mailto fallback (works immediately without a backend)
    // To connect Formspree: replace body below with a fetch to https://formspree.io/f/YOUR_ID
    // To connect EmailJS: use emailjs.send(serviceId, templateId, fields)
    const subject = encodeURIComponent(`Portfolio message from ${fields.name}`);
    const body = encodeURIComponent(
      `Name: ${fields.name}\nEmail: ${fields.email}\n\n${fields.message}`
    );
    window.location.href = `mailto:Klairprince619@gmail.com?subject=${subject}&body=${body}`;

    // Optimistic success state after brief delay
    setTimeout(() => {
      setStatus("success");
      setFields(EMPTY_FORM);
      setErrors(EMPTY_ERRORS);
    }, 600);
  }

  const statusLabel = {
    idle: "",
    sending: "Opening mail client…",
    success: "✓ Message ready to send.",
    error: "Something went wrong. Try again.",
  }[status];

  const statusClass = {
    idle: "",
    sending: "sending",
    success: "success",
    error: "error-state",
  }[status];

  return (
    <div className="contact-form-card">
      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="cf-name">Name</label>
          <input
            id="cf-name"
            name="name"
            className={`form-input${errors.name ? " field-error" : ""}`}
            placeholder="Your name"
            value={fields.name}
            onChange={handleChange}
            autoComplete="name"
          />
          {errors.name && <span className="form-error-msg">{errors.name}</span>}
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            name="email"
            type="email"
            className={`form-input${errors.email ? " field-error" : ""}`}
            placeholder="you@example.com"
            value={fields.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && <span className="form-error-msg">{errors.email}</span>}
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="cf-message">Message</label>
        <textarea
          id="cf-message"
          name="message"
          className={`form-textarea${errors.message ? " field-error" : ""}`}
          placeholder="What's on your mind?"
          value={fields.message}
          onChange={handleChange}
        />
        {errors.message && <span className="form-error-msg">{errors.message}</span>}
      </div>

      <div className="form-footer">
        <span className={`form-status ${statusClass}`}>{statusLabel}</span>
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Send Message →"}
        </button>
      </div>
    </div>
  );
}

// ── App
function App() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="page">
      {/* NAVBAR */}
      <nav className={`navbar${navScrolled ? " navbar-scrolled" : ""}`}>
        <a href="#home" className="brand">
          Prince <span>Klair</span>
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="hero section">
        <div className="hero-copy">
          <p className="eyebrow">Computer Science · University at Buffalo</p>
          <AnimatedName name="Prince Klair" />
          <TypewriterSubtitle />
          <p className="hero-summary secondary">
          “The people who succeed aren’t the ones who avoid failure, they’re the ones who run out of ways to fail.”
          </p>
          <div className="hero-actions">
            <a href="#projects" className="button primary">View Projects</a>
            <a
              href="https://github.com/PrinceKlair619"
              target="_blank"
              rel="noreferrer"
              className="button secondary"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/prince-k1"
              target="_blank"
              rel="noreferrer"
              className="button secondary"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-panel-label">Overview</div>
          <ul>
            <li>Pursuing Masters in Artificial Intelligence</li>
            <li>B.S. in Computer Science, University at Buffalo</li>
            <li>Expected graduation: May 2026</li>
            <li>Experience across web, systems, game dev, and data</li>
            <li>Interested in clean products with real-world impact</li>
          </ul>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section">
        <Reveal>
          <div className="section-header">
            <p className="section-kicker">About</p>
          </div>
        </Reveal>
        <div className="about-grid">
          <Reveal className="slide-left">
            <div className="about-card accent-card">
              <div className="initial-badge">PK</div>
            </div>
          </Reveal>
          <div className="about-text">
            <Reveal delay="reveal-delay-1">
              <p>
              I’m a Computer Science student at the University at Buffalo focused on building software that is both technically strong and thoughtfully designed. My experience spans full-stack applications, backend systems, data visualization, socket-based networking, and game development. Across different projects, I’ve worked on turning ideas into products that are functional, polished, and built with attention to both technical quality and user experience.
              </p>
            </Reveal>
            <Reveal delay="reveal-delay-2">
              <p>
              I enjoy taking projects from idea to implementation and making sure they feel complete from both an engineering and design perspective. I care a lot about structure, debugging, maintainability, and building systems that are reliable over time, not just quick demos that work once. I like solving problems step by step, improving details that make software smoother to use, and creating work that feels intentional, stable, and well put together.
              </p>
            </Reveal>
            <Reveal delay="reveal-delay-3">
              <p>
              Outside of tech, I have a big passion for traveling, automobiles, and anything adrenaline-filled. I’ve always been drawn to experiences that feel intense, fast, and memorable, whether that’s driving, riding, or exploring somewhere completely new. One of my long-term goals is to visit every country in the world, and I’ve already been able to check off a large portion of my bucket list through different trips and experiences.

There are still a few things I’m chasing, like doing an airplane wing walk, going on a hot air balloon ride, and one day attempting something as extreme as climbing Mount Everest. I like pushing myself into new environments and situations, and that mindset carries into how I approach my work too. I enjoy building things that feel exciting, intentional, and worth remembering.
              </p>
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

      {/* PROJECTS */}
      <section id="projects" className="section">
        <Reveal>
          <div className="section-header">
            <p className="section-kicker">Projects</p>
            <p className="section-note">
              A few projects that show how I build across full-stack, systems,
              data, and game development. Click any card to expand details.
            </p>
          </div>
        </Reveal>
        <div className="projects-grid">
          {PROJECTS.map((project, i) => (
            <Reveal
              key={project.id}
              delay={i % 2 === 0 ? "reveal-delay-1" : "reveal-delay-2"}
            >
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section">
        <Reveal>
          <div className="section-header">
            <p className="section-kicker">Experience</p>
          </div>
        </Reveal>
        <div className="experience-list">
          {EXPERIENCE.map((job, i) => (
            <Reveal key={job.title + job.company} delay={`reveal-delay-${i + 1}`}>
              <article className="experience-item">
                <div className="experience-top">
                  <div>
                    <h3>{job.title}</h3>
                    <p className="experience-company">{job.company}</p>
                  </div>
                  <span className="experience-period">{job.period}</span>
                </div>
                <ul>
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section">
        <Reveal>
          <div className="section-header">
            <p className="section-kicker">Technical Skills</p>
          </div>
        </Reveal>
        <div className="skills-grid">
          {Object.entries(SKILLS).map(([group, items], i) => (
            <Reveal key={group} delay={`reveal-delay-${(i % 4) + 1}`}>
              <div className="skill-group">
                <h3>{group}</h3>
                <div className="skill-tags">
                  {items.map((item) => (
                    <span className="skill-tag" key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <Reveal>
          <div className="section-header">
            <p className="section-kicker">Contact</p>
            <h2>Let's Connect</h2>
            <p className="section-note">
              Open to internships, collaborations, and interesting software
              opportunities. Drop a message or reach out directly. Whether you have a role in mind, a project to collaborate on,
              or just want to say hello — I'm always happy to hear from you.
            </p>
          </div>
        </Reveal>

        <div className="contact-layout">
          <Reveal className="slide-left">
            <div className="contact-info">
              <div className="contact-links-list">
                <a href="mailto:Klairprince619@gmail.com" className="contact-link">
                  <span className="contact-link-icon">@</span>
                  Klairprince619@gmail.com
                </a>
                <a
                  href="https://linkedin.com/in/prince-k1"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link"
                >
                  <span className="contact-link-icon">in</span>
                  linkedin.com/in/prince-k1
                </a>
                <a
                  href="https://github.com/PrinceKlair619"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link"
                >
                  <span className="contact-link-icon">gh</span>
                  github.com/PrinceKlair619
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay="reveal-delay-2">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <span>© 2025 Prince Klair</span>
        <span>Built with React · University at Buffalo</span>
      </footer>
    </div>
  );
}

export default App;
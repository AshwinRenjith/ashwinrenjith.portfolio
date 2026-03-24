import { useState, useEffect, useRef, useCallback } from 'react'
import './index.css'
import Lenis from 'lenis'

/* ═══════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════ */

const META = [
  { label: 'Location', value: 'Nagpur, India' },
  { label: 'Current', value: 'Founder & CEO, fynq' },
  { label: 'Studying', value: 'B.Tech AI, SVPCET' },
  { label: 'Projects', value: '60+' },
  { label: 'Age', value: '21' },
]

const VENTURES = [
  { year: '2023', name: 'fenishop', desc: 'Bought groceries and stationery wholesale. Sold to hostel students. ₹50K first week.', tag: 'DORM-ROOM COMMERCE' },
  { year: '2024', name: 'Founders Agency', desc: 'Marketing & growth for local businesses. First client pitched at their doorstep.', tag: 'SERVICES' },
  { year: '2025', name: 'Carrodo', desc: 'Peer-to-peer vehicle rental. Real demand. Regulatory wall. Lessons learned.', tag: 'MOBILITY' },
  { year: '2025', name: 'GTMVP Inc.', desc: 'AI/ML Ops for a US startup. Built automations, audited systems, shipped fixes.', tag: 'PROFESSIONAL' },
  { year: '2025', name: 'Unibookmark', desc: 'AI-powered personal knowledge tool. The insight that led directly to fynq.', tag: 'AI PRODUCT' },
  { year: 'NOW', name: 'fynqAI', desc: 'Enterprise AI knowledge system. Accurate answers and actions across internal data.', tag: 'CURRENT VENTURE' },
]

const PROJECTS = [
  { num: '01', title: 'KaramLLM', classification: 'Neural Architecture', why: 'I wanted to prove you could train a real language model on a MacBook Air. So I designed one from scratch — 70M parameters, modular experts, fractal routing.', url: 'https://github.com/AshwinRenjith/karamLLM', color: 'rgba(0, 245, 212, 0.06)' },
  { num: '02', title: 'MemoryOS', classification: 'Agentic Infrastructure', why: 'AI models forget everything between sessions. I\'m building the version-control system that gives them permanent, auditable, cryptographically signed memory.', url: '#', color: 'rgba(124, 58, 237, 0.06)' },
  { num: '03', title: 'GridBee', classification: 'Decentralized Compute', why: 'Training AI costs millions in GPU time. GridBee turns idle consumer laptops into a distributed training cluster using a torus mesh topology.', url: 'https://github.com/AshwinRenjith/fynq.gridbee', color: 'rgba(255, 165, 0, 0.06)' },
  { num: '04', title: 'DH-MoE', classification: 'Mixture of Experts', why: 'A custom architecture that reduces compute cost by dynamically spawning specialized expert models only when needed. Full PyTorch pipeline.', url: 'https://github.com/AshwinRenjith/DH-MoE', color: 'rgba(0, 200, 255, 0.06)' },
  { num: '05', title: 'UltraGravity', classification: 'Autonomous Agent', why: 'A macOS AI agent that watches your screen, understands intent, and executes multi-step web tasks automatically using LLMs and Playwright.', url: 'https://github.com/AshwinRenjith/ultragravity', color: 'rgba(255, 51, 0, 0.04)' },
  { num: '06', title: 'SweepR', classification: 'Knowledge Quality', why: 'The silent immune system for enterprise RAG. Scans knowledge bases for contradictions before the chatbot hallucinates them.', url: '#', color: 'rgba(0, 245, 212, 0.05)' },
  { num: '07', title: 'Aura', classification: 'Luxury AI Engine', why: 'Multi-tenant AI for the luxury jewelry sector. Python microservices, Supabase, BullMQ orchestration.', url: '#', color: 'rgba(212, 175, 55, 0.05)' },
  { num: '08', title: 'Metalink', classification: 'Campus Platform', why: 'Full-stack Next.js + Supabase. Student PWA, admin dashboard, real-time ordering, role-based access.', url: 'https://github.com/AshwinRenjith/Metalink', color: 'rgba(124, 58, 237, 0.05)' },
]

const SKILLS = [
  'Python', 'TypeScript', 'React', 'Next.js', 'Rust', 'Go',
  'PyTorch', 'Supabase', 'PostgreSQL', 'pgvector', 'Redis',
  'FastAPI', 'Docker', 'n8n', 'LLM Architecture', 'DePIN',
  'Agentic Orchestration', 'Event-Sourced Systems',
  'Cryptographic Signing', 'Computer Vision', 'Playwright',
]

const CONTACTS = [
  { type: 'Mail', value: 'ashwinrenjith.co.in@gmail.com', href: 'mailto:ashwinrenjith.co.in@gmail.com' },
  { type: 'GitHub', value: 'github.com/AshwinRenjith', href: 'https://github.com/AshwinRenjith' },
  { type: 'LinkedIn', value: 'linkedin.com/in/ashwin-renjith', href: 'https://www.linkedin.com/in/ashwin-renjith-629024220/' },
  { type: 'Twitter', value: 'x.com/JamesZacheria', href: 'https://x.com/JamesZacheria' },
]

const RECOGNITION = [
  { text: '2nd Place · Startup Pitching Competition · 1st Year', tag: 'AWARD' },
  { text: 'IEDC Member · Helped organise eXpo with TiE Nagpur', tag: 'COMMUNITY' },
  { text: 'Selected · IDE Bootcamp · MoE × AICTE × Wadhwani Foundation', tag: 'GOVT. PROGRAM' },
]

/* ═══════════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════════ */

function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          obs.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}

function useStaggerReveal(threshold = 0.1) {
  const ref = useRef(null)
  useEffect(() => {
    const container = ref.current
    if (!container) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const children = container.querySelectorAll('[data-stagger]')
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('revealed'), i * 80)
          })
          obs.unobserve(container)
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(container)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}

function useCounter(target, duration = 1600) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const numTarget = parseInt(target, 10) || 0

          function tick(now) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * numTarget))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          obs.unobserve(el)
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])

  return { ref, count }
}

/* Scroll progress hook for Stage Curtain transitions */
function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    function onScroll() {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // progress goes from 0 (element at bottom of viewport) to 1 (element scrolled past top)
      const p = Math.max(0, Math.min(1, 1 - (rect.bottom / (rect.height + vh))))
      setProgress(p)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [ref])
  return progress
}

/* ═══════════════════════════════════════════════════════════════════
   MAGNETIC CURSOR — Global custom cursor with magnetic interactions
   (Fantasy.co + Zhenya Rynzhuk)
   ═══════════════════════════════════════════════════════════════════ */

function MagneticCursor() {
  const dotRef = useRef(null)
  const textRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const expanded = useRef(false)
  const cursorText = useRef('')

  useEffect(() => {
    // Only show on non-touch devices
    if ('ontouchstart' in window) return

    const dot = dotRef.current
    const text = textRef.current
    if (!dot) return

    document.body.style.cursor = 'none'

    function onMove(e) {
      target.current.x = e.clientX
      target.current.y = e.clientY
    }

    function loop() {
      // Lerp smoothing
      pos.current.x += (target.current.x - pos.current.x) * 0.12
      pos.current.y += (target.current.y - pos.current.y) * 0.12
      dot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`
      requestAnimationFrame(loop)
    }

    function onEnterInteractive(e) {
      expanded.current = true
      dot.classList.add('cursor--expanded')
      const label = e.target.closest('[data-cursor-text]')
      if (label && text) {
        text.textContent = label.dataset.cursorText
      }
    }

    function onLeaveInteractive() {
      expanded.current = false
      dot.classList.remove('cursor--expanded')
      if (text) text.textContent = ''
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    requestAnimationFrame(loop)

    // Observe interactive elements
    const interactives = document.querySelectorAll('a, button, .project-row, .contact__link, .ventures__card')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnterInteractive)
      el.addEventListener('mouseleave', onLeaveInteractive)
    })

    // Re-observe when DOM changes (for dynamic content)
    const mutObs = new MutationObserver(() => {
      const newInteractives = document.querySelectorAll('a, button, .project-row, .contact__link, .ventures__card')
      newInteractives.forEach(el => {
        el.removeEventListener('mouseenter', onEnterInteractive)
        el.removeEventListener('mouseleave', onLeaveInteractive)
        el.addEventListener('mouseenter', onEnterInteractive)
        el.addEventListener('mouseleave', onLeaveInteractive)
      })
    })
    mutObs.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.body.style.cursor = ''
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onEnterInteractive)
        el.removeEventListener('mouseleave', onLeaveInteractive)
      })
      mutObs.disconnect()
    }
  }, [])

  return (
    <div className="custom-cursor" ref={dotRef}>
      <span className="custom-cursor__text" ref={textRef}></span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   HERO CURSOR MASK — Organic blob reveal on hero
   (Zhenya Cloud Masking — reveals void beneath cream)
   ═══════════════════════════════════════════════════════════════════ */

function HeroCursorMask() {
  const maskRef = useRef(null)
  const posRef = useRef({ x: -200, y: -200 })
  const targetRef = useRef({ x: -200, y: -200 })

  useEffect(() => {
    if ('ontouchstart' in window) return
    const el = maskRef.current
    if (!el) return

    function onMove(e) {
      const rect = el.parentElement.getBoundingClientRect()
      targetRef.current.x = e.clientX - rect.left
      targetRef.current.y = e.clientY - rect.top
    }

    function loop() {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.08
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.08
      el.style.setProperty('--mask-x', `${posRef.current.x}px`)
      el.style.setProperty('--mask-y', `${posRef.current.y}px`)
      requestAnimationFrame(loop)
    }

    const parent = el.parentElement
    parent.addEventListener('mousemove', onMove, { passive: true })
    parent.addEventListener('mouseenter', () => el.classList.add('active'))
    parent.addEventListener('mouseleave', () => {
      el.classList.remove('active')
      targetRef.current = { x: -200, y: -200 }
    })
    requestAnimationFrame(loop)

    return () => {
      parent.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div className="hero__mask-layer" ref={maskRef}>
      <div className="hero__mask-blob blob--plasma" />
      <div className="hero__mask-blob blob--violet" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

function Preloader({ onDone }) {
  const [text, setText] = useState('')
  const fullText = '// initializing ashwin_renjith.system ...'

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setText(fullText.slice(0, i + 1))
      i++
      if (i >= fullText.length) {
        clearInterval(interval)
        setTimeout(onDone, 600)
      }
    }, 35)
    return () => clearInterval(interval)
  }, [onDone])

  return (
    <div className="preloader__text">
      {text}
      <span className="cursor" />
    </div>
  )
}

/* HERO — with Stage Curtain scroll transition + organic cursor mask */
function Hero() {
  const labelRef = useReveal(0.3)
  const headlineRef = useReveal(0.2)
  const subRef = useReveal(0.2)
  const metaRef = useReveal(0.2)
  const sectionRef = useRef(null)
  const scrollProgress = useScrollProgress(sectionRef)

  // Stage curtain: scale and radius as user scrolls down
  const scale = Math.max(0.92, 1 - scrollProgress * 0.08)
  const radius = Math.min(32, scrollProgress * 32)

  return (
    <section
      className="hero"
      id="hero"
      ref={sectionRef}
      style={{
        transform: `scale(${scale})`,
        borderRadius: `${radius}px`,
        willChange: 'transform, border-radius',
      }}
    >
      {/* Organic cursor mask — reveals void beneath cream */}
      <HeroCursorMask />

      <div className="hero__label" ref={labelRef}>
        <span>FOUNDER · ARCHITECT · 21</span>
      </div>

      <div className="hero__headline" ref={headlineRef}>
        <span className="hero__headline-line"><span>I build things</span></span>
        <span className="hero__headline-line"><span>that shouldn't exist yet.</span></span>
      </div>

      <p className="hero__sub" ref={subRef}>
        My name is Ashwin Renjith. I'm 21 years old, currently in my B.Tech, and I've shipped
        over 60 projects — from a dorm-room grocery operation that did ₹50K in its first week,
        to custom language models I trained on a MacBook Air.
      </p>

      <div className="hero__meta" ref={metaRef}>
        {META.map(m => (
          <div className="hero__meta-item" key={m.label}>
            <span className="hero__meta-label">{m.label}</span>
            <span className="hero__meta-value">{m.value}</span>
          </div>
        ))}
      </div>

      <div className="hero__scroll-cue">
        <span>Scroll</span>
        <div className="line" />
      </div>
    </section>
  )
}

/* ORIGIN — with parallax drift and individual word animations */
function OriginStory() {
  const s1 = useReveal(0.2)
  const s2 = useReveal(0.2)
  const s2b = useReveal(0.2)
  const s3 = useReveal(0.2)
  const sectionRef = useRef(null)

  // Parallax for ambient blobs
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const blobs = section.querySelectorAll('.ambient-blob')

    function onScroll() {
      const rect = section.getBoundingClientRect()
      const progress = -rect.top / rect.height
      blobs.forEach((blob, i) => {
        const speed = (i + 1) * 40
        blob.style.transform = `translateY(${progress * speed}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="origin" ref={sectionRef}>
      {/* Ambient blobs with parallax */}
      <div className="ambient-blob blob--plasma" style={{ width: '60vw', height: '60vw', top: '5%', left: '-15%' }} />
      <div className="ambient-blob blob--violet" style={{ width: '45vw', height: '45vw', top: '40%', right: '-10%' }} />
      <div className="ambient-blob blob--ember" style={{ width: '30vw', height: '30vw', bottom: '10%', left: '20%' }} />

      <div className="origin__screen">
        <div ref={s1} data-reveal="drift-left">
          <p className="origin__headline">
            I didn't come from startups.<br />
            I didn't come from tech money.<br />
            I came from a small town in Kerala,<br />
            moved to Nagpur for college,<br />
            and knew almost nothing.
          </p>
        </div>
      </div>

      <div className="origin__screen">
        <div ref={s2} data-reveal="drift-right">
          <h2 className="origin__headline origin__headline--large">
            First year of college.<br />
            Students couldn't buy basic stationery<br />
            without travelling 17 kilometers.
          </h2>
        </div>
        <div ref={s2b} data-reveal style={{ transitionDelay: '300ms' }}>
          <p className="origin__body">
            So I opened a dark store inside my dorm room. Bought wholesale. Delivered in 5 minutes.
            Told the hostel authorities it was for personal use. ₹50,000 in the first week.
          </p>
        </div>
      </div>

      <div className="origin__screen">
        <div ref={s3} data-reveal="scale-in">
          <h2 className="origin__headline origin__headline--large">
            That was the moment I understood:<br />
            I don't wait for permission.<br />
            I <span className="highlight">build.</span>
          </h2>
        </div>
      </div>
    </section>
  )
}

/* VENTURES — with connecting line and arrow indicators */
function VenturesTimeline() {
  const listRef = useStaggerReveal(0.1)
  const labelRef = useReveal(0.3)

  return (
    <section className="ventures">
      <div ref={labelRef} data-reveal>
        <p className="ventures__label">// THE JOURNEY</p>
        <h3 className="ventures__heading">Since then, I haven't stopped.</h3>
      </div>
      <div className="ventures__track" ref={listRef}>
        {VENTURES.map((v) => (
          <div className="ventures__card" key={v.name} data-stagger data-reveal data-cursor-text="VIEW">
            <span className="ventures__card-year">{v.year}</span>
            <h3 className="ventures__card-name">{v.name}</h3>
            <p className="ventures__card-desc">{v.desc}</p>
            <span className="ventures__card-tag">{v.tag}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* SYSTEMS INDEX — with hover background gradient reveals */
function SystemsIndex() {
  const headerRef = useReveal(0.2)
  const listRef = useStaggerReveal(0.05)
  const [hoveredProject, setHoveredProject] = useState(null)
  const bgRef = useRef(null)

  return (
    <section className="systems" id="work">
      {/* Background gradient that changes per hovered project */}
      <div
        className={`systems__bg-reveal ${hoveredProject ? 'active' : ''}`}
        ref={bgRef}
        style={{
          background: hoveredProject
            ? `radial-gradient(ellipse at 50% 50%, ${hoveredProject} 0%, transparent 70%)`
            : 'none'
        }}
      />

      <div className="systems__header" ref={headerRef} data-reveal>
        <h2 className="systems__title">Work</h2>
        <p className="systems__count">60+ projects · 30 public · 30+ private</p>
      </div>

      <ul className="systems__list" ref={listRef}>
        {PROJECTS.map(p => (
          <li key={p.num} data-stagger data-reveal>
            <a
              className="project-row"
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-text="VIEW"
              onMouseEnter={() => setHoveredProject(p.color)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <span className="project-row__num">{p.num}</span>
              <div className="project-row__content">
                <span className="project-row__title">{p.title}</span>
                <span className="project-row__why">{p.why}</span>
              </div>
              <span className="project-row__class">{p.classification}</span>
              <span className="project-row__arrow">→</span>
            </a>
          </li>
        ))}
      </ul>

      <a className="systems__github" href="https://github.com/AshwinRenjith" target="_blank" rel="noopener noreferrer" data-cursor-text="OPEN">
        + 50 more projects on GitHub <span>→</span>
      </a>
    </section>
  )
}

/* ABOUT — Stage Curtain from void → cream + all sub-components */
function AboutSection() {
  const labelRef = useReveal(0.3)
  const titleRef = useReveal(0.2)
  const bioRef = useReveal(0.15)
  const statsRef = useStaggerReveal(0.2)
  const recRef = useStaggerReveal(0.15)

  const stat1 = useCounter('60', 1600)
  const stat2 = useCounter('6', 1200)
  const stat3 = useCounter('21', 1400)

  return (
    <section className="about" id="about">
      <div ref={labelRef} data-reveal>
        <p className="about__label">// About</p>
      </div>

      <div ref={titleRef} data-reveal>
        <h2 className="about__title">The person behind<br />the systems.</h2>
      </div>

      <div className="about__grid" ref={bioRef} data-reveal>
        <div className="about__bio">
          <p>
            I'm Ashwin Renjith. I'm 21, based in Nagpur, India, and I'm currently finishing my
            B.Tech in Artificial Intelligence at St. Vincent Pallotti College of Engineering.
          </p>
          <p>
            But college has never been the main thing. Since my first year, I've been building —
            startups, products, systems. I started with a dorm-room grocery operation, moved to
            running a marketing agency, tried a mobility startup that hit regulatory walls, and
            eventually found my way to AI infrastructure.
          </p>
          <p>
            Today, I lead <strong>fynq</strong> — an AI knowledge system for businesses that helps
            teams get accurate answers and take action across internal documents, data, and workflows.
          </p>
        </div>
        <div className="about__bio">
          <p>
            On the engineering side, I've designed and trained a custom
            70M-parameter language model on a MacBook Air, built decentralized compute networks,
            created autonomous desktop agents, and architected memory infrastructure for AI systems.
          </p>
          <p>
            I don't have prestigious competition wins or published papers. What I have is
            60+ shipped projects, revenue from my first week of my first startup, and the kind of
            conviction that comes from learning everything the hard way.
          </p>
        </div>
      </div>

      {/* Skill Marquee */}
      <div className="marquee">
        <div className="marquee__inner">
          {[...SKILLS, ...SKILLS].map((s, i) => (
            <span className="marquee__item" key={i}>{s}</span>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="about__stats" ref={statsRef}>
        <div className="stat-card" data-stagger data-reveal ref={stat1.ref}>
          <div className="stat-card__number">{stat1.count}+</div>
          <div className="stat-card__label">Projects Shipped</div>
        </div>
        <div className="stat-card" data-stagger data-reveal ref={stat2.ref}>
          <div className="stat-card__number">{stat2.count}</div>
          <div className="stat-card__label">Ventures Founded</div>
        </div>
        <div className="stat-card" data-stagger data-reveal ref={stat3.ref}>
          <div className="stat-card__number">{stat3.count}</div>
          <div className="stat-card__label">Years Old</div>
        </div>
      </div>

      {/* Recognition */}
      <div className="about__recognition" ref={recRef}>
        {RECOGNITION.map((r, i) => (
          <div className="recognition-item" key={i} data-stagger data-reveal>
            <span>{r.text}</span>
            <span className="recognition-item__tag">{r.tag}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Conviction() {
  const textRef = useReveal(0.3)
  const subRef = useReveal(0.3)

  return (
    <section className="conviction">
      <div className="ambient-blob blob--plasma" style={{ width: '50vw', height: '50vw', top: '20%', left: '25%', opacity: 0.3 }} />
      <div ref={textRef} data-reveal>
        <p className="conviction__text">
          "I came into college knowing<br />
          almost nothing about startups<br />
          or entrepreneurship.<br /><br />
          Everything I know,<br />
          I learned by <em>building</em>,<br />
          failing, iterating,<br />
          and starting again."
        </p>
      </div>
      <div ref={subRef} data-reveal style={{ transitionDelay: '300ms' }}>
        <p className="conviction__sub">That process has been my real education.</p>
      </div>
    </section>
  )
}

function Contact() {
  const headRef = useReveal(0.2)
  const subRef = useReveal(0.2)
  const linksRef = useStaggerReveal(0.1)

  return (
    <section className="contact" id="contact">
      {/* Ambient wireframe globe effect */}
      <div className="contact__globe" />

      <div ref={headRef} data-reveal>
        <h2 className="contact__headline glowing">Let's build.</h2>
      </div>
      <div ref={subRef} data-reveal style={{ transitionDelay: '200ms' }}>
        <p className="contact__sub">
          I'm currently building fynq — an AI knowledge system for businesses.
          If you're working on something ambitious, I want to hear about it.
        </p>
      </div>
      <ul className="contact__links" ref={linksRef}>
        {CONTACTS.map(c => (
          <li key={c.type} data-stagger data-reveal>
            <a className="contact__link" href={c.href} target="_blank" rel="noopener noreferrer" data-cursor-text="OPEN">
              <div className="contact__link-left">
                <span className="contact__link-type">{c.type}</span>
                <span className="contact__link-value">{c.value}</span>
              </div>
              <span className="contact__link-arrow">→</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Footer() {
  const ref = useReveal(0.5)
  return (
    <footer className="footer" ref={ref} data-reveal>
      <div className="footer__inner">
        <span className="footer__text">// ASHWIN RENJITH · NAGPUR, INDIA · 2026</span>
        <span className="footer__text">DESIGNED WITH LIQUID GLASS</span>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════════ */

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const onPreloaderDone = useCallback(() => setLoaded(true), [])

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return (
    <>
      {/* Custom magnetic cursor */}
      <MagneticCursor />

      {/* Preloader */}
      <div className={`preloader ${loaded ? 'done' : ''}`}>
        <Preloader onDone={onPreloaderDone} />
      </div>

      {/* Main Content */}
      <main>
        <Hero />
        <OriginStory />
        <VenturesTimeline />
        <SystemsIndex />
        <AboutSection />
        <Conviction />
        <Contact />
        <Footer />
      </main>
    </>
  )
}

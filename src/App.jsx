import { useEffect, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
import { disciplines, projects, statistics } from "./content.js";
import VantaBackdrop from "./components/VantaBackdrop.jsx";
import FounderSphere from "./components/FounderSphere.jsx";
import useMotion from "./hooks/useMotion.js";

const navItems = [
  ["Studio", "#about"],
  ["Works", "#gallery"],
  ["Disciplines", "#disciplines"],
  ["Founders", "#founders"],
];

function BrandMark() {
  return (
    <a className="brand" href="#top" aria-label="Pinnacle Design Studio home">
      <svg className="brand__symbol" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M4 29 18 6l9 15 5-8 5 8M4 29h13M20 29h17" />
        <path d="m17 29 7-12 8 12" />
      </svg>
      <span className="brand__wordmark">
        <span>PINNACLE</span>
        <small>DESIGN STUDIO</small>
      </span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <BrandMark />
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav
          id="primary-navigation"
          className={`site-nav${open ? " site-nav--open" : ""}`}
          aria-label="Primary navigation"
        >
          {navItems.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-index" href="#founders" aria-label="Meet the founders">
          <span className="header-index__dot" />
          <span>EST. 2023</span>
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <VantaBackdrop />
      <div className="hero__grid-line hero__grid-line--vertical" aria-hidden="true" />
      <div className="hero__grid-line hero__grid-line--horizontal" aria-hidden="true" />
      <div className="hero__inner page-wrap">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">
            <span className="eyebrow__rule" />
            Bespoke Interior Architectures
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__title-line">YOUR DREAM,</span>
            <span className="hero__title-line hero__title-line--accent">OUR CANVAS.</span>
          </h1>
          <p className="hero__description">
            Pinnacle Design Studio crafts luxury residential interiors blending strict geometric harmony with organic warmth. We translate client lifestyles into timeless architectural sanctuaries.
          </p>
          <div className="hero__actions">
            <a className="button button--gold" href="#gallery">
              Explore Works <ArrowDownRight size={17} strokeWidth={1.6} />
            </a>
            <a className="button button--text" href="#about">
              The Studio <ArrowRight size={16} strokeWidth={1.5} />
            </a>
          </div>
          <div className="hero__note" aria-hidden="true">
            <span className="hero__note-line" />
            <span>01 / 03</span>
          </div>
        </div>

        <a className="hero-art" href="#gallery" aria-label="Explore Geometric Residential Lounge" data-cursor="EXPLORE">
          <div className="hero-art__frame">
            <img
              src={projects[0].image}
              alt={projects[0].alt}
              fetchPriority="high"
            />
            <span className="hero-art__topline" aria-hidden="true" />
            <span className="hero-art__corner hero-art__corner--tl" aria-hidden="true" />
            <span className="hero-art__corner hero-art__corner--br" aria-hidden="true" />
            <div className="hero-art__caption">
              <span>Featured Render</span>
              <strong>Geometric Residential Lounge</strong>
            </div>
          </div>
          <span className="hero-art__index" aria-hidden="true">P / 01</span>
        </a>
      </div>
      <div className="hero__bottom page-wrap">
        <span className="hero__scroll-cue"><span /> Scroll to explore</span>
        <span className="hero__bottom-label">Interior Architecture · Bespoke Design</span>
      </div>
      <div className="hero__glow" aria-hidden="true" />
    </section>
  );
}

function Stats() {
  return (
    <section className="stats page-wrap" aria-label="Studio highlights">
      {statistics.map(([value, label], index) => (
        <div className="stat" key={label}>
          <span className="stat__index">0{index + 1}</span>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}

function SectionLabel({ children, number }) {
  return (
    <div className="section-label">
      <span className="section-label__line" />
      <span>{children}</span>
      {number && <span className="section-label__number">{number}</span>}
    </div>
  );
}

function Philosophy() {
  return (
    <section className="philosophy section-pad" id="about" aria-labelledby="philosophy-title">
      <div className="page-wrap philosophy__layout">
        <div className="philosophy__visual reveal">
          <div className="philosophy__image-wrap">
            <img
              src="/images/partition-D-xaQNPb.jpg"
              alt="Architectural wood panel design with a transparent spatial divider"
              loading="lazy"
            />
            <span className="philosophy__image-number">P—03</span>
          </div>
          <div className="philosophy__image-caption">
            <span>Material study</span>
            <span>Walnut · Bronzed steel · Glass</span>
          </div>
          <span className="philosophy__corner" aria-hidden="true" />
        </div>
        <div className="philosophy__content reveal">
          <SectionLabel number="01">Our Core Philosophy</SectionLabel>
          <h2 id="philosophy-title">Sophisticated Spaces Defined by <em>Pure Geometry</em></h2>
          <p className="philosophy__lead">
            At Pinnacle, we look at design through the lens of architectural geometry. Our signature lies in balancing rich, tactile materials like brushed American Walnut and high-contrast terrazzo tiles with modern structural metals. Every line has a purpose; every divider, shelf, and ceiling recess is calculated to direct flow and focus.
          </p>
          <p className="philosophy__body">
            We specialize in custom interior layouts, spatial dividers, architectural ceilings, integrated hosting setups, and curated furniture designs. By engineering every detail in-house, we deliver highly bespoke spaces that feel unified, premium, and built for permanent quality.
          </p>
          <div className="philosophy__qualities">
            <div className="quality">
              <span className="quality__mark" aria-hidden="true">01</span>
              <div>
                <h3>Tailored Craftsmanship</h3>
                <p>Each piece of furniture and partition panel is custom fabricated by master joiners.</p>
              </div>
            </div>
            <div className="quality">
              <span className="quality__mark" aria-hidden="true">02</span>
              <div>
                <h3>Curated Materials</h3>
                <p>We source premium marble, select timbers, and handcrafted glass elements globally.</p>
              </div>
            </div>
          </div>
          <a className="text-link" href="#gallery">Explore the work <ArrowRight size={16} /></a>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, onOpen }) {
  return (
    <button
      className="portfolio-panel"
      type="button"
      onClick={() => onOpen(project)}
      data-cursor="VIEW"
      aria-label={`Open project details: ${project.title}`}
      aria-haspopup="dialog"
    >
      <span className="portfolio-panel__image">
        <img src={project.image} alt={project.alt} loading="lazy" />
        <span className="portfolio-panel__index">{project.number} <i /> {project.subtitle}</span>
        <span className="portfolio-panel__image-title">{project.title}</span>
        <span className="portfolio-panel__frame" aria-hidden="true" />
      </span>
      <span className="portfolio-panel__copy">
        <span className="portfolio-panel__eyebrow">{project.subtitle}</span>
        <span className="portfolio-panel__title">{project.title}</span>
        <span className="portfolio-panel__description">{project.description}</span>
        <span className="portfolio-panel__spec">
          <span>{project.specs[0][0]}</span>
          <b>{project.specs[0][1]}</b>
        </span>
        <span className="portfolio-panel__action">
          Explore project details <ArrowUpRight size={18} strokeWidth={1.5} />
        </span>
      </span>
    </button>
  );
}

function ProjectDialog({ project, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  if (!project) return null;

  return (
    <dialog
      ref={dialogRef}
      className="project-dialog"
      aria-labelledby="project-dialog-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
    >
      <div className="project-dialog__inner">
        <button
          className="project-dialog__close"
          type="button"
          aria-label="Close project details"
          onClick={() => dialogRef.current?.close()}
        >
          <X size={20} />
        </button>
        <div className="project-dialog__image">
          <img src={project.image} alt={project.alt} />
          <span>{project.number} / Signature Masterpieces</span>
        </div>
        <div className="project-dialog__copy">
          <SectionLabel>{project.subtitle}</SectionLabel>
          <h2 id="project-dialog-title">{project.title}</h2>
          <p>{project.description}</p>
          <h3>Spatial Specifications</h3>
          <dl className="spec-list">
            {project.specs.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </dialog>
  );
}

function Portfolio() {
  const [selectedProject, setSelectedProject] = useState(null);
  return (
    <section className="portfolio portfolio--kinetic section-pad" id="gallery" aria-labelledby="portfolio-title">
      <div className="portfolio__stage">
        <div className="portfolio__head page-wrap reveal">
          <div>
            <SectionLabel number="02">Portfolio Highlights</SectionLabel>
            <h2 id="portfolio-title">Signature <em>Masterpieces</em></h2>
          </div>
          <p>
            Interactive 3D rendering cards displaying key zones of our latest architectural projects. Click on any card to view detailed blueprints and material specifications.
          </p>
        </div>
        <div className="portfolio__rail-label page-wrap" aria-hidden="true">
          <span>Scroll to move through the work</span>
          <span>Selected works / 2023—25</span>
        </div>
        <div className="portfolio__viewport">
          <div className="portfolio__track">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onOpen={setSelectedProject} />
            ))}
          </div>
        </div>
        <div className="portfolio__progress page-wrap" aria-hidden="true">
          <span className="portfolio__progress-current">01</span>
          <span className="portfolio__progress-track"><span className="portfolio__progress-fill" /></span>
          <span>03</span>
          <span className="portfolio__progress-label">Selected works</span>
        </div>
      </div>
      <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}

function Disciplines() {
  return (
    <section className="disciplines section-pad" id="disciplines" aria-labelledby="disciplines-title">
      <div className="page-wrap">
        <div className="disciplines__head reveal">
          <SectionLabel number="03">Our Core Disciplines</SectionLabel>
          <h2 id="disciplines-title">Crafting Architectural <em>Presence</em></h2>
          <p>We focus on three primary pillars of interior design to produce highly personalized and visually striking residential architectures.</p>
        </div>
        <div className="discipline-list">
          {disciplines.map((item) => (
            <article className="discipline reveal" key={item.number}>
              <span className="discipline__number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="discipline__arrow" aria-hidden="true"><ArrowUpRight size={20} /></span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Founders() {
  return (
    <section className="founders founders--orbital section-pad" id="founders" aria-labelledby="founders-title">
      <div className="founders__ambient" aria-hidden="true" />
      <div className="page-wrap founders__inner">
        <div className="founders__head reveal">
          <SectionLabel number="04">Our Founders</SectionLabel>
          <h2 id="founders-title">The Visionaries <em>Behind Pinnacle</em></h2>
        </div>
      </div>
      <FounderSphere />
    </section>
  );
}

function PointerLens() {
  return <div className="pointer-lens" aria-hidden="true"><span>VIEW</span></div>;
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-wrap site-footer__main">
        <BrandMark />
        <p>Creating spatial poetry, modern geometries, and elevated residential spaces.</p>
        <nav aria-label="Footer navigation">
          {navItems.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <a className="site-footer__top" href="#top" aria-label="Back to top"><ArrowUpRight size={19} /></a>
      </div>
      <div className="page-wrap site-footer__bottom">
        <span>PINNACLE DESIGN STUDIO</span>
        <span>Luxury Interior Architecture</span>
      </div>
    </footer>
  );
}

export default function App() {
  const pageRef = useRef(null);
  useMotion(pageRef);
  return (
    <div ref={pageRef} className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <PointerLens />
      <main id="main">
        <Hero />
        <Stats />
        <Philosophy />
        <Portfolio />
        <Disciplines />
        <Founders />
      </main>
      <Footer />
    </div>
  );
}

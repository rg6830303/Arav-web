/* Aravosh static site generator.
   Assembles consistent multi-page HTML (shared sidebar + shell) from the
   page definitions below. Output is plain static HTML committed to the repo.
   Run:  node build.mjs   */
import { writeFileSync } from "node:fs";

const SITE = "https://aravosh.com";
const EMAIL = "team@aravosh.com";
const ASSET_VERSION = "20260621-4";

/* Replace these with your real profiles (or remove) — used for Google sameAs. */
const SOCIAL = [
  "https://www.linkedin.com/company/aravosh",
  "https://x.com/aravosh",
  "https://www.instagram.com/aravosh",
];
const SERVICES = [
  { key: "dev", name: "Software Development", desc: "Focused web apps, dashboards and internal tools built around the workflows your team actually uses." },
  { key: "design", name: "Product Design & UX", desc: "Clear interfaces, prototypes and user flows before the build gets expensive." },
  { key: "ai", name: "AI Automation & Integration", desc: "AI-assisted workflows, internal copilots, multi-agent systems and practical integrations that reduce repetitive work without forcing a rebuild." },
  { key: "rag", name: "RAG & Knowledge Systems", desc: "Retrieval-augmented tools that let teams search, summarize and use their own documents more effectively." },
  { key: "cloud", name: "Cloud & DevOps", desc: "Deployment, monitoring and automation for projects that need to be easier to run after launch." },
  { key: "strategy", name: "Consulting & Strategy", desc: "Technical scoping, architecture reviews and practical roadmaps before you commit to a direction." },
];

/* Answers are self-contained facts so they double as both on-page FAQ copy and
   FAQPage structured data — used by AI answer engines (ChatGPT, Perplexity,
   Google AI Overviews) as well as classic search. */
const FAQS = [
  { q: "What does Aravosh do?", a: "Aravosh is an early-stage technology studio that builds practical software, AI automation, product design, cloud delivery and technical strategy for teams that need a clearly scoped project done well." },
  { q: "Is Aravosh a large agency?", a: "No. Aravosh is a small, early-stage studio, not a large agency with a long client roster. Projects get founder-led attention rather than being handed off to a big account team." },
  { q: "How long does a typical project take?", a: "It depends on scope: a small MVP can launch in under a month, a standard build typically runs two to three months, and larger engagements are scoped as ongoing, phased work." },
  { q: "How is pricing structured?", a: "There's no fixed price list. After an initial conversation about scope, timeline and constraints, we follow up with a clear, tailored estimate rather than a generic quote." },
  { q: "Can Aravosh help with AI automation or RAG projects?", a: "Yes. We build AI-assisted workflows, internal copilots and retrieval-augmented (RAG) tools that connect models to your documents, CRMs and internal processes." },
  { q: "Does Aravosh build multi-agent AI systems?", a: "Yes. We design and build multi-agent systems — coordinated AI agents that plan, hand off tasks and use tools together — for workflows like research, support triage and multi-step operations automation." },
  { q: "What technologies do you build with?", a: "Our core stack includes Next.js/React and TypeScript on the frontend, Node.js and Python/FastAPI on the backend, PostgreSQL, vector search and LLM integrations for AI work, and AWS with Docker, Kubernetes and Terraform for cloud and DevOps." },
];
/* Paste your Search Console token to verify the domain (Settings → Ownership). */
const GSC_VERIFY = "GOOGLE_SITE_VERIFICATION_TOKEN";

/* ---- shared icon set (stroke, 20px) ---- */
const I = {
  home: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',
  services: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  about: '<circle cx="9" cy="8" r="3"/><path d="M3.5 20a5.5 5.5 0 0111 0M16 6a3 3 0 010 6M18.5 20a5.5 5.5 0 00-3-4.9"/>',
  why: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  work: '<path d="M12 3l2.4 5.2L20 9l-4 4 1 6-5-2.8L7 19l1-6-4-4 5.6-.8z"/>',
  contact: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
};

const NAV = [
  { key: "home", href: "/", label: "Home", icon: I.home },
  { key: "services", href: "/services", label: "Services", icon: I.services },
  { key: "about", href: "/about", label: "About", icon: I.about },
  { key: "why", href: "/why", label: "Why Us", icon: I.why },
  { key: "work", href: "/work", label: "Work", icon: I.work },
  { key: "contact", href: "/contact", label: "Contact", icon: I.contact },
];

const sidebar = (active) => `
    <aside class="sidebar" id="sidebar" aria-label="Primary">
      <div class="sidebar-head">
        <a href="/" class="brand" aria-label="Aravosh — home">
          <img src="/assets/light-logo.jpeg" alt="Aravosh" class="brand-logo" width="1500" height="390" />
        </a>
      </div>
      <nav class="side-nav" aria-label="Pages">
        ${NAV.map((n) => `<a href="${n.href}"${n.key === active ? ' class="active" aria-current="page"' : ""}>
          <svg class="side-ico" viewBox="0 0 24 24" aria-hidden="true">${n.icon}</svg>
          <span>${n.label}</span>
        </a>`).join("\n        ")}
      </nav>
      <div class="sidebar-foot">
        <a href="/contact" class="btn btn-primary btn-block">Start a project</a>
        <a href="mailto:${EMAIL}" class="sidebar-mail">
          <svg class="side-ico" viewBox="0 0 24 24" aria-hidden="true">${I.contact}</svg>
          ${EMAIL}
        </a>
      </div>
    </aside>`;

const topbar = () => `
      <header class="topbar" data-header>
        <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-controls="sidebar" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <a href="/" class="brand brand-mobile" aria-label="Aravosh — home">
          <img src="/assets/light-logo.jpeg" alt="Aravosh" class="brand-logo" width="1500" height="390" />
        </a>
        <a href="/contact" class="btn btn-primary topbar-cta">Get in touch</a>
      </header>`;

const footer = () => `
      <footer class="app-footer">
        <span>&copy; <span id="year"></span> Aravosh. All rights reserved.</span>
        <nav class="footer-legal" aria-label="Legal">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="mailto:${EMAIL}" class="email-link">${EMAIL}</a>
        </nav>
      </footer>`;

const jsonLd = (slug, fullTitle, desc, url, faqs) => {
  const org = {
    "@type": ["Organization", "ProfessionalService"],
    "@id": SITE + "/#org",
    name: "Aravosh",
    alternateName: "Aravosh Technologies",
    url: SITE + "/",
    logo: { "@type": "ImageObject", url: SITE + "/assets/light-logo.jpeg" },
    image: SITE + "/assets/og-image.png",
    description: "Aravosh is an early-stage technology studio for practical software, AI automation, product design, cloud delivery and technical strategy.",
    disambiguatingDescription: "Aravosh is a technology studio brand, spelled A-R-A-V-O-S-H, and is not affiliated with any similarly named individual or consulting firm.",
    slogan: "Practical software, scoped honestly and built with care.",
    email: EMAIL,
    areaServed: "Remote",
    knowsAbout: ["Software Development", "Web Development", "Product Design", "UX", "AI Automation", "AI Integration", "Multi-Agent Systems", "AI Agents", "Agent Orchestration", "Retrieval-Augmented Generation", "RAG", "Cloud", "DevOps", "Technical Strategy"],
    sameAs: SOCIAL,
    contactPoint: { "@type": "ContactPoint", email: EMAIL, contactType: "customer service", availableLanguage: "English" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Technology services",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          "@id": SITE + "/services#" + s.key,
          name: s.name,
          description: s.desc,
          provider: { "@id": SITE + "/#org" },
        },
      })),
    },
  };
  const website = {
    "@type": "WebSite",
    "@id": SITE + "/#website",
    url: SITE + "/",
    name: "Aravosh",
    description: "Technology, AI automation and digital solutions for ambitious businesses.",
    publisher: { "@id": SITE + "/#org" },
    inLanguage: "en",
  };
  const webpage = {
    "@type": "WebPage",
    "@id": url + "#webpage",
    url: url,
    name: fullTitle,
    description: desc,
    isPartOf: { "@id": SITE + "/#website" },
    about: { "@id": SITE + "/#org" },
    inLanguage: "en",
  };
  const graph = [org, website, webpage];
  if (faqs && faqs.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": url + "#faq",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  if (slug !== "index" && slug !== "404") {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: fullTitle.replace(" — Aravosh", ""), item: url },
      ],
    });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
};

const page = ({ slug, active, title, desc, main, robots, faqs }) => {
  const url = SITE + (slug === "index" ? "/" : "/" + slug);
  const fullTitle = slug === "index" ? "Aravosh — Software, AI Automation & Digital Solutions" : title + " — Aravosh";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${fullTitle}</title>
  <meta name="description" content="${desc}" />
  ${robots ? '<meta name="robots" content="' + robots + '" />' : '<meta name="robots" content="index, follow, max-image-preview:large" />'}
  <link rel="canonical" href="${url}" />
  <meta name="theme-color" content="#f8f9fe" />
  <meta name="color-scheme" content="light" />
  <meta name="google-site-verification" content="${GSC_VERIFY}" />

  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
  <link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png" />
  <link rel="icon" href="/assets/favicon-48.png" sizes="48x48" type="image/png" />
  <link rel="icon" href="/assets/favicon-96.png" sizes="96x96" type="image/png" />
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
  <link rel="manifest" href="/assets/site.webmanifest" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Aravosh" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:title" content="${fullTitle}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${SITE}/assets/og-image.png" />
  <meta property="og:image:alt" content="Aravosh — technology and digital solutions" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${fullTitle}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="${SITE}/assets/og-image.png" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;450;500;600;700&family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css?v=${ASSET_VERSION}" />

  <script type="application/ld+json">
  ${jsonLd(slug, fullTitle, desc, url, faqs)}
  </script>
</head>
<body>
  <div class="scroll-progress" id="progress" aria-hidden="true"></div>
  <div class="grain" aria-hidden="true"></div>
  <a href="#main" class="skip-link">Skip to content</a>
  <div class="app">
${sidebar(active)}
    <div class="content">
${topbar()}
      <main id="main">
${main}
      </main>
${footer()}
    </div>
  </div>
  <div class="sidebar-backdrop" id="backdrop" hidden></div>
  <script src="/script.js" defer></script>
</body>
</html>
`;
};

/* ===================== page content ===================== */

const card = (icon, title, body) => `<article class="card" data-reveal data-tilt data-spot>
            <span class="card-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg></span>
            <h3>${title}</h3>
            <p>${body}</p>
          </article>`;

const SERVICE_ICONS = {
  dev: '<path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13.5 6l-3 12"/>',
  design: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  brand: '<path d="M12 3l2.4 5.2L20 9l-4 4 1 6-5-2.8L7 19l1-6-4-4 5.6-.8z"/>',
  growth: '<path d="M4 19V5M4 19h16M8 16l3.5-4 3 2.5L20 8"/>',
  cloud: '<path d="M7 18a4 4 0 010-8 5.5 5.5 0 0110.6-1.5A4 4 0 1117 18H7z"/>',
  strategy: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  ai: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="4"/><path d="M10.5 11.5h3M10.5 13.5h3"/>',
  rag: '<path d="M4 5.5C4 4.7 4.7 4 5.5 4h13c.8 0 1.5.7 1.5 1.5v13c0 .8-.7 1.5-1.5 1.5h-13C4.7 20 4 19.3 4 18.5z"/><path d="M8 8h8M8 12h5M8 16h7"/>',
  agents: '<circle cx="6" cy="6" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="12" cy="18" r="2.6"/><path d="M8.3 7.4L10.4 15M15.7 7.4L13.6 15M8.6 6H15.4"/>',
};

const escAmp = (s) => s.replace(/&/g, "&amp;");
const serviceCard = (s) => card(SERVICE_ICONS[s.key], escAmp(s.name), s.desc);

const faqSection = () => `<section class="section faq-section">
          <div class="container">
            <header class="section-head" data-reveal>
              <span class="eyebrow"><span class="eyebrow-dot"></span> FAQ</span>
              <h2>Questions, answered</h2>
              <p>Everything you need to know before starting a project with Aravosh.</p>
            </header>
            <div class="faq-list" data-reveal>
              ${FAQS.map((f) => `<details class="faq-item">
                <summary>${f.q}</summary>
                <p>${f.a}</p>
              </details>`).join("\n              ")}
            </div>
          </div>
        </section>`;

const servicesGrid = () => `<div class="grid grid-3">
          ${SERVICES.map(serviceCard).join("\n          ")}
        </div>`;

const ctaBand = (heading, text) => `<section class="section">
          <div class="cta" data-reveal>
            <div class="cta-glow" aria-hidden="true"></div>
            <span class="eyebrow"><span class="eyebrow-dot"></span> Let's talk</span>
            <h2>${heading}</h2>
            <p>${text}</p>
            <a href="/contact" class="btn btn-primary btn-cta">Start a project
              <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${I.arrow}</svg></a>
          </div>
        </section>`;

const pageHead = (eyebrow, h1, sub) => `<header class="page-head" data-reveal>
          <span class="eyebrow"><span class="eyebrow-dot"></span> ${eyebrow}</span>
          <h1>${h1}</h1>
          ${sub ? `<p>${sub}</p>` : ""}
        </header>`;

/* ---- Home ---- */
const home = `        <section class="hero">
          <div class="hero-bg" aria-hidden="true">
            <div class="aurora"></div>
            <div class="hero-grid" data-parallax="0.02"></div>
            <div class="hero-glow" data-parallax="0.05"></div>
            <div class="hero-spotlight" id="heroSpot"></div>
          </div>
          <div class="container hero-inner hero-split">
            <div class="hero-copy">
              <span class="eyebrow" data-reveal><span class="eyebrow-dot"></span> <span id="greeting">Digital solutions, engineered with care</span></span>
              <h1 data-reveal>We build technology that <span class="text-grad">moves your business forward.</span></h1>
              <p class="hero-sub" data-reveal>Aravosh partners with ambitious teams to design, build and scale modern digital products, AI-enabled workflows and software that performs.</p>
              <div class="hero-actions" data-reveal>
                <a href="/contact" class="btn btn-primary btn-cta" data-magnetic>Start a project <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${I.arrow}</svg></a>
                <a href="/services" class="btn btn-ghost" data-magnetic>Explore services</a>
              </div>
            </div>
            <div class="hero-visual" data-reveal aria-hidden="true">
              <div class="scene" id="scene">
                <canvas class="orb-canvas" id="orbCanvas"></canvas>
                <div class="orb-glow"></div>
                <div class="scene-3d">
                  <div class="glass-card glass-main">
                    <span class="glass-logo">A</span>
                    <span class="glass-bars"><i></i><i></i><i></i></span>
                  </div>
                  <div class="glass-card glass-chip chip-a"><svg viewBox="0 0 24 24">${SERVICE_ICONS.dev}</svg></div>
                  <div class="glass-card glass-chip chip-c"><svg viewBox="0 0 24 24">${SERVICE_ICONS.cloud}</svg></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="section">
          <div class="container">
            <header class="section-head" data-reveal>
              <span class="eyebrow"><span class="eyebrow-dot"></span> What we do</span>
              <h2>Focused help where digital projects usually get stuck</h2>
              <p>Sharper scope, cleaner interfaces, dependable builds, practical AI automation and enough cloud support to keep things running.</p>
            </header>
            <div class="grid grid-3">
              ${SERVICES.filter((s) => ["dev", "ai", "cloud"].includes(s.key)).map(serviceCard).join("\n              ")}
            </div>
            <div class="center-row" data-reveal>
              <a href="/services" class="btn btn-ghost">See all services <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${I.arrow}</svg></a>
            </div>
          </div>
        </section>
        ${faqSection()}
        <div class="container">
          ${ctaBand("Ready to talk through a project?", `Send the rough context and the next decision you need to make.`)}
        </div>`;

/* ---- Services ---- */
const services = `        <div class="page container">
          ${pageHead("What we do", "Focused services for practical digital and AI projects", "A narrower set of capabilities for teams that need clear scope, usable interfaces, sensible AI integration and dependable delivery.")}
          ${servicesGrid()}
          
          <div class="tech-matrix" data-reveal>
            <header class="section-head">
              <span class="eyebrow"><span class="eyebrow-dot"></span> Technologies</span>
              <h2>Tools we commonly work with</h2>
              <p>Technology choices stay tied to the project: what it needs to do, who maintains it and where it will run.</p>
            </header>
            <div class="tech-tabs" role="group" aria-label="Filter technologies">
              <button class="tech-tab active" data-category="all" aria-pressed="true">All Tech</button>
              <button class="tech-tab" data-category="frontend" aria-pressed="false">Frontend</button>
              <button class="tech-tab" data-category="backend" aria-pressed="false">Backend & DB</button>
              <button class="tech-tab" data-category="ai" aria-pressed="false">AI & RAG</button>
              <button class="tech-tab" data-category="cloud" aria-pressed="false">Cloud & DevOps</button>
            </div>
            <div class="tech-grid">
              <!-- Frontend -->
              <div class="tech-card" data-category="frontend">
                <div class="tech-icon-wrap">
                  <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <h4>Next.js / React</h4>
                <div class="tech-tooltip">High performance, SEO-friendly server-rendered UI architectures.</div>
              </div>
              <div class="tech-card" data-category="frontend">
                <div class="tech-icon-wrap">
                  <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h4>TypeScript</h4>
                <div class="tech-tooltip">Type safety and robust structuring for complex applications.</div>
              </div>
              <div class="tech-card" data-category="frontend">
                <div class="tech-icon-wrap">
                  <svg viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>
                </div>
                <h4>Tailwind CSS</h4>
                <div class="tech-tooltip">Utility-first responsive designs built with high visual precision.</div>
              </div>
              
              <!-- Backend & DB -->
              <div class="tech-card" data-category="backend">
                <div class="tech-icon-wrap">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                </div>
                <h4>Node.js / Express</h4>
                <div class="tech-tooltip">Efficient, event-driven API endpoints and microservices.</div>
              </div>
              <div class="tech-card" data-category="backend">
                <div class="tech-icon-wrap">
                  <svg viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v12M6 12h12"/></svg>
                </div>
                <h4>Python / FastAPI</h4>
                <div class="tech-tooltip">High-speed REST APIs and background tasks with type annotations.</div>
              </div>
              <div class="tech-card" data-category="backend">
                <div class="tech-icon-wrap">
                  <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                </div>
                <h4>PostgreSQL</h4>
                <div class="tech-tooltip">Enterprise-grade relational database design and complex queries.</div>
              </div>
              
              <!-- AI & RAG -->
              <div class="tech-card" data-category="ai">
                <div class="tech-icon-wrap">
                  <svg viewBox="0 0 24 24">${SERVICE_ICONS.ai}</svg>
                </div>
                <h4>LLM Integrations</h4>
                <div class="tech-tooltip">Model-backed features for support, operations, content workflows and internal tools.</div>
              </div>
              <div class="tech-card" data-category="ai">
                <div class="tech-icon-wrap">
                  <svg viewBox="0 0 24 24">${SERVICE_ICONS.rag}</svg>
                </div>
                <h4>RAG Pipelines</h4>
                <div class="tech-tooltip">Retrieval workflows that connect AI responses to your documents, policies and knowledge base.</div>
              </div>
              <div class="tech-card" data-category="ai">
                <div class="tech-icon-wrap">
                  <svg viewBox="0 0 24 24">${SERVICE_ICONS.agents}</svg>
                </div>
                <h4>Multi-Agent Systems</h4>
                <div class="tech-tooltip">Coordinated AI agents that plan, hand off tasks and use tools together to complete multi-step work.</div>
              </div>
              <div class="tech-card" data-category="ai backend">
                <div class="tech-icon-wrap">
                  <svg viewBox="0 0 24 24"><path d="M4 6h16M7 10h10M9 14h6M12 18v3M8 21h8"/></svg>
                </div>
                <h4>Vector Search</h4>
                <div class="tech-tooltip">Embeddings, indexing and retrieval patterns for AI search and document Q&amp;A.</div>
              </div>
              <div class="tech-card" data-category="ai">
                <div class="tech-icon-wrap">
                  <svg viewBox="0 0 24 24"><path d="M5 12h4l2-6 2 12 2-6h4"/></svg>
                </div>
                <h4>Workflow Automation</h4>
                <div class="tech-tooltip">AI-assisted handoffs across forms, CRMs, emails, docs and internal review steps.</div>
              </div>
              
              <!-- Cloud & DevOps -->
              <div class="tech-card" data-category="cloud">
                <div class="tech-icon-wrap">
                  <svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/></svg>
                </div>
                <h4>Amazon Web Services</h4>
                <div class="tech-tooltip">Highly available multi-region serverless architectures.</div>
              </div>
              <div class="tech-card" data-category="cloud">
                <div class="tech-icon-wrap">
                  <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <h4>Docker & Kubernetes</h4>
                <div class="tech-tooltip">Containerized applications managed with scalable orchestration.</div>
              </div>
              <div class="tech-card" data-category="cloud">
                <div class="tech-icon-wrap">
                  <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h4>GitHub Actions / CI</h4>
                <div class="tech-tooltip">Fully automated deployment pipelines to compile and deploy with zero downtime.</div>
              </div>
              <div class="tech-card" data-category="cloud">
                <div class="tech-icon-wrap">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                </div>
                <h4>Terraform</h4>
                <div class="tech-tooltip">Infrastructure as Code for predictable, reproducible cloud topologies.</div>
              </div>
            </div>
          </div>

          ${ctaBand("Have a project in mind?", "Let's talk about how we can help you build it.")}
        </div>`

/* ---- About ---- */
const about = `        <div class="page container">
          ${pageHead("About Aravosh", "An early-stage studio building useful digital systems")}
          <div class="about-inner">
            <div class="about-media" data-reveal>
              <div class="about-card">
                <span class="about-chip">Early-stage studio</span>
                <h3>Small team, practical builds</h3>
                <p>We are building our track record with focused websites, software tools, AI workflows and cloud-backed systems.</p>
                <div class="about-card-stats">
                  <div><strong>Focused</strong><span>Project delivery</span></div>
                  <div><strong>1:1</strong><span>Direct collaboration</span></div>
                </div>
              </div>
            </div>
            <div class="about-text" data-reveal>
              <p>Aravosh is a young technology studio, so we do not pretend to have a long agency track record. We keep the promise simpler: understand the problem, scope the work clearly and build something useful with careful communication.</p>
              <ul class="check-list">
                <li>Scope and constraints clarified before the build starts</li>
                <li>Founder-led attention on every project</li>
                <li>Practical handoff notes instead of vague promises</li>
              </ul>
              <a href="/contact" class="btn btn-primary">Work with us <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${I.arrow}</svg></a>
            </div>
          </div>
          ${ctaBand("Have an early project to shape?", "Send the rough context. We can help make the next step clearer.")}
        </div>`;

/* ---- Why ---- */
const why = `        <div class="page container">
          ${pageHead("Why Aravosh", "Built around honest scope and careful execution", "A small set of working principles for early projects that need clarity more than theatre.")}
          
          <div class="timeline-container" data-reveal>
            <div class="timeline-line">
              <div class="timeline-line-filled"></div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-badge"></div>
              <div class="timeline-content">
                <span class="timeline-num">Phase 01</span>
                <h3>Discovery & Scope</h3>
                <p>We start by understanding the actual workflow, constraints, users and decisions the project needs to support.</p>
              </div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-badge"></div>
              <div class="timeline-content">
                <span class="timeline-num">Phase 02</span>
                <h3>UX/UI Direction</h3>
                <p>We map the main flows and interface states before development so the build has a clear target.</p>
              </div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-badge"></div>
              <div class="timeline-content">
                <span class="timeline-num">Phase 03</span>
                <h3>Focused Development</h3>
                <p>We build the useful core first: websites, dashboards, AI workflows or internal tools that match the agreed scope.</p>
              </div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-badge"></div>
              <div class="timeline-content">
                <span class="timeline-num">Phase 04</span>
                <h3>Review & Testing</h3>
                <p>We check the important paths, fix rough edges and make sure the handoff is understandable before launch.</p>
              </div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-badge"></div>
              <div class="timeline-content">
                <span class="timeline-num">Phase 05</span>
                <h3>Launch & Handoff</h3>
                <p>We help deploy the project, document what matters and leave the next improvement path clear.</p>
              </div>
            </div>
          </div>

          ${ctaBand("Want a realistic path forward?", "Tell us what you are trying to build and where the uncertainty is.")}
        </div>`;

/* ---- Work ---- */
const workItem = (title, body, tags) => `<article class="case-card work-pattern" data-reveal>
              <div class="case-info">
                <div class="case-meta">
                  ${tags.map((tag) => `<span class="case-tag">${tag}</span>`).join("")}
                </div>
                <h3>${title}</h3>
                <p>${body}</p>
              </div>
            </article>`;

const work = `        <div class="page container">
          ${pageHead("Work", "Project patterns we handle well", "A practical view of the kinds of work Aravosh can take on without pretending to show client results that are not ready to publish.")}

          <div class="case-grid">
            ${workItem("Internal dashboard or admin tool", "Turn scattered spreadsheet, CRM or operations work into a focused web interface with the right permissions, data views and handoff notes.", ["Web app", "Workflow", "Admin UI"])}
            ${workItem("Product MVP or feature build", "Scope the core flow, design the interface and build a launchable version that can be tested with real users before the roadmap grows.", ["MVP", "UX", "Frontend"])}
            ${workItem("AI-assisted operations workflow", "Connect forms, documents, support notes or internal knowledge to an AI workflow — including coordinated multi-agent systems — that helps teams triage, summarize and act faster.", ["AI", "Multi-Agent", "Automation", "RAG"])}
            ${workItem("Cloud cleanup or deployment setup", "Move a fragile deploy process toward clearer environments, automated releases, basic monitoring and documentation your team can maintain.", ["DevOps", "Cloud", "Handoff"])}
          </div>

          <section class="section work-note" data-reveal>
            <div class="section-head">
              <span class="eyebrow"><span class="eyebrow-dot"></span> Evidence over polish</span>
              <h2>Real case studies should be specific</h2>
              <p>When public work is ready to share, this page should show the problem, constraints, screenshots, timeline, role and a clear explanation of what was actually delivered.</p>
            </div>
          </section>

          ${ctaBand("Have a project we can look at?", "Send the rough context first. We can help shape the scope before anything becomes a formal engagement.")}
        </div>`;

/* ---- Contact (with form) ---- */
const contact = `        <div class="page container">
          ${pageHead("Let's talk", "Tell us what you need built", "Share the rough scope, timeline and constraints. A short note is enough to start.")}
          <div class="contact-grid">
            <aside class="contact-info" data-reveal>
              <div class="info-card">
                <h3>Get in touch</h3>
                <p>Prefer direct email? Send the project context and the next decision you need help with.</p>
                <a href="mailto:${EMAIL}" class="email-link">${EMAIL}</a>
              </div>
              <ul class="info-list">
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg> Clear next steps after the first email</li>
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg> Scope before estimates</li>
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg> Practical advice, even if the project is early</li>
              </ul>
            </aside>
            
            <div class="contact-form-wrap" data-reveal>
              <!-- Interactive Planner Stepper -->
              <div class="planner-card" id="projectPlanner">
                <div class="planner-header">
                  <h3>Project Discovery Tool</h3>
                  <div class="planner-steps">
                    <div class="planner-step-dot active" data-dot="1"></div>
                    <div class="planner-step-dot" data-dot="2"></div>
                    <div class="planner-step-dot" data-dot="3"></div>
                    <div class="planner-step-dot" data-dot="4"></div>
                  </div>
                </div>
                
                <div class="planner-body">
                  <div class="planner-panels">
                    <!-- Step 1 -->
                    <div class="planner-panel active" data-step="1">
                      <h4>What type of project are we building?</h4>
                      <div class="planner-options">
                        <button type="button" class="planner-option-btn" data-value="dev" aria-pressed="false">
                          <span>Software Development</span>
                          <small>Web apps, mobile apps, SaaS systems</small>
                        </button>
                        <button type="button" class="planner-option-btn" data-value="design" aria-pressed="false">
                          <span>Product Design &amp; UX</span>
                          <small>Wireframing, high-res UI design, prototyping</small>
                        </button>
                        <button type="button" class="planner-option-btn" data-value="cloud" aria-pressed="false">
                          <span>Cloud &amp; DevOps</span>
                          <small>CI/CD pipelines, AWS infra setup, migrations</small>
                        </button>
                        <button type="button" class="planner-option-btn" data-value="ai" aria-pressed="false">
                          <span>AI Automation &amp; Integration</span>
                          <small>Copilots, RAG tools, multi-agent systems, workflow automation</small>
                        </button>
                        <button type="button" class="planner-option-btn" data-value="strategy" aria-pressed="false">
                          <span>Consulting &amp; Strategy</span>
                          <small>Tech guidance, roadmapping, scoping</small>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Step 2 -->
                    <div class="planner-panel" data-step="2">
                      <h4>What is the scale of the engagement?</h4>
                      <div class="planner-options">
                        <button type="button" class="planner-option-btn" data-value="mvp" aria-pressed="false">
                          <span>MVP / Small Scale</span>
                          <small>Basic launch, single platform, essential features</small>
                        </button>
                        <button type="button" class="planner-option-btn" data-value="medium" aria-pressed="false">
                          <span>Multi-feature Build</span>
                          <small>Several workflows, integrations or dashboards</small>
                        </button>
                        <button type="button" class="planner-option-btn" data-value="enterprise" aria-pressed="false">
                          <span>Enterprise / Full Stack</span>
                          <small>Scalable systems, high security, advanced workflows</small>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Step 3 -->
                    <div class="planner-panel" data-step="3">
                      <h4>What is your target timeline?</h4>
                      <div class="planner-options">
                        <button type="button" class="planner-option-btn" data-value="fast" aria-pressed="false">
                          <span>Fast-Track</span>
                          <small>Urgent launch, less than 1 month</small>
                        </button>
                        <button type="button" class="planner-option-btn" data-value="standard" aria-pressed="false">
                          <span>Standard Delivery</span>
                          <small>Typical cycle, 2 to 3 months</small>
                        </button>
                        <button type="button" class="planner-option-btn" data-value="flexible" aria-pressed="false">
                          <span>Flexible</span>
                          <small>Ongoing engagement, adaptive phases</small>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Step 4 -->
                    <div class="planner-panel" data-step="4">
                      <h4>Let's wrap up your request</h4>
                      <form id="contactForm" class="form" action="https://api.web3forms.com/submit" method="POST" novalidate>
                        <input type="hidden" name="access_key" value="41492813-7c57-4220-a958-fddb3a9dc7a1" />
                        <input type="hidden" name="subject" value="New enquiry from the Aravosh website" />
                        <input type="hidden" name="from_name" value="Aravosh Website" />
                        <input type="hidden" id="plannerDetails" name="planner_details" value="" />
                        <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" />
                        
                        <div class="field">
                          <label for="name">Name <span class="req" aria-hidden="true">*</span></label>
                          <input id="name" name="name" type="text" autocomplete="name" required aria-required="true" aria-describedby="err-name" placeholder="Jane Doe…" />
                          <p class="field-error" id="err-name">Please enter your name.</p>
                        </div>
                        <div class="field">
                          <label for="email">Email <span class="req" aria-hidden="true">*</span></label>
                          <input id="email" name="email" type="email" autocomplete="email" spellcheck="false" required aria-required="true" aria-describedby="err-email" placeholder="jane@company.com…" />
                          <p class="field-error" id="err-email">Please enter a valid email address.</p>
                        </div>
                        <div class="field">
                          <label for="message">Anything else we should know? <span class="req" aria-hidden="true">*</span></label>
                          <textarea id="message" name="message" rows="3" required aria-required="true" aria-describedby="err-message" placeholder="Current site, dashboard, AI workflow, migration…"></textarea>
                          <p class="field-error" id="err-message">Please add a short note about your project.</p>
                        </div>
                        <div class="form-status" id="formStatus" role="status" aria-live="polite"></div>
                      </form>
                    </div>
                  </div>
                  
                  <!-- Summary Sidebar Widget -->
                  <div class="planner-summary-panel">
                    <div class="summary-widget">
                      <h4>Planner Summary</h4>
                      <div class="summary-list">
                        <div class="summary-item">
                          <span>Project:</span>
                          <strong id="sumService">Select...</strong>
                        </div>
                        <div class="summary-item">
                          <span>Scale:</span>
                          <strong id="sumScale">Select...</strong>
                        </div>
                        <div class="summary-item">
                          <span>Timeline:</span>
                          <strong id="sumTimeline">Select...</strong>
                        </div>
                      </div>
                    </div>
                    <p class="summary-note">Use this as a starting point. The first reply can clarify scope before any estimate is made.</p>
                  </div>
                </div>
                
                <div class="planner-footer">
                  <button type="button" class="btn btn-ghost" id="plannerBack">Back</button>
                  <div class="planner-nav">
                    <button type="button" class="btn btn-primary" id="plannerNext">Next Step <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${I.arrow}</svg></button>
                    <button type="submit" form="contactForm" class="btn btn-primary" id="plannerSubmit" style="display:none">
                      <span class="btn-label">Submit Inquiry</span>
                      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${I.arrow}</svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;

/* ---- Legal ---- */
const legal = (title, updated, body) => `        <div class="page container">
          <a href="/" class="back-link"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${I.back}</svg> Back to home</a>
          <article class="legal">
            <header class="legal-header"><h1>${title}</h1><p class="legal-meta">Last updated: ${updated}</p></header>
${body}
          </article>
        </div>`;

const privacy = legal("Privacy Policy", "15 June 2026", `            <p>This Privacy Policy explains how Aravosh ("we", "us", or "our") collects, uses and safeguards information when you visit our website or engage our services. By using this site you agree to the practices described below.</p>
            <h2>Information we collect</h2>
            <ul><li><strong>Information you provide:</strong> details you share through our contact form or by email, such as your name, email address, company and message.</li><li><strong>Usage data:</strong> basic, aggregated information about how visitors use the site, collected to improve our content.</li></ul>
            <h2>How we use information</h2>
            <ul><li>To respond to your enquiries and provide the services you request.</li><li>To operate, maintain and improve our website and offerings.</li><li>To comply with legal obligations and protect our rights.</li></ul>
            <h2>Sharing of information</h2>
            <p>We do not sell your personal information. We may share information with trusted service providers who help us operate the site (such as our form and hosting providers), and only to the extent necessary, or where required by law.</p>
            <h2>Data retention</h2>
            <p>We retain personal information only for as long as needed to fulfil the purposes described in this policy, unless a longer retention period is required by law.</p>
            <h2>Your rights</h2>
            <p>Depending on your location, you may have the right to access, correct or delete the personal information we hold about you. To exercise these rights, contact us at <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>
            <h2>Contact us</h2>
            <p>If you have any questions about this Privacy Policy, please email <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>`);

const terms = legal("Terms of Service", "15 June 2026", `            <p>These Terms of Service ("Terms") govern your access to and use of the Aravosh website and any services we provide. By using this site, you agree to these Terms.</p>
            <h2>Use of the site</h2>
            <p>You agree to use the site only for lawful purposes and in a way that does not infringe the rights of, or restrict the use of, this site by any third party.</p>
            <h2>Intellectual property</h2>
            <p>Unless stated otherwise, all content on this site — including text, graphics, logos and the Aravosh name and marks — is the property of Aravosh and is protected by applicable intellectual property laws. You may not reproduce it without our written permission.</p>
            <h2>Services</h2>
            <p>Any engagement for professional services is subject to a separate written agreement. These Terms govern only your use of this website.</p>
            <h2>Disclaimer</h2>
            <p>The site is provided on an "as is" and "as available" basis. We make no warranties, express or implied, regarding the accuracy or completeness of the content.</p>
            <h2>Limitation of liability</h2>
            <p>To the fullest extent permitted by law, Aravosh shall not be liable for any indirect or consequential loss arising from your use of, or inability to use, this site.</p>
            <h2>Changes to these Terms</h2>
            <p>We may update these Terms from time to time. Continued use of the site after changes are posted constitutes your acceptance of the revised Terms.</p>
            <h2>Contact us</h2>
            <p>Questions about these Terms can be sent to <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>`);

/* ---- 404 ---- */
const notfound = `        <section class="error-page">
          <div class="hero-bg" aria-hidden="true"><div class="hero-grid"></div><div class="hero-glow"></div></div>
          <div class="error-inner">
            <div class="error-code text-grad">404</div>
            <h1>This page wandered off.</h1>
            <p>The page you're looking for doesn't exist or has moved. Let's get you back on track.</p>
            <div class="hero-actions" style="justify-content:center">
              <a href="/" class="btn btn-primary">Back to home <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${I.arrow}</svg></a>
              <a href="/contact" class="btn btn-ghost">Contact us</a>
            </div>
          </div>
        </section>`;

/* ===================== write files ===================== */
const PAGES = [
  { file: "index.html", slug: "index", active: "home", title: "Software, AI Automation, UX & Cloud Delivery", desc: "Aravosh helps teams scope, design, build and launch practical web products, AI automations, multi-agent systems, dashboards and cloud-backed tools.", main: home, faqs: FAQS },
  { file: "services.html", slug: "services", active: "services", title: "Services", desc: "Software development, AI automation, multi-agent systems, product design, cloud delivery and technical strategy from Aravosh.", main: services },
  { file: "about.html", slug: "about", active: "about", title: "About", desc: "Aravosh is an early-stage technology studio building practical software, AI workflows and digital systems.", main: about },
  { file: "why.html", slug: "why", active: "why", title: "Why Us", desc: "How Aravosh approaches early digital projects with honest scope, clear communication and careful execution.", main: why },
  { file: "work.html", slug: "work", active: "work", title: "Work", desc: "Project patterns Aravosh handles well, with a practical standard for future case studies.", main: work },
  { file: "contact.html", slug: "contact", active: "contact", title: "Contact", desc: "Tell Aravosh what you need built, automated, integrated, scoped or cleaned up.", main: contact },
  { file: "privacy.html", slug: "privacy", active: "", title: "Privacy Policy", desc: "How Aravosh collects, uses and protects your information.", main: privacy },
  { file: "terms.html", slug: "terms", active: "", title: "Terms of Service", desc: "The terms that govern your use of the Aravosh website and services.", main: terms },
  { file: "404.html", slug: "404", active: "", title: "Page not found", desc: "The page you're looking for doesn't exist.", main: notfound, robots: "noindex" },
];

for (const p of PAGES) {
  writeFileSync(new URL("./" + p.file, import.meta.url), page(p));
  console.log("wrote", p.file);
}
console.log("Done — " + PAGES.length + " pages generated.");

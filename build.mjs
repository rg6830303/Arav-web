/* Aravosh static site generator.
   Assembles consistent multi-page HTML (shared sidebar + shell) from the
   page definitions below. Output is plain static HTML committed to the repo.
   Run:  node build.mjs   */
import { writeFileSync } from "node:fs";

const SITE = "https://aravosh.com";
const EMAIL = "team@aravosh.com";

/* Replace these with your real profiles (or remove) — used for Google sameAs. */
const SOCIAL = [
  "https://www.linkedin.com/company/aravosh",
  "https://x.com/aravosh",
  "https://www.instagram.com/aravosh",
];
const SERVICE_NAMES = [
  "Software Development",
  "Product Design & UX",
  "Brand & Identity",
  "Growth & Marketing",
  "Cloud & DevOps",
  "Consulting & Strategy",
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
          <img src="/assets/logo.png" alt="Aravosh" class="brand-logo" width="1500" height="390" />
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
          <img src="/assets/logo.png" alt="Aravosh" class="brand-logo" width="1500" height="390" />
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

const jsonLd = (slug, fullTitle, desc, url) => {
  const org = {
    "@type": ["Organization", "ProfessionalService"],
    "@id": SITE + "/#org",
    name: "Aravosh",
    alternateName: "Aravosh Technologies",
    url: SITE + "/",
    logo: { "@type": "ImageObject", url: SITE + "/assets/logo.png" },
    image: SITE + "/assets/og-image.png",
    description: "Aravosh is a technology and digital solutions company offering software development, product design, cloud, branding and growth services for ambitious businesses.",
    slogan: "We build technology that moves your business forward.",
    email: EMAIL,
    foundingDate: "2017",
    areaServed: "Worldwide",
    knowsAbout: ["Software Development", "Web Development", "Product Design", "UX", "Cloud", "DevOps", "Branding", "Digital Marketing", "SEO"],
    sameAs: SOCIAL,
    contactPoint: { "@type": "ContactPoint", email: EMAIL, contactType: "customer service", availableLanguage: "English" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Technology services",
      itemListElement: SERVICE_NAMES.map((n) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: n } })),
    },
  };
  const website = {
    "@type": "WebSite",
    "@id": SITE + "/#website",
    url: SITE + "/",
    name: "Aravosh",
    description: "Technology and digital solutions for ambitious businesses.",
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

const page = ({ slug, active, title, desc, main, robots }) => {
  const url = SITE + (slug === "index" ? "/" : "/" + slug);
  const fullTitle = slug === "index" ? "Aravosh — Technology & Digital Solutions Company" : title + " — Aravosh";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${fullTitle}</title>
  <meta name="description" content="${desc}" />
  ${robots ? '<meta name="robots" content="' + robots + '" />' : '<meta name="robots" content="index, follow, max-image-preview:large" />'}
  <link rel="canonical" href="${url}" />
  <meta name="theme-color" content="#0a0e17" />
  <meta name="color-scheme" content="dark" />
  <meta name="google-site-verification" content="${GSC_VERIFY}" />

  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
  <link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png" />
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
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;450;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css" />

  <script type="application/ld+json">
  ${jsonLd(slug, fullTitle, desc, url)}
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
};

const servicesGrid = () => `<div class="grid grid-3">
          ${card(SERVICE_ICONS.dev, "Software Development", "Reliable web and mobile applications built on a modern, scalable stack designed to grow with you.")}
          ${card(SERVICE_ICONS.design, "Product Design &amp; UX", "Intuitive interfaces and thoughtful user journeys that turn first-time visitors into loyal customers.")}
          ${card(SERVICE_ICONS.brand, "Brand &amp; Identity", "Distinctive visual identities and messaging that make your business memorable across every channel.")}
          ${card(SERVICE_ICONS.growth, "Growth &amp; Marketing", "Data-driven campaigns and SEO that put your product in front of the right audience at the right time.")}
          ${card(SERVICE_ICONS.cloud, "Cloud &amp; DevOps", "Resilient infrastructure, automated pipelines and monitoring so your team can ship with confidence.")}
          ${card(SERVICE_ICONS.strategy, "Consulting &amp; Strategy", "Clear roadmaps and technical guidance to help you make the right decisions at every stage.")}
        </div>`;

const LOGOS = ["Northwind", "Vertex", "Lumen", "Quanta", "Helios", "Aerolux", "Cobalt"];
const trusted = () => `<section class="trusted" aria-label="Clients">
          <p class="trusted-label">Trusted by forward-thinking teams</p>
          <div class="marquee" aria-hidden="true">
            <ul class="marquee-track">
              ${LOGOS.concat(LOGOS).map((l) => `<li>${l}</li>`).join("")}
            </ul>
          </div>
        </section>`;

const ctaBand = (heading, text) => `<section class="section">
          <div class="cta" data-reveal>
            <div class="cta-glow" aria-hidden="true"></div>
            <span class="eyebrow"><span class="eyebrow-dot"></span> Let's talk</span>
            <h2>${heading}</h2>
            <p>${text}</p>
            <a href="/contact" class="btn btn-primary btn-lg">Start a project
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
              <p class="hero-sub" data-reveal>Aravosh partners with ambitious teams to design, build and scale modern digital products — from strategy and branding to software that performs.</p>
              <div class="hero-actions" data-reveal>
                <a href="/contact" class="btn btn-primary" data-magnetic>Start a project <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${I.arrow}</svg></a>
                <a href="/services" class="btn btn-ghost" data-magnetic>Explore services</a>
              </div>
              <dl class="hero-stats" data-reveal>
                <div class="stat"><dt data-count="120" data-suffix="+">0</dt><dd>Projects delivered</dd></div>
                <div class="stat"><dt data-count="40" data-suffix="+">0</dt><dd>Clients worldwide</dd></div>
                <div class="stat"><dt data-count="9" data-suffix=" yrs">0</dt><dd>Industry experience</dd></div>
                <div class="stat"><dt data-count="98" data-suffix="%">0</dt><dd>Client retention</dd></div>
              </dl>
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
        <div class="container">
          ${trusted()}
        </div>
        <section class="section">
          <div class="container">
            <header class="section-head" data-reveal>
              <span class="eyebrow"><span class="eyebrow-dot"></span> What we do</span>
              <h2>Everything you need under one roof</h2>
              <p>From first concept to launch and beyond — a single partner across the whole journey.</p>
            </header>
            ${servicesGrid().replace("grid grid-3", "grid grid-3")}
            <div class="center-row" data-reveal>
              <a href="/services" class="btn btn-ghost">See all services <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${I.arrow}</svg></a>
            </div>
          </div>
        </section>
        <div class="container">
          ${ctaBand("Ready to start your next project?", `Tell us what you're building and we'll get back to you within one business day.`)}
        </div>`;

/* ---- Services ---- */
const services = `        <div class="page container">
          ${pageHead("What we do", "Services built around your goals", "End-to-end capabilities to take your idea from concept to a product people love.")}
          ${servicesGrid()}
          
          <div class="tech-matrix" data-reveal>
            <header class="section-head">
              <span class="eyebrow"><span class="eyebrow-dot"></span> Technologies</span>
              <h2>Our Tech Stack</h2>
              <p>We build with modern, production-grade tools and frameworks optimized for speed, scale, and maintainability.</p>
            </header>
            <div class="tech-tabs">
              <button class="tech-tab active" data-category="all">All Tech</button>
              <button class="tech-tab" data-category="frontend">Frontend</button>
              <button class="tech-tab" data-category="backend">Backend & DB</button>
              <button class="tech-tab" data-category="cloud">Cloud & DevOps</button>
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
          ${pageHead("About Aravosh", "A partner invested in your success")}
          <div class="about-inner">
            <div class="about-media" data-reveal>
              <div class="about-card">
                <span class="about-chip">Established 2017</span>
                <h3>Crafting digital excellence</h3>
                <p>A multidisciplinary team of engineers, designers and strategists working as one.</p>
                <div class="about-card-stats">
                  <div><strong>30+</strong><span>Specialists</span></div>
                  <div><strong>4</strong><span>Continents served</span></div>
                </div>
              </div>
            </div>
            <div class="about-text" data-reveal>
              <p>We're more than a vendor — we're an extension of your team. Aravosh blends deep technical expertise with a relentless focus on outcomes, helping organisations of every size turn complex challenges into elegant, dependable solutions.</p>
              <ul class="check-list">
                <li>Transparent communication at every stage</li>
                <li>Senior talent on every engagement</li>
                <li>Long-term support, not just a hand-off</li>
              </ul>
              <a href="/contact" class="btn btn-primary">Work with us <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${I.arrow}</svg></a>
            </div>
          </div>
          ${ctaBand("Let's build something great together", "Reach out and tell us about your goals.")}
        </div>`;

/* ---- Why ---- */
const why = `        <div class="page container">
          ${pageHead("Why Aravosh", "Built on principles that deliver", "The reasons clients choose us — and stay with us.")}
          
          <div class="timeline-container" data-reveal>
            <div class="timeline-line">
              <div class="timeline-line-filled"></div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-badge"></div>
              <div class="timeline-content">
                <span class="timeline-num">Phase 01</span>
                <h3>Discovery & Strategy</h3>
                <p>We work closely with your team to detail features, establish requirements, map architecture, and set business objectives.</p>
              </div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-badge"></div>
              <div class="timeline-content">
                <span class="timeline-num">Phase 02</span>
                <h3>UX/UI Design</h3>
                <p>Crafting intuitive customer journeys, high-fidelity mockups, and interactive prototypes that validate user flows before coding.</p>
              </div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-badge"></div>
              <div class="timeline-content">
                <span class="timeline-num">Phase 03</span>
                <h3>Product Development</h3>
                <p>Our engineering team builds clean, highly performant solutions using clean code standards and scalable, future-ready architectures.</p>
              </div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-badge"></div>
              <div class="timeline-content">
                <span class="timeline-num">Phase 04</span>
                <h3>Quality Assurance</h3>
                <p>Conducting comprehensive automated testing, load verification, and security audits to guarantee flawless production deployments.</p>
              </div>
            </div>
            
            <div class="timeline-item">
              <div class="timeline-badge"></div>
              <div class="timeline-content">
                <span class="timeline-num">Phase 05</span>
                <h3>DevOps, Launch & Scale</h3>
                <p>Automating CI/CD pipelines, deploying to robust cloud systems, and setting up ongoing observability dashboards to support growth.</p>
              </div>
            </div>
          </div>

          ${ctaBand("See the difference for yourself", "Start a conversation with our team today.")}
        </div>`;

/* ---- Work ---- */
const quote = (init, body, name, role) => `<figure class="quote" data-reveal data-tilt data-spot>
            <div class="quote-mark" aria-hidden="true">&ldquo;</div>
            <blockquote>${body}</blockquote>
            <figcaption><span class="avatar" aria-hidden="true">${init}</span><span><strong>${name}</strong><span>${role}</span></span></figcaption>
          </figure>`;
const work = `        <div class="page container">
          ${pageHead("Case Studies", "Our Featured Work", "Real results and client success stories from teams who partnered with Aravosh.")}
          
          <div class="case-grid">
            <!-- Case 1 -->
            <article class="case-card" data-reveal>
              <div class="case-img-placeholder"></div>
              <div class="case-info">
                <div class="case-meta">
                  <span class="case-tag">Next.js</span>
                  <span class="case-tag">Go</span>
                  <span class="case-tag">AWS</span>
                </div>
                <h3>Northwind SaaS Platform</h3>
                <p>Rebuilding a legacy enterprise logistics portal into a high-performance web app with real-time tracking.</p>
                <div class="case-metrics">
                  <div class="metric-item">
                    <span class="metric-val">+112%</span>
                    <span class="metric-lbl">Conversion Rate</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-val">-45%</span>
                    <span class="metric-lbl">Page Load Time</span>
                  </div>
                </div>
              </div>
            </article>

            <!-- Case 2 -->
            <article class="case-card" data-reveal>
              <div class="case-img-placeholder"></div>
              <div class="case-info">
                <div class="case-meta">
                  <span class="case-tag">React Native</span>
                  <span class="case-tag">Node.js</span>
                  <span class="case-tag">Redis</span>
                </div>
                <h3>Vertex Mobile App</h3>
                <p>A cross-platform mobile fintech app enabling rapid cross-border remittances with low fees.</p>
                <div class="case-metrics">
                  <div class="metric-item">
                    <span class="metric-val">100k+</span>
                    <span class="metric-lbl">Active Users</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-val">4.9 ★</span>
                    <span class="metric-lbl">App Store Rating</span>
                  </div>
                </div>
              </div>
            </article>

            <!-- Case 3 -->
            <article class="case-card" data-reveal>
              <div class="case-img-placeholder"></div>
              <div class="case-info">
                <div class="case-meta">
                  <span class="case-tag">Figma</span>
                  <span class="case-tag">Design System</span>
                  <span class="case-tag">Growth</span>
                </div>
                <h3>Lumen Brand System</h3>
                <p>Complete visual rebranding and design system modernization, driving traffic and conversions.</p>
                <div class="case-metrics">
                  <div class="metric-item">
                    <span class="metric-val">3x</span>
                    <span class="metric-lbl">Traffic Growth</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-val">+50%</span>
                    <span class="metric-lbl">Brand Recall</span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div style="margin-top: 80px;">
            ${pageHead("Client Feedback", "What clients say")}
            <div class="grid grid-3">
              ${quote("MP", "Aravosh rebuilt our platform end to end and our conversions doubled within a quarter. A genuinely exceptional team.", "Maya Patel", "CEO, Northwind")}
              ${quote("JO", "They understood our vision instantly and delivered ahead of schedule. Communication was flawless throughout.", "James Okoro", "Founder, Vertex")}
              ${quote("SL", "The design work transformed how customers perceive our brand. We couldn't be happier with the partnership.", "Sofia Lindqvist", "CMO, Lumen")}
            </div>
          </div>
          ${trusted()}
          ${ctaBand("Become our next success story", "Tell us what you're building — we'd love to help.")}
        </div>`;

/* ---- Contact (with form) ---- */
const contact = `        <div class="page container">
          ${pageHead("Let's talk", "Tell us about your project", "Fill in our project discovery tool to estimate budget ranges and get in touch with our team.")}
          <div class="contact-grid">
            <aside class="contact-info" data-reveal>
              <div class="info-card">
                <h3>Get in touch</h3>
                <p>Prefer direct email? Reach our team and we'll reply within one business day.</p>
                <a href="mailto:${EMAIL}" class="email-link">${EMAIL}</a>
              </div>
              <ul class="info-list">
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg> A reply within one business day</li>
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg> A senior team member, not a bot</li>
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg> No obligation, no hard sell</li>
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
                        <button type="button" class="planner-option-btn" data-value="dev">
                          <span>Software Development</span>
                          <small>Web apps, mobile apps, SaaS systems</small>
                        </button>
                        <button type="button" class="planner-option-btn" data-value="design">
                          <span>Product Design &amp; UX</span>
                          <small>Wireframing, high-res UI design, prototyping</small>
                        </button>
                        <button type="button" class="planner-option-btn" data-value="cloud">
                          <span>Cloud &amp; DevOps</span>
                          <small>CI/CD pipelines, AWS infra setup, migrations</small>
                        </button>
                        <button type="button" class="planner-option-btn" data-value="strategy">
                          <span>Consulting &amp; Strategy</span>
                          <small>Tech guidance, roadmapping, scoping</small>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Step 2 -->
                    <div class="planner-panel" data-step="2">
                      <h4>What is the scale of the engagement?</h4>
                      <div class="planner-options">
                        <button type="button" class="planner-option-btn" data-value="mvp">
                          <span>MVP / Small Scale</span>
                          <small>Basic launch, single platform, essential features</small>
                        </button>
                        <button type="button" class="planner-option-btn" data-value="medium">
                          <span>Growth / Medium Scale</span>
                          <small>Multiple integrations, customized dashboards</small>
                        </button>
                        <button type="button" class="planner-option-btn" data-value="enterprise">
                          <span>Enterprise / Full Stack</span>
                          <small>Scalable systems, high security, advanced workflows</small>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Step 3 -->
                    <div class="planner-panel" data-step="3">
                      <h4>What is your target timeline?</h4>
                      <div class="planner-options">
                        <button type="button" class="planner-option-btn" data-value="fast">
                          <span>Fast-Track</span>
                          <small>Urgent launch, less than 1 month</small>
                        </button>
                        <button type="button" class="planner-option-btn" data-value="standard">
                          <span>Standard Delivery</span>
                          <small>Typical cycle, 2-3 months</small>
                        </button>
                        <button type="button" class="planner-option-btn" data-value="flexible">
                          <span>Flexible</span>
                          <small>Ongoing engagement, adaptive phases</small>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Step 4 -->
                    <div class="planner-panel" data-step="4">
                      <h4>Let's wrap up your request</h4>
                      <form id="contactForm" class="form" action="https://api.web3forms.com/submit" method="POST" novalidate>
                        <input type="hidden" name="access_key" value="WEB3FORMS_ACCESS_KEY" />
                        <input type="hidden" name="subject" value="New enquiry from the Aravosh website" />
                        <input type="hidden" name="from_name" value="Aravosh Website" />
                        <input type="hidden" id="plannerDetails" name="planner_details" value="" />
                        <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" />
                        
                        <div class="field">
                          <label for="name">Name <span class="req" aria-hidden="true">*</span></label>
                          <input id="name" name="name" type="text" autocomplete="name" required placeholder="Jane Doe" />
                        </div>
                        <div class="field">
                          <label for="email">Email <span class="req" aria-hidden="true">*</span></label>
                          <input id="email" name="email" type="email" autocomplete="email" required placeholder="jane@company.com" />
                        </div>
                        <div class="field">
                          <label for="message">Anything else we should know? <span class="req" aria-hidden="true">*</span></label>
                          <textarea id="message" name="message" rows="3" required placeholder="Add any details, questions, or notes here."></textarea>
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
                    
                    <div class="summary-price-box">
                      <span>Estimated Range</span>
                      <div class="summary-price" id="sumPrice">$0</div>
                    </div>
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
  { file: "index.html", slug: "index", active: "home", title: "Software, Design & Digital Growth", desc: "Aravosh is a technology and digital solutions company. We design, build and scale modern software, brand and growth for ambitious businesses.", main: home },
  { file: "services.html", slug: "services", active: "services", title: "Services", desc: "Software development, product design, brand, growth, cloud and strategy — end-to-end digital services from Aravosh.", main: services },
  { file: "about.html", slug: "about", active: "about", title: "About", desc: "Aravosh is a multidisciplinary team of engineers, designers and strategists invested in your success.", main: about },
  { file: "why.html", slug: "why", active: "why", title: "Why Us", desc: "Quality, predictable delivery, dedicated support and future-ready solutions — why clients choose Aravosh.", main: why },
  { file: "work.html", slug: "work", active: "work", title: "Work", desc: "Real results and client stories from teams who partnered with Aravosh.", main: work },
  { file: "contact.html", slug: "contact", active: "contact", title: "Contact", desc: "Tell us about your project. We reply within one business day at team@aravosh.com.", main: contact },
  { file: "privacy.html", slug: "privacy", active: "", title: "Privacy Policy", desc: "How Aravosh collects, uses and protects your information.", main: privacy },
  { file: "terms.html", slug: "terms", active: "", title: "Terms of Service", desc: "The terms that govern your use of the Aravosh website and services.", main: terms },
  { file: "404.html", slug: "404", active: "", title: "Page not found", desc: "The page you're looking for doesn't exist.", main: notfound, robots: "noindex" },
];

for (const p of PAGES) {
  writeFileSync(new URL("./" + p.file, import.meta.url), page(p));
  console.log("wrote", p.file);
}
console.log("Done — " + PAGES.length + " pages generated.");

/* Aravosh static site generator.
   Assembles consistent multi-page HTML (shared sidebar + shell) from the
   page definitions below. Output is plain static HTML committed to the repo.
   Run:  node build.mjs   */
import { writeFileSync } from "node:fs";

const SITE = "https://aravosh.vercel.app";
const EMAIL = "team@aravosh.com";

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

const page = ({ slug, active, title, desc, main, robots }) => {
  const url = SITE + (slug === "index" ? "/" : "/" + slug);
  const fullTitle = title + " — Aravosh";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${fullTitle}</title>
  <meta name="description" content="${desc}" />
  ${robots ? '<meta name="robots" content="' + robots + '" />\n  ' : ""}<link rel="canonical" href="${url}" />
  <meta name="theme-color" content="#0a0e17" />
  <meta name="color-scheme" content="dark" />

  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
  <link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png" />
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
  <link rel="manifest" href="/assets/site.webmanifest" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Aravosh" />
  <meta property="og:title" content="${fullTitle}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${SITE}/assets/og-image.png" />
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
  {"@context":"https://schema.org","@type":"Organization","name":"Aravosh","url":"${SITE}/","logo":"${SITE}/assets/logo.png","description":"Technology and digital solutions for ambitious businesses.","email":"${EMAIL}","contactPoint":{"@type":"ContactPoint","email":"${EMAIL}","contactType":"customer service"}}
  </script>
</head>
<body>
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

const card = (icon, title, body) => `<article class="card" data-reveal>
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

const trusted = () => `<section class="trusted" aria-label="Clients">
          <p class="trusted-label">Trusted by forward-thinking teams</p>
          <ul class="trusted-logos">
            <li>Northwind</li><li>Vertex</li><li>Lumen</li><li>Quanta</li><li>Helios</li>
          </ul>
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
          <div class="hero-bg" aria-hidden="true"><div class="hero-grid"></div><div class="hero-glow"></div></div>
          <div class="container hero-inner">
            <span class="eyebrow" data-reveal><span class="eyebrow-dot"></span> Digital solutions, engineered with care</span>
            <h1 data-reveal>We build technology that <span class="text-grad">moves your business forward.</span></h1>
            <p class="hero-sub" data-reveal>Aravosh partners with ambitious teams to design, build and scale modern digital products — from strategy and branding to software that performs.</p>
            <div class="hero-actions" data-reveal>
              <a href="/contact" class="btn btn-primary">Start a project <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${I.arrow}</svg></a>
              <a href="/services" class="btn btn-ghost">Explore services</a>
            </div>
            <dl class="hero-stats" data-reveal>
              <div class="stat"><dt>120+</dt><dd>Projects delivered</dd></div>
              <div class="stat"><dt>40+</dt><dd>Clients worldwide</dd></div>
              <div class="stat"><dt>9 yrs</dt><dd>Industry experience</dd></div>
              <div class="stat"><dt>98%</dt><dd>Client retention</dd></div>
            </dl>
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
          ${ctaBand("Have a project in mind?", "Let's talk about how we can help you build it.")}
        </div>`;

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
const feat = (n, t, b) => `<article class="feature" data-reveal><span class="feature-num">${n}</span><h3>${t}</h3><p>${b}</p></article>`;
const why = `        <div class="page container">
          ${pageHead("Why Aravosh", "Built on principles that deliver", "The reasons clients choose us — and stay with us.")}
          <div class="grid grid-4">
            ${feat("01", "Quality first", "Rigorous standards and testing baked into everything we ship.")}
            ${feat("02", "On time, on budget", "Predictable delivery with no surprises along the way.")}
            ${feat("03", "Dedicated support", "Responsive help whenever you need it, before and after launch.")}
            ${feat("04", "Future-ready", "Solutions architected to adapt as your business evolves.")}
          </div>
          ${ctaBand("See the difference for yourself", "Start a conversation with our team today.")}
        </div>`;

/* ---- Work ---- */
const quote = (init, body, name, role) => `<figure class="quote" data-reveal>
            <div class="quote-mark" aria-hidden="true">&ldquo;</div>
            <blockquote>${body}</blockquote>
            <figcaption><span class="avatar" aria-hidden="true">${init}</span><span><strong>${name}</strong><span>${role}</span></span></figcaption>
          </figure>`;
const work = `        <div class="page container">
          ${pageHead("What clients say", "Results that speak for themselves")}
          <div class="grid grid-3">
            ${quote("MP", "Aravosh rebuilt our platform end to end and our conversions doubled within a quarter. A genuinely exceptional team.", "Maya Patel", "CEO, Northwind")}
            ${quote("JO", "They understood our vision instantly and delivered ahead of schedule. Communication was flawless throughout.", "James Okoro", "Founder, Vertex")}
            ${quote("SL", "The design work transformed how customers perceive our brand. We couldn't be happier with the partnership.", "Sofia Lindqvist", "CMO, Lumen")}
          </div>
          ${trusted()}
          ${ctaBand("Become our next success story", "Tell us what you're building — we'd love to help.")}
        </div>`;

/* ---- Contact (with form) ---- */
const contact = `        <div class="page container">
          ${pageHead("Let's talk", "Tell us about your project", "Fill in the form and we'll get back to you within one business day.")}
          <div class="contact-grid">
            <aside class="contact-info" data-reveal>
              <div class="info-card">
                <h3>Get in touch</h3>
                <p>Prefer email? Reach our team directly and we'll reply within one business day.</p>
                <a href="mailto:${EMAIL}" class="email-link">${EMAIL}</a>
              </div>
              <ul class="info-list">
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg> A reply within one business day</li>
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg> A senior team member, not a bot</li>
                <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg> No obligation, no hard sell</li>
              </ul>
            </aside>
            <div class="contact-form-wrap" data-reveal>
              <form id="contactForm" class="form" action="https://api.web3forms.com/submit" method="POST" novalidate>
                <input type="hidden" name="access_key" value="WEB3FORMS_ACCESS_KEY" />
                <input type="hidden" name="subject" value="New enquiry from the Aravosh website" />
                <input type="hidden" name="from_name" value="Aravosh Website" />
                <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" />
                <div class="form-row">
                  <div class="field">
                    <label for="name">Name <span class="req" aria-hidden="true">*</span></label>
                    <input id="name" name="name" type="text" autocomplete="name" required placeholder="Jane Doe" />
                  </div>
                  <div class="field">
                    <label for="email">Email <span class="req" aria-hidden="true">*</span></label>
                    <input id="email" name="email" type="email" autocomplete="email" required placeholder="jane@company.com" />
                  </div>
                </div>
                <div class="form-row">
                  <div class="field">
                    <label for="company">Company</label>
                    <input id="company" name="company" type="text" autocomplete="organization" placeholder="Company Inc." />
                  </div>
                  <div class="field">
                    <label for="budget">Project type</label>
                    <select id="budget" name="project_type">
                      <option value="">Select one…</option>
                      <option>Software development</option>
                      <option>Product design / UX</option>
                      <option>Brand &amp; identity</option>
                      <option>Growth &amp; marketing</option>
                      <option>Cloud &amp; DevOps</option>
                      <option>Something else</option>
                    </select>
                  </div>
                </div>
                <div class="field">
                  <label for="message">Project details <span class="req" aria-hidden="true">*</span></label>
                  <textarea id="message" name="message" rows="5" required placeholder="Tell us a little about what you're building, your goals and timeline."></textarea>
                </div>
                <button type="submit" class="btn btn-primary btn-lg btn-block" id="formSubmit">
                  <span class="btn-label">Send message</span>
                  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${I.arrow}</svg>
                </button>
                <p class="form-note">By submitting you agree to our <a href="/privacy">Privacy Policy</a>.</p>
                <div class="form-status" id="formStatus" role="status" aria-live="polite"></div>
              </form>
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

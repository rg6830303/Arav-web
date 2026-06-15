(function () {
  "use strict";

  /* ---- Sidebar drawer (mobile) ---- */
  var toggle = document.getElementById("navToggle");
  var sidebar = document.getElementById("sidebar");
  var backdrop = document.getElementById("backdrop");

  if (toggle && sidebar) {
    var setOpen = function (open) {
      sidebar.classList.toggle("open", open);
      if (backdrop) {
        backdrop.classList.toggle("show", open);
        backdrop.hidden = !open;
      }
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", function () {
      setOpen(!sidebar.classList.contains("open"));
    });
    if (backdrop) backdrop.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
    // Reset when resizing up to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 980) setOpen(false);
    });
  }

  /* ---- Topbar elevation on scroll ---- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Scroll reveal (position based, never strands content) ---- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reveals.length || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var ticking = false;
    var reveal = function () {
      ticking = false;
      var trigger = window.innerHeight * 0.9;
      for (var i = reveals.length - 1; i >= 0; i--) {
        if (reveals[i].getBoundingClientRect().top < trigger) {
          reveals[i].classList.add("is-visible");
          reveals.splice(i, 1);
        }
      }
    };
    var schedule = function () { if (!ticking) { ticking = true; window.requestAnimationFrame(reveal); } };
    reveal();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("load", schedule);
  }

  /* ---- Contact form (Web3Forms) ---- */
  var form = document.getElementById("contactForm");
  if (form) {
    var statusEl = document.getElementById("formStatus");
    var submitBtn = document.getElementById("formSubmit");
    var label = submitBtn ? submitBtn.querySelector(".btn-label") : null;
    var keyField = form.querySelector('input[name="access_key"]');
    var MAILTO = "team@aravosh.com";

    var setStatus = function (type, html) {
      if (!statusEl) return;
      statusEl.className = "form-status show " + type;
      statusEl.innerHTML = html;
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot — silently ignore bots
      if (form.botcheck && form.botcheck.checked) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Guard: form backend not configured yet
      if (!keyField || keyField.value === "WEB3FORMS_ACCESS_KEY" || !keyField.value.trim()) {
        setStatus(
          "error",
          'The contact form isn’t connected yet. Please email us directly at ' +
            '<a href="mailto:' + MAILTO + '">' + MAILTO + "</a>."
        );
        return;
      }

      if (submitBtn) { submitBtn.disabled = true; }
      if (label) { label.textContent = "Sending…"; }
      setStatus("", "");
      if (statusEl) statusEl.className = "form-status";

      var data = Object.fromEntries(new FormData(form).entries());

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (res) { return res.json().then(function (j) { return { ok: res.ok, j: j }; }); })
        .then(function (r) {
          if (r.ok && r.j.success) {
            form.reset();
            setStatus("success", "Thanks for reaching out — we’ve received your message and will reply within one business day.");
          } else {
            throw new Error(r.j && r.j.message ? r.j.message : "Request failed");
          }
        })
        .catch(function () {
          setStatus(
            "error",
            'Something went wrong sending your message. Please email us directly at ' +
              '<a href="mailto:' + MAILTO + '">' + MAILTO + "</a>."
          );
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
          if (label) label.textContent = "Send message";
        });
    });
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

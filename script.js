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

  /* ---- Personalized greeting ---- */
  var greet = document.getElementById("greeting");
  if (greet) {
    var h = new Date().getHours();
    var part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    greet.textContent = part + " — let's build something great";
  }

  /* ---- Count-up stats ---- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute("data-count")) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduceMotion) { el.textContent = target + suffix; return; }
      var start = performance.now(), dur = 1400;
      var tick = function (now) {
        var t = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ("IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(runCount);
    }
  }

  if (!reduceMotion) {
    /* ---- 3D pointer tilt ---- */
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      var max = 9;
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        el.style.transform =
          "perspective(900px) rotateY(" + (px - 0.5) * 2 * max + "deg) rotateX(" +
          (0.5 - py) * 2 * max + "deg) translateZ(6px)";
        if (el.hasAttribute("data-spot")) {
          el.style.setProperty("--mx", px * 100 + "%");
          el.style.setProperty("--my", py * 100 + "%");
        }
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });

    /* ---- 3D scene + glow parallax ---- */
    var scene = document.getElementById("scene");
    var parallax = document.querySelectorAll("[data-parallax]");
    if (scene || parallax.length) {
      window.addEventListener("pointermove", function (e) {
        var nx = e.clientX / window.innerWidth - 0.5;
        var ny = e.clientY / window.innerHeight - 0.5;
        if (scene) {
          var s3d = scene.querySelector(".scene-3d");
          if (s3d) {
            s3d.style.setProperty("--rx", nx * 18 + "deg");
            s3d.style.setProperty("--ry", -ny * 18 + "deg");
          }
        }
        parallax.forEach(function (p) {
          var d = parseFloat(p.getAttribute("data-parallax")) || 0.03;
          p.style.transform = "translate(" + nx * d * 100 + "px," + ny * d * 100 + "px)";
        });
      }, { passive: true });
    }

    /* ---- Magnetic buttons ---- */
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.18 +
          "px," + (e.clientY - r.top - r.height / 2) * 0.28 + "px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });

    /* ---- Hero constellation canvas ---- */
    var canvas = document.getElementById("heroCanvas");
    if (canvas && canvas.getContext) {
      var ctx = canvas.getContext("2d");
      var w, hgt, pts = [], raf = null;
      var DPR = Math.min(window.devicePixelRatio || 1, 2);
      var resize = function () {
        var host = canvas.parentElement;
        w = host.offsetWidth; hgt = host.offsetHeight;
        canvas.width = w * DPR; canvas.height = hgt * DPR;
        canvas.style.width = w + "px"; canvas.style.height = hgt + "px";
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        var count = Math.min(64, Math.round(w / 22));
        pts = [];
        for (var i = 0; i < count; i++) {
          pts.push({ x: Math.random() * w, y: Math.random() * hgt,
            vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28 });
        }
      };
      var draw = function () {
        ctx.clearRect(0, 0, w, hgt);
        for (var i = 0; i < pts.length; i++) {
          var p = pts[i];
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > hgt) p.vy *= -1;
          for (var j = i + 1; j < pts.length; j++) {
            var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, dist = dx * dx + dy * dy;
            if (dist < 13000) {
              ctx.strokeStyle = "rgba(23,214,198," + (1 - dist / 13000) * 0.16 + ")";
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
            }
          }
          ctx.fillStyle = "rgba(108,139,255,0.55)";
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); ctx.fill();
        }
        raf = requestAnimationFrame(draw);
      };
      resize(); draw();
      window.addEventListener("resize", resize);
      // Pause when scrolled away to save battery
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (e) {
          if (e[0].isIntersecting) { if (!raf) draw(); }
          else if (raf) { cancelAnimationFrame(raf); raf = null; }
        }).observe(canvas);
      }
    }
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

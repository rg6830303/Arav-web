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

  /* ---- Scroll progress bar ---- */
  var progress = document.getElementById("progress");
  if (progress) {
    var updateProgress = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
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

    /* ---- 3D scene + glow parallax + hero spotlight ---- */
    var scene = document.getElementById("scene");
    var parallax = document.querySelectorAll("[data-parallax]");
    var heroEl = document.querySelector(".hero");
    var heroSpot = document.getElementById("heroSpot");
    var s3d = scene ? scene.querySelector(".scene-3d") : null;
    window.addEventListener("pointermove", function (e) {
      var nx = e.clientX / window.innerWidth - 0.5;
      var ny = e.clientY / window.innerHeight - 0.5;
      if (s3d) {
        s3d.style.setProperty("--rx", nx * 16 + "deg");
        s3d.style.setProperty("--ry", -ny * 16 + "deg");
      }
      parallax.forEach(function (p) {
        var d = parseFloat(p.getAttribute("data-parallax")) || 0.03;
        p.style.transform = "translate(" + nx * d * 100 + "px," + ny * d * 100 + "px)";
      });
      if (heroEl && heroSpot) {
        var r = heroEl.getBoundingClientRect();
        heroSpot.style.setProperty("--cx", e.clientX - r.left + "px");
        heroSpot.style.setProperty("--cy", e.clientY - r.top + "px");
      }
    }, { passive: true });

    /* ---- Magnetic buttons ---- */
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.18 +
          "px," + (e.clientY - r.top - r.height / 2) * 0.28 + "px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });

    /* ---- 3D particle sphere ---- */
    var orb = document.getElementById("orbCanvas");
    if (orb && orb.getContext) {
      var octx = orb.getContext("2d");
      var DPR = Math.min(window.devicePixelRatio || 1, 2);
      var ow, oh, R, N = 320, sph = [], raf = null, t = 0, tgX = 0, tgY = 0, rotX = -0.35, rotY = 0;

      var build = function () {
        var host = orb.parentElement;
        ow = host.offsetWidth; oh = host.offsetHeight;
        orb.width = ow * DPR; orb.height = oh * DPR;
        orb.style.width = ow + "px"; orb.style.height = oh + "px";
        octx.setTransform(DPR, 0, 0, DPR, 0, 0);
        R = Math.min(ow, oh) * 0.40;
        sph = [];
        var golden = Math.PI * (3 - Math.sqrt(5));
        for (var i = 0; i < N; i++) {
          var y = 1 - (i / (N - 1)) * 2;
          var rad = Math.sqrt(1 - y * y);
          var th = golden * i;
          sph.push({ x: Math.cos(th) * rad, y: y, z: Math.sin(th) * rad });
        }
      };

      // mouse influence on rotation target
      orb.parentElement.addEventListener("pointermove", function (e) {
        var r = orb.getBoundingClientRect();
        tgY = ((e.clientX - r.left) / r.width - 0.5) * 1.2;
        tgX = ((e.clientY - r.top) / r.height - 0.5) * -1.0;
      });

      var draw = function () {
        t += 0.0022;
        rotY += (tgY - rotY) * 0.05 + 0.004;
        rotX += (tgX - 0.35 - rotX) * 0.05;
        octx.clearRect(0, 0, ow, oh);
        var cx = ow / 2, cy = oh / 2;
        var cosY = Math.cos(rotY), sinY = Math.sin(rotY), cosX = Math.cos(rotX), sinX = Math.sin(rotX);
        var proj = [];
        for (var i = 0; i < sph.length; i++) {
          var p = sph[i];
          var x1 = p.x * cosY - p.z * sinY;
          var z1 = p.x * sinY + p.z * cosY;
          var y1 = p.y * cosX - z1 * sinX;
          var z2 = p.y * sinX + z1 * cosX;
          var depth = (z2 + 1) / 2; // 0..1
          proj.push({ sx: cx + x1 * R, sy: cy + y1 * R, d: depth });
        }
        // connections (subtle), only near + front
        for (var a = 0; a < proj.length; a += 1) {
          for (var bn = a + 1; bn < a + 5 && bn < proj.length; bn++) {
            var pa = proj[a], pb = proj[bn];
            var dx = pa.sx - pb.sx, dy = pa.sy - pb.sy;
            if (dx * dx + dy * dy < 1600) {
              octx.strokeStyle = "rgba(23,214,198," + 0.10 * ((pa.d + pb.d) / 2) + ")";
              octx.lineWidth = 1;
              octx.beginPath(); octx.moveTo(pa.sx, pa.sy); octx.lineTo(pb.sx, pb.sy); octx.stroke();
            }
          }
        }
        // points, painter's order
        proj.sort(function (m, n) { return m.d - n.d; });
        for (var k = 0; k < proj.length; k++) {
          var q = proj[k];
          var rr = 0.6 + q.d * 2.2;
          var mix = q.d;
          var col = "rgba(" + Math.round(23 + mix * 85) + "," + Math.round(214 - mix * 75) + "," + Math.round(198 + mix * 57) + "," + (0.25 + q.d * 0.75) + ")";
          octx.fillStyle = col;
          octx.beginPath(); octx.arc(q.sx, q.sy, rr, 0, Math.PI * 2); octx.fill();
        }
        raf = requestAnimationFrame(draw);
      };

      build(); draw();
      window.addEventListener("resize", build);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (e) {
          if (e[0].isIntersecting) { if (!raf) draw(); }
          else if (raf) { cancelAnimationFrame(raf); raf = null; }
        }).observe(orb);
      }
    }
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

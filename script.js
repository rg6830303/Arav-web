(function () {
  "use strict";

  /* ---- Mobile navigation ---- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  if (toggle && links) {
    var setOpen = function (open) {
      links.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", function () {
      setOpen(!links.classList.contains("open"));
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ---- Header elevation on scroll ---- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Scroll reveal ----
     Scroll-position based so an element ALWAYS reveals once it is within
     reach of the viewport — content can never get stuck hidden. */
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
        var el = reveals[i];
        if (el.getBoundingClientRect().top < trigger) {
          el.classList.add("is-visible");
          reveals.splice(i, 1);
        }
      }
    };
    var schedule = function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(reveal); }
    };
    reveal(); // reveal whatever is in view on load
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("load", schedule);
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

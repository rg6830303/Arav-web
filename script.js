(function () {
  "use strict";

  /* ---- Sidebar drawer (mobile), with focus management ---- */
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
      if (open) {
        var firstLink = sidebar.querySelector("a, button");
        if (firstLink) firstLink.focus();
      } else {
        toggle.focus();
      }
    };
    toggle.addEventListener("click", function () {
      setOpen(!sidebar.classList.contains("open"));
    });
    if (backdrop) backdrop.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sidebar.classList.contains("open")) setOpen(false);
    });
    // Keep focus inside the drawer while it's open on mobile
    sidebar.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !sidebar.classList.contains("open")) return;
      var focusable = Array.prototype.slice.call(
        sidebar.querySelectorAll("a[href], button:not([disabled])")
      );
      if (!focusable.length) return;
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
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

  /* ---- Contact form (Web3Forms) ---- */
  var form = document.getElementById("contactForm");
  if (form) {
    var statusEl = document.getElementById("formStatus");
    var submitBtn = document.getElementById("plannerSubmit") || document.getElementById("formSubmit");
    var label = submitBtn ? submitBtn.querySelector(".btn-label") : null;
    var keyField = form.querySelector('input[name="access_key"]');
    var MAILTO = "team@aravosh.com";

    var setStatus = function (type, html) {
      if (!statusEl) return;
      statusEl.className = "form-status show " + type;
      statusEl.innerHTML = html;
    };

    // Inline, field-level validation so errors are clearly communicated
    var setFieldError = function (input, on) {
      var field = input.closest(".field");
      var err = document.getElementById("err-" + input.id);
      if (field) field.classList.toggle("invalid", on);
      if (err) err.classList.toggle("show", on);
      input.setAttribute("aria-invalid", on ? "true" : "false");
    };
    var validateField = function (input) {
      var ok = input.checkValidity() && input.value.trim() !== "";
      setFieldError(input, !ok);
      return ok;
    };
    var requiredFields = Array.prototype.slice.call(form.querySelectorAll("[required]"));
    requiredFields.forEach(function (input) {
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") validateField(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot — silently ignore bots
      if (form.botcheck && form.botcheck.checked) return;

      var firstBad = null;
      requiredFields.forEach(function (input) {
        if (!validateField(input) && !firstBad) firstBad = input;
      });
      if (firstBad) {
        setStatus("error", "Please fix the highlighted fields and try again.");
        firstBad.focus();
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
            setStatus("success", "Thanks for reaching out. We received your message and will follow up with a practical next step.");
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
          if (label) label.textContent = "Submit Inquiry";
        });
    });
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

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Tech Stack Filter ---- */
  var techTabs = document.querySelectorAll(".tech-tab");
  var techCards = document.querySelectorAll(".tech-card");
  if (techTabs.length && techCards.length) {
    techTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var cat = tab.getAttribute("data-category");
        techTabs.forEach(function (t) {
          t.classList.remove("active");
          t.setAttribute("aria-pressed", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-pressed", "true");

        techCards.forEach(function (card) {
          var cardCats = card.getAttribute("data-category").split(" ");
          if (cat === "all" || cardCats.indexOf(cat) !== -1) {
            card.classList.remove("hidden");
          } else {
            card.classList.add("hidden");
          }
        });
      });
    });
  }

  /* ---- Process scroll-triggered timeline (communicates progress through phases) ---- */
  var timelineContainer = document.querySelector(".timeline-container");
  var timelineItems = document.querySelectorAll(".timeline-item");
  var timelineLineFilled = document.querySelector(".timeline-line-filled");
  if (timelineContainer && timelineItems.length && timelineLineFilled) {
    var updateTimeline = function () {
      var containerRect = timelineContainer.getBoundingClientRect();
      var viewportHeight = window.innerHeight;
      var triggerPoint = viewportHeight * 0.65;
      var relativeScroll = triggerPoint - containerRect.top;
      var progressPercent = (relativeScroll / containerRect.height) * 100;
      progressPercent = Math.max(0, Math.min(100, progressPercent));
      timelineLineFilled.style.height = progressPercent + "%";

      timelineItems.forEach(function (item) {
        var itemRect = item.getBoundingClientRect();
        if (itemRect.top < triggerPoint) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    };
    updateTimeline();
    window.addEventListener("scroll", updateTimeline, { passive: true });
    window.addEventListener("resize", updateTimeline, { passive: true });
  }

  /* ---- Interactive Project Planner ---- */
  var planner = document.getElementById("projectPlanner");
  if (planner) {
    var currentStep = 1;
    var totalSteps = 4;

    var selectedService = "";
    var selectedScale = "";
    var selectedTimeline = "";

    var panels = planner.querySelectorAll(".planner-panel");
    var dots = planner.querySelectorAll(".planner-step-dot");

    var btnBack = document.getElementById("plannerBack");
    var btnNext = document.getElementById("plannerNext");
    var btnSubmit = document.getElementById("plannerSubmit");
    var stepError = document.getElementById("plannerStepError");

    var sumService = document.getElementById("sumService");
    var sumScale = document.getElementById("sumScale");
    var sumTimeline = document.getElementById("sumTimeline");

    var plannerDetailsInput = document.getElementById("plannerDetails");
    var contactMessageInput = document.getElementById("message");

    var showStepError = function (message) {
      if (!stepError) return;
      stepError.textContent = message;
      stepError.classList.add("show");
    };
    var clearStepError = function () {
      if (!stepError) return;
      stepError.textContent = "";
      stepError.classList.remove("show");
    };

    var optionButtons = planner.querySelectorAll(".planner-option-btn");
    optionButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var step = btn.parentElement.parentElement.getAttribute("data-step");
        var value = btn.getAttribute("data-value");
        var display = btn.querySelector("span").textContent;

        var siblingButtons = btn.parentElement.querySelectorAll(".planner-option-btn");
        siblingButtons.forEach(function (b) {
          b.classList.remove("selected");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("selected");
        btn.setAttribute("aria-pressed", "true");

        if (step === "1") {
          selectedService = value;
          sumService.textContent = display;
        } else if (step === "2") {
          selectedScale = value;
          sumScale.textContent = display;
        } else if (step === "3") {
          selectedTimeline = value;
          sumTimeline.textContent = display;
        }

        clearStepError();
        syncPlannerDetails();
      });
    });

    var syncPlannerDetails = function () {
      if (plannerDetailsInput) {
        plannerDetailsInput.value =
          "Planner Summary:\n" +
          "- Service: " + sumService.textContent + "\n" +
          "- Scale: " + sumScale.textContent + "\n" +
          "- Timeline: " + sumTimeline.textContent;
      }
    };

    var updateStepUI = function () {
      panels.forEach(function (panel) {
        var stepNum = parseInt(panel.getAttribute("data-step"));
        panel.classList.toggle("active", stepNum === currentStep);
      });

      dots.forEach(function (dot) {
        var dotNum = parseInt(dot.getAttribute("data-dot"));
        dot.className = "planner-step-dot";
        if (dotNum === currentStep) dot.classList.add("active");
        else if (dotNum < currentStep) dot.classList.add("completed");
      });

      btnBack.style.visibility = currentStep === 1 ? "hidden" : "visible";

      if (currentStep === totalSteps) {
        btnNext.style.display = "none";
        btnSubmit.style.display = "inline-flex";
      } else {
        btnNext.style.display = "inline-flex";
        btnSubmit.style.display = "none";
      }
    };

    var validateStep = function () {
      if (currentStep === 1 && !selectedService) {
        showStepError("Please select a project type to continue.");
        return false;
      }
      if (currentStep === 2 && !selectedScale) {
        showStepError("Please select the scale of your project.");
        return false;
      }
      if (currentStep === 3 && !selectedTimeline) {
        showStepError("Please select your project timeline.");
        return false;
      }
      return true;
    };

    btnNext.addEventListener("click", function () {
      if (validateStep()) {
        clearStepError();
        currentStep++;
        updateStepUI();
      }
    });

    btnBack.addEventListener("click", function () {
      if (currentStep > 1) {
        clearStepError();
        currentStep--;
        updateStepUI();
      }
    });

    var contactForm = document.getElementById("contactForm");
    if (contactForm && contactMessageInput && plannerDetailsInput) {
      contactForm.addEventListener("submit", function () {
        if (plannerDetailsInput.value) {
          var origMsg = contactMessageInput.value;
          var divider = "\n\n=================================\n";
          contactMessageInput.value = origMsg + divider + plannerDetailsInput.value;
        }
      });
    }

    updateStepUI();
  }
})();

(function () {
  "use strict";

  /* ---------- loader ---------- */
  window.addEventListener("load", function () {
    setTimeout(function () {
      var l = document.getElementById("loader");
      if (l) l.classList.add("is-done");
    }, 500);
  });

  /* ---------- nav: sticky, burger, progress, active link ---------- */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");
  var progress = document.getElementById("progress");
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () {
    setMenu(!nav.classList.contains("is-open"));
  });
  navLinks.addEventListener("click", function (e) {
    if (e.target.closest(".nav__link")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) setMenu(false);
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 860 && nav.classList.contains("is-open")) setMenu(false);
  });

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle("is-stuck", y > 40);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* active section highlight */
  var sections = ["home", "gallery", "services", "about", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      links.forEach(function (a) {
        a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id);
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(function (s) { navObserver.observe(s); });

  /* ---------- reveal on scroll ---------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (en, i) {
      if (en.isIntersecting) {
        en.target.style.transitionDelay = Math.min(i * 70, 350) + "ms";
        en.target.classList.add("is-in");
        revealObserver.unobserve(en.target);
      }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll(".reveal").forEach(function (el) { revealObserver.observe(el); });

  /* ---------- counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var start = performance.now();
      (function tick(now) {
        var p = Math.min((now - start) / 1400, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + (p === 1 ? "+" : "");
        if (p < 1) requestAnimationFrame(tick);
      })(start);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { countObserver.observe(c); });

  /* ---------- gallery filter ---------- */
  var chips = document.querySelectorAll(".chip");
  var cards = Array.prototype.slice.call(document.querySelectorAll("#grid .card"));
  var moreBtn = document.getElementById("galleryMoreBtn");
  var showAll = false;
  var INITIAL_COUNT = 8;

  function updateGallery() {
    /* FIX: no .chip elements in the HTML -> default to "all" instead of crashing */
    var activeChip = document.querySelector(".chip.is-active");
    var f = activeChip ? activeChip.getAttribute("data-filter") : "all";
    var visible = cards.filter(function (c) { return f === "all" || c.getAttribute("data-cat") === f; });

    cards.forEach(function (card) {
      var match = f === "all" || card.getAttribute("data-cat") === f;
      var pos = visible.indexOf(card);
      var show = match && (showAll || pos < INITIAL_COUNT);

      card.classList.toggle("is-hidden", !show);
      if (show) {
        card.classList.remove("is-in");
        requestAnimationFrame(function () { card.classList.add("is-in"); });
      }
    });

    if (moreBtn) {
      moreBtn.style.display = visible.length > INITIAL_COUNT ? "inline-block" : "none";
      moreBtn.textContent = showAll ? "Show Less" : "Explore More";
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("is-active"); });
      chip.classList.add("is-active");
      showAll = false;
      updateGallery();
    });
  });
  if (moreBtn) {
    moreBtn.addEventListener("click", function () {
      showAll = !showAll;
      updateGallery();
    });
  }

  updateGallery();

  /* ---------- lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  cards.forEach(function (card) {
    card.addEventListener("click", function () { openLightbox(card.getAttribute("data-img")); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(card.getAttribute("data-img")); }
    });
  });
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });

  /* ---------- cursor glow (pointer devices only) ---------- */
  if (window.matchMedia("(pointer:fine)").matches) {
    document.body.classList.add("has-pointer");
    var glow = document.getElementById("cursorGlow");
    var gx = 0, gy = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", function (e) { gx = e.clientX; gy = e.clientY; });
    (function loop() {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- parallax hero ---------- */
  var heroMedia = document.querySelector(".hero__media img");
  if (heroMedia && !window.matchMedia("(prefers-reduced-motion:reduce)").matches) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) heroMedia.style.translate = "0 " + y * 0.15 + "px";
    }, { passive: true });
  }


  /* ---------- contact form ---------- */

  var form = document.getElementById("form");
  var note = document.getElementById("formNote");

  /* Prevent past event dates */

  var today = new Date();
  var year = today.getFullYear();
  var month = String(today.getMonth() + 1).padStart(2, "0");
  var day = String(today.getDate()).padStart(2, "0");
  var todayDate = year + "-" + month + "-" + day;

  var eventDate = document.getElementById("eventDate");

  if (eventDate) {
    eventDate.setAttribute("min", todayDate);
  }

  /* send a form with fetch (no page reload), show message, reset on success */
  function sendForm(f, noteEl, onSuccess) {
    var btn = f.querySelector('button[type="submit"]');
    var label = btn ? btn.textContent : "";
    var csrf = f.querySelector("[name=csrfmiddlewaretoken]");

    if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }
    noteEl.className = "form__note";
    noteEl.textContent = "";

    fetch(f.action, {
      method: "POST",
      body: new FormData(f),
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": csrf ? csrf.value : ""
      }
    })
      .then(function (r) {
        return r.json().catch(function () {
          return { ok: false, message: "Something went wrong. Please try again." };
        });
      })
      .then(function (d) {
        if (d.ok) {
          f.reset();
          Array.prototype.forEach.call(f.querySelectorAll(".is-error"), function (el) { el.classList.remove("is-error"); });
          noteEl.classList.add("is-success");
          noteEl.textContent = d.message;
          if (onSuccess) onSuccess();
        } else {
          noteEl.classList.add("is-error");
          noteEl.textContent = d.message || "Could not send. Please check the form.";
        }
      })
      .catch(function () {
        noteEl.classList.add("is-error");
        noteEl.textContent = "Network error. Please check your connection and try again.";
      })
      .then(function () {
        if (btn) { btn.disabled = false; btn.textContent = label; }
      });
  }

  /* message counter (max 60) */
  var msgBox = document.getElementById("message");
  var msgCount = document.getElementById("messageCount");
  function updateCount() {
    if (!msgBox || !msgCount) return;
    var n = msgBox.value.length;
    msgCount.textContent = n + "/60";
    msgCount.classList.toggle("is-limit", n >= 60);
  }
  if (msgBox) {
    msgBox.addEventListener("input", updateCount);
    if (form) form.addEventListener("reset", function () { setTimeout(updateCount, 0); });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      var ok = true;

      ["name", "email", "contact", "event", "eventDate", "message"].forEach(function (id) {
        var input = document.getElementById(id);
        if (!input) return;

        var valid = input.value.trim() !== "" &&
          (id !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) && (id !== "contact" || /^[0-9]{10}$/.test(input.value.trim())) &&
          (id !== "message" || input.value.trim().length <= 60);

        input.parentElement.classList.toggle("is-error", !valid);

        if (!valid) ok = false;
      });

      e.preventDefault();
      if (!ok) {
        note.className = "form__note is-error";
        note.textContent = "Please fill in all fields: valid email, 10-digit contact number, message up to 60 characters.";
        return;
      }
      sendForm(form, note, function () {
        setTimeout(function () { note.className = "form__note"; note.textContent = ""; }, 8000);
      });
    });
  }

  /* ---------- services slider ---------- */
  var serviceWrap = document.querySelector(".services__row-wrap");
  var serviceRow = document.querySelector(".services__row");
  var serviceCards = Array.prototype.slice.call(document.querySelectorAll(".services__row .service-card"));
  var servicesPrev = document.getElementById("servicesPrev");
  var servicesNext = document.getElementById("servicesNext");

  if (serviceWrap && serviceRow && serviceCards.length) {
    var AUTOSCROLL_INTERVAL = 3500;
    var current = Math.max(0, serviceCards.indexOf(serviceRow.querySelector('[data-default="true"]')));
    var autoTimer = null, hovering = false, inView = true, userTouched = false, settleTimer = null;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

    function setActive(i, scroll) {
      current = (i + serviceCards.length) % serviceCards.length;
      serviceCards.forEach(function (c, idx) { c.classList.toggle("is-active", idx === current); });
      if (scroll) {
        userTouched = false;
        serviceRow.scrollTo({ left: serviceCards[current].offsetLeft, behavior: "smooth" });
      }
    }

    function startAuto() {
      stopAuto();
      if (reduceMotion) return;
      autoTimer = setInterval(function () {
        if (hovering || !inView || document.hidden) return;
        setActive(current + 1, true);
      }, AUTOSCROLL_INTERVAL);
    }
    function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }

    /* hover (mouse) + tap/click */
    serviceCards.forEach(function (card, idx) {
      card.addEventListener("mouseenter", function () { hovering = true; setActive(idx, false); });
      card.addEventListener("click", function () { if (idx !== current) setActive(idx, false); });
    });
    serviceWrap.addEventListener("mouseleave", function () { hovering = false; });

    /* arrows */
    if (servicesPrev) servicesPrev.addEventListener("click", function () { setActive(current - 1, true); startAuto(); });
    if (servicesNext) servicesNext.addEventListener("click", function () { setActive(current + 1, true); startAuto(); });

    /* touch swipe: pause, then activate the card that settles at the left edge */
    serviceRow.addEventListener("touchstart", function () { userTouched = true; stopAuto(); }, { passive: true });
    serviceRow.addEventListener("touchend", function () { setTimeout(startAuto, 4000); }, { passive: true });
    serviceRow.addEventListener("scroll", function () {
      if (!userTouched) return;
      clearTimeout(settleTimer);
      settleTimer = setTimeout(function () {
        var max = serviceRow.scrollWidth - serviceRow.clientWidth;
        var left = serviceRow.scrollLeft, best = 0, bestDist = Infinity;
        if (left >= max - 2) { best = serviceCards.length - 1; }
        else {
          serviceCards.forEach(function (c, i) {
            var d = Math.abs(c.offsetLeft - left);
            if (d < bestDist) { bestDist = d; best = i; }
          });
        }
        setActive(best, false);
      }, 120);
    }, { passive: true });

    /* only autoscroll while section is visible */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { inView = en[0].isIntersecting; }, { threshold: 0.25 }).observe(serviceWrap);
    }

    setActive(current, false);
    startAuto();
  }


  /* ---------- booking modal (Book Event) ---------- */
  var bookingModal = document.getElementById("bookingModal");
  var bookingClose = document.getElementById("bookingClose");
  var bookingForm = document.getElementById("bookingForm");
  var bookingNote = document.getElementById("bookingNote");
  var navBookBtn = document.getElementById("navBookBtn");
  var aboutBookBtn = document.getElementById("aboutBookBtn");
  var backToTop = document.getElementById("backToTop");

  function openBooking(eventType) {
    bookingModal.classList.add("is-open");
    bookingModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (eventType) {
      var sel = document.getElementById("bookEventType");
      if (sel) sel.value = eventType;
    }
  }

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function closeBooking() {
    bookingModal.classList.remove("is-open");
    bookingModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (navBookBtn) {
    navBookBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openBooking();
    });
  }

  var navBookBtnMenu = document.getElementById("navBookBtnMenu");
  if (navBookBtnMenu) {
    navBookBtnMenu.addEventListener("click", function (e) {
      e.preventDefault();
      setMenu(false);
      openBooking();
    });
  }

  if (aboutBookBtn) {
    aboutBookBtn.addEventListener("click", function () {
      openBooking();
    });
  }

  document.querySelectorAll(".service-card__book").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      openBooking(btn.getAttribute("data-event"));
    });
  });

  if (bookingClose) {
    bookingClose.addEventListener("click", closeBooking);
  }

  if (bookingModal) {
    bookingModal.addEventListener("click", function (e) {
      if (e.target === bookingModal) closeBooking();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeBooking();
  });

  /* ---------- prevent past booking dates ---------- */

  var bookDate = document.getElementById("bookDate");

  if (bookDate) {
    bookDate.setAttribute("min", todayDate);
  }

  /* ---------- booking form validation ---------- */

  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      var ok = true;

      ["bookName", "bookContact", "bookEventType", "bookDate"].forEach(function (id) {
        var input = document.getElementById(id);
        if (!input) return;

        var valid = input.value.trim() !== "" &&
          (id !== "bookContact" || /^[0-9]{10}$/.test(input.value.trim()));

        input.parentElement.classList.toggle("is-error", !valid);

        if (!valid) ok = false;
      });

      e.preventDefault();
      if (!ok) {
        bookingNote.className = "form__note is-error";
        bookingNote.textContent = "Please fill in your name, a 10-digit contact number, event type, and preferred date.";
        return;
      }
      sendForm(bookingForm, bookingNote, function () {
        setTimeout(function () {
          closeBooking();
          bookingNote.className = "form__note";
          bookingNote.textContent = "";
        }, 2500);
      });
    });
  }

  (function () {
  var nav = document.getElementById("nav");
  var logo = document.getElementById("navLogo");
  if (!nav || !logo) return;
  var onDark = logo.getAttribute("data-ondark");
  var onGold = logo.getAttribute("data-ongold");
  [onDark, onGold].forEach(function (s) { new Image().src = s; });
  function sync() {
    var gold = nav.classList.contains("is-stuck") && !nav.classList.contains("is-open");
    var want = gold ? onGold : onDark;
    if (logo.getAttribute("src") !== want) logo.setAttribute("src", want);
  }
  new MutationObserver(sync).observe(nav, { attributes: true, attributeFilter: ["class"] });
  sync();
})();

})();
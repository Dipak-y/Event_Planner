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

  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });
  navLinks.addEventListener("click", function (e) {
    if (e.target.closest(".nav__link")) {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
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
var chips=document.querySelectorAll(".chip"),cards=Array.prototype.slice.call(document.querySelectorAll("#grid .card")),moreBtn=document.getElementById("galleryMoreBtn"),showAll=false;
var INITIAL_COUNT=8;

function updateGallery(){
  var f=document.querySelector(".chip.is-active").getAttribute("data-filter"),
      visible=cards.filter(function(c){return f==="all"||c.getAttribute("data-cat")===f;});

  cards.forEach(function(card){
    var match=f==="all"||card.getAttribute("data-cat")===f;
    var pos=visible.indexOf(card);
    var show=match&&(showAll||pos<INITIAL_COUNT);

    card.classList.toggle("is-hidden",!show);
    if(show){
      card.classList.remove("is-in");
      requestAnimationFrame(function(){card.classList.add("is-in");});
    }
  });

  moreBtn.style.display=visible.length>INITIAL_COUNT?"inline-block":"none";
  moreBtn.textContent=showAll?"Show Less":"Explore More";
}

chips.forEach(function(chip){
  chip.addEventListener("click",function(){
    chips.forEach(function(c){c.classList.remove("is-active");});
    chip.classList.add("is-active");
    showAll=false;
    updateGallery();
  });
});
moreBtn.addEventListener("click",function(){
  showAll=!showAll;
  updateGallery();
});

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

if (form) {
  form.addEventListener("submit", function (e) {
    var ok = true;

    ["name", "email", "contact", "event", "eventDate", "message"].forEach(function (id) {
      var input = document.getElementById(id);
      if (!input) return;

      var valid = input.value.trim() !== "" &&
        (id !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) && (id !== "contact" || /^[0-9]{10}$/.test(input.value.trim()));

      input.parentElement.classList.toggle("is-error", !valid);

      if (!valid) ok = false;
    });

    if (!ok) {
      e.preventDefault();
      note.textContent = "Please fill in all required fields with a valid email.";
    }
  });
}

   /* ---------- services slider ---------- */
  var serviceWrap=document.querySelector(".services__row-wrap"),serviceRow=document.querySelector(".services__row"),serviceCards=Array.prototype.slice.call(document.querySelectorAll(".services__row .service-card"));
  var servicesPrev=document.getElementById("servicesPrev"),servicesNext=document.getElementById("servicesNext");
  var defaultServiceCard=serviceRow.querySelector('[data-default="true"]')||serviceCards[0];
  function setActiveService(card){serviceCards.forEach(function(c){c.classList.toggle("is-active",c===card);});}
  serviceCards.forEach(function(card){card.addEventListener("mouseenter",function(){setActiveService(card);});});
  serviceWrap.addEventListener("mouseleave",function(){setActiveService(null);});

  function scrollByCard(dir) {
    var card = serviceRow.querySelector(".service-card");
    var amount = (card ? card.getBoundingClientRect().width : 260) + 16;
    var maxScroll = serviceRow.scrollWidth - serviceRow.clientWidth;

    if (dir > 0 && serviceRow.scrollLeft >= maxScroll - 1) {
      serviceRow.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    if (dir < 0 && serviceRow.scrollLeft <= 1) {
      serviceRow.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }
    serviceRow.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  if (servicesPrev && servicesNext) {
    servicesPrev.addEventListener("click", function () { scrollByCard(-1); });
    servicesNext.addEventListener("click", function () { scrollByCard(1); });
  }

  /* ---------- services autoscroll (loops forever, pauses on hover) ---------- */
  var AUTOSCROLL_INTERVAL = 2000;
  var autoScrollTimer = null;

  function startAutoScroll() {
    stopAutoScroll();
    autoScrollTimer = setInterval(function () { scrollByCard(1); }, AUTOSCROLL_INTERVAL);
  }
  function stopAutoScroll() {
    if (autoScrollTimer) { clearInterval(autoScrollTimer); autoScrollTimer = null; }
  }

  serviceWrap.addEventListener("mouseenter", stopAutoScroll);
  serviceWrap.addEventListener("mouseleave", startAutoScroll);
  serviceRow.addEventListener("touchstart", stopAutoScroll, { passive: true });
  serviceRow.addEventListener("touchend", startAutoScroll, { passive: true });

  if (!window.matchMedia("(prefers-reduced-motion:reduce)").matches) {
    startAutoScroll();
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
  navBookBtn.addEventListener("click", function () {
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

var today = new Date();
var year = today.getFullYear();
var month = String(today.getMonth() + 1).padStart(2, "0");
var day = String(today.getDate()).padStart(2, "0");
var todayDate = year + "-" + month + "-" + day;

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

    if (!ok) {
      e.preventDefault();
      bookingNote.textContent = "Please fill in your name, contact number, event type, and preferred date.";
    }
  });
}


})();
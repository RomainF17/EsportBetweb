/* ═══════════════════════════════════════════════════════════════════
   RANKRUSH — APP.JS v2
   Approche : gsap.from() — le contenu est visible par défaut.
   Les animations sont progressives et non bloquantes.
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── SMOOTH SCROLL (LENIS) ───
  let lenis;
  try {
    lenis = new Lenis({ lerp: 0.07, smoothWheel: true, wheelMultiplier: 0.8 });
    // Single RAF loop — NO double call
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  } catch (e) { /* Lenis failed to load — smooth scroll disabled, page still works */ }

  // ─── GSAP SETUP ───
  gsap.registerPlugin(ScrollTrigger);
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
  }

  // ─── YEAR ───
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ─── CURSOR GLOW (desktop only) ───
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, gx = 0, gy = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!cursorGlow.classList.contains('active')) cursorGlow.classList.add('active');
    });
    (function loop() {
      gx += (mx - gx) * 0.08; gy += (my - gy) * 0.08;
      cursorGlow.style.left = gx + 'px'; cursorGlow.style.top = gy + 'px';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseleave', function () { cursorGlow.classList.remove('active'); });
    document.addEventListener('mouseenter', function () { cursorGlow.classList.add('active'); });
  }

  // ─── BENTO CARD MOUSE TRACKING ───
  document.querySelectorAll('.bento-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - r.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - r.top) + 'px');
    });
  });

  // ─── NAVBAR SHOW/HIDE ───
  var navbar = document.getElementById('navbar');
  if (navbar) {
    ScrollTrigger.create({
      start: 'top -100',
      onUpdate: function (self) {
        if (self.scroll() > 100) {
          navbar.classList.remove('nav-hidden');
          navbar.classList.add('nav-visible');
        } else {
          navbar.classList.add('nav-hidden');
          navbar.classList.remove('nav-visible');
        }
      }
    });
  }

  // ─── HERO ANIMATIONS (gsap.from — elements visible by default) ───
  var heroTl = gsap.timeline({ delay: 0.3, defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-badge', { opacity: 0, y: 20, duration: 0.6 })
    .from('.hero-title span', { opacity: 0, y: 40, duration: 0.8, stagger: 0.12 }, '-=0.3')
    .from('.hero-title + p', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from('.hero-title ~ div', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
    .from('.hero-phone', { opacity: 0, y: 60, rotateY: -5, duration: 1 }, '-=0.6');

  // ─── SCROLL REVEAL (gsap.from — visible if JS fails) ───
  gsap.utils.toArray('.section-tag, .section-title, .bento-card, .stat-item, .faq-item, .contact-card, #download h2, #download p, #download div').forEach(function (el) {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
      opacity: 0, y: 24, duration: 0.6, ease: 'power3.out'
    });
  });

  // ─── HERO CAROUSEL ───
  var carouselImgs = document.querySelectorAll('#hero-carousel .carousel-img');
  var currentSlide = 0;
  if (carouselImgs.length > 1) {
    setInterval(function () {
      carouselImgs[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % carouselImgs.length;
      carouselImgs[currentSlide].classList.add('active');
    }, 3500);
  }

  // ─── SHOWCASE DRAG SCROLL ───
  var container = document.querySelector('.showcase-container');
  if (container) {
    var dragging = false, startX = 0, sl = 0;
    container.addEventListener('mousedown', function (e) {
      dragging = true; startX = e.pageX; sl = container.scrollLeft;
      container.style.cursor = 'grabbing';
    });
    document.addEventListener('mouseup', function () {
      dragging = false;
      if (container) container.style.cursor = 'grab';
    });
    container.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      e.preventDefault();
      container.scrollLeft = sl - (e.pageX - startX) * 1.5;
    });

    // Staggered reveal
    gsap.utils.toArray('.showcase-card').forEach(function (card, i) {
      gsap.from(card, {
        scrollTrigger: { trigger: '#showcase', start: 'top 80%', toggleActions: 'play none none none' },
        opacity: 0, x: 50, duration: 0.6, delay: i * 0.08, ease: 'power3.out'
      });
    });
  }

  // ─── STAT COUNTER ───
  document.querySelectorAll('.stat-number').forEach(function (el) {
    var target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: function () {
        gsap.from({ v: 0 }, {
          v: target, duration: 1.8, ease: 'power2.out',
          onUpdate: function () { el.textContent = Math.round(this.targets()[0].v); }
        });
      }
    });
  });

  // ─── MARQUEE DUPLICATION ───
  var mq = document.querySelector('.marquee-content');
  if (mq) mq.parentElement.appendChild(mq.cloneNode(true));

  // ─── SMOOTH ANCHOR LINKS ───
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#') return;
      var t = document.querySelector(id);
      if (t) {
        e.preventDefault();
        if (lenis) lenis.scrollTo(t, { offset: -80 });
        else t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── PARALLAX PHONE ───
  gsap.to('.hero-phone', {
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
    y: -60, ease: 'none'
  });

})();

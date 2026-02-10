/* ═══════════════════════════════════════════════════════════════════
   RANKRUSH — APP.JS v3
   Approche : gsap.from() — le contenu est visible par défaut.
   Les animations sont progressives et non bloquantes.
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── SMOOTH SCROLL (LENIS) ───
  var lenis;
  try {
    lenis = new Lenis({ lerp: 0.07, smoothWheel: true, wheelMultiplier: 0.8 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  } catch (e) { /* Lenis failed — smooth scroll disabled, page still works */ }

  // ─── GSAP SETUP ───
  gsap.registerPlugin(ScrollTrigger);
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
  }

  // ─── YEAR ───
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ─── CURSOR GLOW (desktop only) ───
  var cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    var mx = 0, my = 0, gx = 0, gy = 0;
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

  // ─── HERO ANIMATIONS ───
  var heroTl = gsap.timeline({ delay: 0.3, defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-badge', { opacity: 0, y: 20, duration: 0.6 })
    .from('.hero-title span', { opacity: 0, y: 40, duration: 0.8, stagger: 0.12 }, '-=0.3')
    .from('.hero-title + p', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from('.hero-title ~ div', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
    .from('.hero-phone', { opacity: 0, y: 60, rotateY: -5, duration: 1 }, '-=0.6');

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

  // ─── SCROLL REVEAL (section titles, steps, stats, faq, contact, cta) ───
  gsap.utils.toArray('.section-tag, .section-title, .step-card, .step-connector, .stat-card, .faq-item, .contact-card, #download h2, #download p, #download div').forEach(function (el) {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
      opacity: 0, y: 24, duration: 0.6, ease: 'power3.out'
    });
  });

  // ─── FEATURE ROWS — staggered reveal ───
  gsap.utils.toArray('.feature-row').forEach(function (row) {
    var visual = row.querySelector('.feature-visual');
    var content = row.querySelector('.feature-content');

    if (visual) {
      gsap.from(visual, {
        scrollTrigger: { trigger: row, start: 'top 80%', toggleActions: 'play none none none' },
        opacity: 0, y: 40, duration: 0.8, ease: 'power3.out'
      });
    }
    if (content) {
      gsap.from(content, {
        scrollTrigger: { trigger: row, start: 'top 80%', toggleActions: 'play none none none' },
        opacity: 0, y: 40, duration: 0.8, delay: 0.2, ease: 'power3.out'
      });
    }
  });

  // ─── GALLERY TAB SWITCHING ───
  var galleryData = [
    { title: 'Matchs en direct', desc: 'Tous les matchs eSport en un coup d\'œil. Filtre par jeu, par statut et place tes paris en quelques secondes.' },
    { title: 'Validation de pari', desc: 'Choisis ta mise, active tes cartes boost pour maximiser tes gains et valide ton pronostic.' },
    { title: 'Collection de cartes', desc: 'Plus de 419 cartes d\'équipes eSport à collectionner. Bronze, Argent, Or et Platine.' },
    { title: 'Ligues & Classement', desc: 'Du rang Fer à Grand Maître, grimpe les ligues et domine le classement hebdomadaire.' },
    { title: 'Boutique & Packs', desc: 'Packs quotidiens gratuits et packs premium. Enrichis ta collection et débloque des cartes rares.' },
    { title: 'Profil & Statistiques', desc: 'Tes stats, ton winrate, ta progression complète et ta place dans le classement.' }
  ];

  var galleryTabs = document.querySelectorAll('.gallery-tab');
  var galleryScreens = document.querySelectorAll('.gallery-screen');
  var galleryTitle = document.getElementById('gallery-title');
  var galleryDesc = document.getElementById('gallery-desc');
  var galleryActiveIndex = 0;

  function switchGallery(index) {
    if (index === galleryActiveIndex) return;

    // Update tabs
    galleryTabs.forEach(function (tab) { tab.classList.remove('active'); });
    galleryTabs[index].classList.add('active');

    // Update screens
    galleryScreens.forEach(function (screen) { screen.classList.remove('active'); });
    galleryScreens[index].classList.add('active');

    // Update caption with fade
    if (galleryTitle && galleryDesc) {
      galleryTitle.style.opacity = '0';
      galleryDesc.style.opacity = '0';
      setTimeout(function () {
        galleryTitle.textContent = galleryData[index].title;
        galleryDesc.textContent = galleryData[index].desc;
        galleryTitle.style.opacity = '1';
        galleryDesc.style.opacity = '1';
      }, 200);
    }

    galleryActiveIndex = index;
  }

  galleryTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var idx = parseInt(tab.getAttribute('data-index'), 10);
      switchGallery(idx);
    });
  });

  // Auto-cycle gallery every 5s
  var galleryAutoplay;
  function startGalleryAutoplay() {
    galleryAutoplay = setInterval(function () {
      var next = (galleryActiveIndex + 1) % galleryData.length;
      switchGallery(next);
    }, 5000);
  }
  function stopGalleryAutoplay() {
    clearInterval(galleryAutoplay);
  }

  if (galleryTabs.length > 0) {
    startGalleryAutoplay();
    // Pause on user interaction, resume after 10s
    var gallerySection = document.getElementById('gallery-tabs');
    if (gallerySection) {
      gallerySection.addEventListener('click', function () {
        stopGalleryAutoplay();
        setTimeout(startGalleryAutoplay, 10000);
      });
    }
  }

  // ─── STAT COUNTER ───
  document.querySelectorAll('.stat-number').forEach(function (el) {
    var target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    var obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: function () {
        gsap.to(obj, {
          v: target, duration: 1.8, ease: 'power2.out',
          onUpdate: function () { el.textContent = Math.round(obj.v); }
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

  // ─── MODAL BÊTA ───
  var modal = document.getElementById('beta-modal');
  var modalClose = document.getElementById('modal-close');
  var openBtns = document.querySelectorAll('.btn-open-beta');
  var copyBtn = document.getElementById('copy-source');

  function openModal() {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  openBtns.forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // Copy source URL
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var url = 'https://raw.githubusercontent.com/RomainF17/EsportBetAltstore/refs/heads/main/apps.json';
      navigator.clipboard.writeText(url).then(function () {
        copyBtn.classList.add('copied');
        setTimeout(function () { copyBtn.classList.remove('copied'); }, 2000);
      });
    });
  }

  // ─── PARALLAX PHONE ───
  gsap.to('.hero-phone', {
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
    y: -60, ease: 'none'
  });

})();

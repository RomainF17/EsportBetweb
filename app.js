/* ═══════════════════════════════════════════════════════════════════
   RANKRUSH — APP.JS
   ═══════════════════════════════════════════════════════════════════ */

// ─── SMOOTH SCROLL (LENIS) ───
const lenis = new Lenis({
  lerp: 0.07,
  smoothWheel: true,
  wheelMultiplier: 0.8
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync GSAP ScrollTrigger with Lenis
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ─── YEAR ───
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ─── CURSOR GLOW ───
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!cursorGlow.classList.contains('active')) {
      cursorGlow.classList.add('active');
    }
  });

  function animateCursor() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
  document.addEventListener('mouseenter', () => cursorGlow.classList.add('active'));
}

// ─── BENTO CARD MOUSE TRACKING ───
document.querySelectorAll('.bento-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', x + 'px');
    card.style.setProperty('--mouse-y', y + 'px');
  });
});

// ─── NAVBAR SHOW/HIDE ───
const navbar = document.getElementById('navbar');
let lastScroll = 0;

ScrollTrigger.create({
  start: 'top -100',
  onUpdate: (self) => {
    const currentScroll = self.scroll();
    if (currentScroll > 100) {
      navbar.classList.remove('nav-hidden');
      navbar.classList.add('nav-visible');
    } else {
      navbar.classList.add('nav-hidden');
      navbar.classList.remove('nav-visible');
    }
    lastScroll = currentScroll;
  }
});

// ─── HERO ANIMATIONS ───
const heroTl = gsap.timeline({ delay: 0.3 });

heroTl
  .to('.hero-badge', {
    opacity: 1, y: 0, duration: 0.6, ease: 'power3.out'
  })
  .to('.hero-line', {
    opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out'
  }, '-=0.3')
  .to('.hero-desc', {
    opacity: 1, y: 0, duration: 0.6, ease: 'power3.out'
  }, '-=0.4')
  .to('.hero-ctas', {
    opacity: 1, y: 0, duration: 0.6, ease: 'power3.out'
  }, '-=0.3')
  .to('.hero-phone', {
    opacity: 1, y: 0, rotateY: 0, duration: 1, ease: 'power3.out'
  }, '-=0.6');

// ─── SCROLL REVEAL ───
gsap.utils.toArray('.reveal').forEach((el) => {
  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none'
    },
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power3.out'
  });
});

// ─── HERO CAROUSEL ───
const carouselImgs = document.querySelectorAll('#hero-carousel .carousel-img');
let currentSlide = 0;

if (carouselImgs.length > 1) {
  setInterval(() => {
    carouselImgs[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % carouselImgs.length;
    carouselImgs[currentSlide].classList.add('active');
  }, 3500);
}

// ─── SHOWCASE DRAG SCROLL ───
const showcaseContainer = document.querySelector('.showcase-container');
const showcaseTrack = document.getElementById('showcase-track');
if (showcaseContainer && showcaseTrack) {
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  showcaseContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - showcaseContainer.offsetLeft;
    scrollLeft = showcaseContainer.scrollLeft;
    showcaseContainer.style.cursor = 'grabbing';
  });

  showcaseContainer.addEventListener('mouseleave', () => {
    isDragging = false;
    showcaseContainer.style.cursor = 'grab';
  });

  showcaseContainer.addEventListener('mouseup', () => {
    isDragging = false;
    showcaseContainer.style.cursor = 'grab';
  });

  showcaseContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - showcaseContainer.offsetLeft;
    const walk = (x - startX) * 2;
    showcaseContainer.scrollLeft = scrollLeft - walk;
  });

  // GSAP staggered reveal for showcase cards
  gsap.utils.toArray('.showcase-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: '#showcase',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: 60,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power3.out'
    });
  });
}

// ─── STAT COUNTER ANIMATION ───
document.querySelectorAll('.stat-number').forEach(el => {
  const target = parseInt(el.dataset.count, 10);
  if (isNaN(target)) return;

  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to({ val: 0 }, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: function () {
          el.textContent = Math.round(this.targets()[0].val);
        }
      });
    }
  });
});

// ─── MARQUEE DUPLICATION ───
const marqueeContent = document.querySelector('.marquee-content');
if (marqueeContent) {
  const clone = marqueeContent.cloneNode(true);
  marqueeContent.parentElement.appendChild(clone);
}

// ─── SMOOTH ANCHOR LINKS ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      lenis.scrollTo(targetEl, { offset: -80 });
    }
  });
});

// ─── PARALLAX PHONE ON SCROLL ───
gsap.to('.hero-phone', {
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1
  },
  y: -80,
  ease: 'none'
});

// ─── SCROLL INDICATOR FADE ───
gsap.to('.scroll-indicator', {
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: '+=200',
    scrub: true
  },
  opacity: 0,
  y: -10
});

// Smooth scroll with Lenis
const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// GSAP intro animations
gsap.registerPlugin(ScrollTrigger);
gsap.set('header', { y: -20, opacity: 0 });
gsap.to('header', { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.1 });
gsap.from('h1, section p.inline-flex', { opacity: 0, y: 14, duration: 0.7, stagger: 0.05, ease: 'power2.out' });

// Feature cards reveal
gsap.utils.toArray('#highlights .feature-card').forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: 'top 85%' },
    opacity: 0, y: 20, duration: 0.45, ease: 'power2.out'
  });
});

gsap.utils.toArray('.screen-card').forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: 'top 85%' },
    opacity: 0, y: 18, duration: 0.5, ease: 'power2.out'
  });
});

// Calculator logic
const stakeInput = document.getElementById('stake');
const stakeValue = document.getElementById('stakeValue');
const oddsInput = document.getElementById('odds');
const bonusInput = document.getElementById('bonus');
const bonusValue = document.getElementById('bonusValue');
const payoutEl = document.getElementById('payout');

const compute = () => {
  const stake = Number(stakeInput.value);
  const odds = Math.max(1.01, Number(oddsInput.value || 0));
  const bonus = Number(bonusInput.value);
  const base = stake * odds;
  const total = Math.round((base * (1 + bonus / 100)) * 100) / 100;
  stakeValue.textContent = stake;
  bonusValue.textContent = bonus;
  payoutEl.textContent = total.toString();
};
['input', 'change'].forEach(evt => {
  stakeInput.addEventListener(evt, compute);
  oddsInput.addEventListener(evt, compute);
  bonusInput.addEventListener(evt, compute);
});
compute();

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
document.querySelectorAll('.shot').forEach(btn => {
  btn.addEventListener('click', () => {
    lightboxImg.src = btn.dataset.img;
    lightbox.classList.remove('hidden');
    requestAnimationFrame(() => lightbox.classList.add('active'));
  });
});
const closeLb = () => { lightbox.classList.remove('active'); setTimeout(()=> lightbox.classList.add('hidden'), 200); };
lightboxClose.addEventListener('click', closeLb);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });

// Vanta background
let vanta;
window.addEventListener('DOMContentLoaded', () => {
  vanta = VANTA.NET({
    el: '#bg',
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    color: 0x7C3AED,
    backgroundColor: 0x0a0a0f,
    points: 9.0,
    maxDistance: 22.0,
    spacing: 15.0
  });

  // Carousel pour les screenshots
  const carouselSlides = document.querySelectorAll('#carousel-matches .carousel-slide');
  let currentSlide = 0;

  function nextSlide() {
    if (carouselSlides.length === 0) return;

    carouselSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % carouselSlides.length;
    carouselSlides[currentSlide].classList.add('active');
  }

  // Rotation automatique toutes les 3 secondes
  if (carouselSlides.length > 0) {
    setInterval(nextSlide, 3000);
  }
});
window.addEventListener('beforeunload', () => { if (vanta) vanta.destroy(); });



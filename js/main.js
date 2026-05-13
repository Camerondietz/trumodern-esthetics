/* =========================================================
   Trumodern Esthetics — interactions
   - Nav: scrolled state, mobile menu
   - Scroll reveal via IntersectionObserver
   - Testimonials carousel
   - FAQ: single-open accordion behavior
   - Year stamp
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Nav scroll state ---------- */
  const nav = document.querySelector('[data-nav]');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (toggle && menu) {
    const setOpen = (open) => {
      menu.hidden = false; // keep in DOM for transition
      requestAnimationFrame(() => {
        menu.dataset.open = String(open);
      });
      toggle.setAttribute('aria-expanded', String(open));
      if (!open) {
        setTimeout(() => { if (menu.dataset.open === 'false') menu.hidden = true; }, 400);
      }
    };
    setOpen(false);
    toggle.addEventListener('click', () => {
      const open = menu.dataset.open !== 'true';
      setOpen(open);
    });
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-reveal-delay');
            if (delay) entry.target.style.transitionDelay = `${parseInt(delay, 10)}ms`;
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Testimonials carousel ---------- */
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const track = carousel.querySelector('[data-carousel-track]');
    const slides = Array.from(track.children);
    const prevBtn = document.querySelector('[data-carousel-prev]');
    const nextBtn = document.querySelector('[data-carousel-next]');
    const dotsWrap = document.querySelector('[data-carousel-dots]');
    let index = 0;
    let autoplay;

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      if (dotsWrap) {
        Array.from(dotsWrap.children).forEach((d, i) =>
          d.setAttribute('aria-current', i === index ? 'true' : 'false')
        );
      }
    };

    const go = (i) => {
      index = (i + slides.length) % slides.length;
      update();
    };

    if (dotsWrap) {
      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        b.addEventListener('click', () => { go(i); reset(); });
        dotsWrap.appendChild(b);
      });
    }
    prevBtn && prevBtn.addEventListener('click', () => { go(index - 1); reset(); });
    nextBtn && nextBtn.addEventListener('click', () => { go(index + 1); reset(); });

    const start = () => { autoplay = setInterval(() => go(index + 1), 6500); };
    const reset = () => { clearInterval(autoplay); start(); };
    update();
    start();

    // Pause on hover (desktop)
    carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
    carousel.addEventListener('mouseleave', start);
  }

  /* ---------- FAQ accordion (only one open at a time) ---------- */
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Smooth scroll offset compensation for fixed nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
      ) || 76;
      const top = target.getBoundingClientRect().top + window.scrollY - (navH - 12);
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();

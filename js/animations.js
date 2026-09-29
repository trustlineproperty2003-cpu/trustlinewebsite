/**
 * TrustLine Properties — Animations JavaScript
 * IntersectionObserver scroll animations, count-up, parallax, Swiper init, FAQ, Lazy Load
 * Business: TrustLine Properties | Prayagraj, UP
 * Phone: +91 80027 07546 | Email: trustlineproperties@gmail.com
 */

'use strict';

// ============================================================
// 1. INTERSECTION OBSERVER — SCROLL ANIMATIONS
// ============================================================
// Observes .fade-in-up, .fade-in, .fade-in-left, .fade-in-right
// Adds 'animated' class when 15% of element is in viewport
// Respects data-delay attribute (ms) for staggered animations

function initScrollAnimations() {
  const animatedSelectors = [
    '.fade-in-up',
    '.fade-in',
    '.fade-in-left',
    '.fade-in-right'
  ];

  const elements = document.querySelectorAll(animatedSelectors.join(', '));
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const delay = parseInt(el.getAttribute('data-delay') || '0', 10);

        setTimeout(function () {
          el.classList.add('animated');
        }, delay);

        // Animate only once
        observer.unobserve(el);
      });
    },
    {
      threshold:  0.15,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
}

// ============================================================
// 2. COUNT-UP ANIMATION
// ============================================================
// Elements with [data-count] animate from 0 to the target value
// data-suffix: appended after number (e.g. '+', 'Cr+')
// data-prefix: prepended before number (e.g. '₹')
// Duration: 1800ms with easeOutCubic easing

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCountUp(el) {
  const target   = parseFloat(el.getAttribute('data-count')) || 0;
  const suffix   = el.getAttribute('data-suffix') || '';
  const prefix   = el.getAttribute('data-prefix') || '';
  const duration = 1800;
  const isFloat  = target % 1 !== 0;
  let startTime  = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed  = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutCubic(progress);
    const current  = eased * target;

    el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      // Ensure exact final value
      el.textContent = prefix + (isFloat ? target.toFixed(1) : target) + suffix;
    }
  }

  requestAnimationFrame(step);
}

function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCountUp(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach(function (counter) {
    observer.observe(counter);
  });
}

// ============================================================
// 3. HERO PARALLAX
// ============================================================
// Translates .hero__bg at 0.35x scroll rate for depth effect
// Only runs on desktop (> 768px wide); uses rAF for performance

function initHeroParallax() {
  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg) return;

  let ticking = false;

  function applyParallax() {
    if (window.innerWidth <= 768) {
      heroBg.style.transform = '';
      ticking = false;
      return;
    }
    const scrollY = window.scrollY;
    heroBg.style.transform = 'translateY(' + (scrollY * 0.35) + 'px)';
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }, { passive: true });
}

// ============================================================
// 4. SWIPER INITIALIZATION
// ============================================================
// Initializes property listings and testimonials carousels
// Wrapped in try-catch; Swiper may not be loaded on all pages

function initSwipers() {
  // --- Listings Swiper ---
  const listingsEl = document.querySelector('.swiper-listings');
  if (listingsEl) {
    try {
      new Swiper('.swiper-listings', {
        slidesPerView:  1,
        spaceBetween:   24,
        loop:           true,
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween:  24
          },
          1024: {
            slidesPerView: 3,
            spaceBetween:  24
          }
        },
        autoplay: {
          delay:                3000,
          disableOnInteraction: false,
          pauseOnMouseEnter:    true
        },
        pagination: {
          el:        '.listings-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.listings-next',
          prevEl: '.listings-prev'
        }
      });
    } catch (err) {
      console.warn('TrustLine: Listings Swiper init failed:', err.message);
    }
  }

  // --- Testimonials Swiper ---
  const testimonialsEl = document.querySelector('.swiper-testimonials');
  if (testimonialsEl) {
    try {
      new Swiper('.swiper-testimonials', {
        slidesPerView: 1,
        spaceBetween:  24,
        loop:          true,
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween:  24
          }
        },
        autoplay: {
          delay:                5000,
          disableOnInteraction: false,
          pauseOnMouseEnter:    true
        },
        pagination: {
          el:             '.testimonials-pagination',
          clickable:      true,
          dynamicBullets: true
        }
      });
    } catch (err) {
      console.warn('TrustLine: Testimonials Swiper init failed:', err.message);
    }
  }
}

// ============================================================
// 5. FAQ ACCORDION
// ============================================================
// Each .faq-item has a .faq-question (trigger) and .faq-answer (panel)
// Only one item can be open at a time
// Height transition is achieved by animating max-height

function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  function getAnswer(item) {
    return item.querySelector('.faq-item__answer, .faq-answer');
  }

  function getQuestion(item) {
    return item.querySelector('.faq-item__question, .faq-question');
  }

  function openFaqItem(item) {
    const answer = getAnswer(item);
    const question = getQuestion(item);
    if (!answer) return;
    item.classList.add('faq-item--open');
    answer.removeAttribute('hidden');
    answer.style.maxHeight = answer.scrollHeight + 'px';
    answer.style.overflow = 'hidden';
    if (question) question.setAttribute('aria-expanded', 'true');
  }

  function closeFaqItem(item) {
    const answer = getAnswer(item);
    const question = getQuestion(item);
    if (!answer) return;
    item.classList.remove('faq-item--open');
    answer.style.maxHeight = '0px';
    if (question) question.setAttribute('aria-expanded', 'false');
  }

  // Ensure all answers start closed with smooth transition
  faqItems.forEach(function (item) {
    const answer = getAnswer(item);
    if (answer) {
      answer.style.maxHeight = '0px';
      answer.style.overflow = 'hidden';
      answer.style.transition = 'max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), padding 0.35s ease';
    }
  });

  faqItems.forEach(function (item) {
    const question = getQuestion(item);
    if (!question) return;

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('faq-item--open');

      // Close all items
      faqItems.forEach(function (i) { closeFaqItem(i); });

      // If it was closed, open it
      if (!isOpen) {
        openFaqItem(item);
      }
    });

    // Keyboard accessibility
    question.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });
}

// ============================================================
// 6. LAZY LOADING IMAGES
// ============================================================
// Any img with data-src is loaded lazily via IntersectionObserver
// Falls back to eager loading if IntersectionObserver not supported

function initLazyImages() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (!lazyImages.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: load all immediately
    lazyImages.forEach(function (img) {
      img.src = img.dataset.src;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.removeAttribute('data-src');
      img.removeAttribute('data-srcset');
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const img = entry.target;

        // Set src and optional srcset
        img.src = img.dataset.src;
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }

        img.classList.add('lazy--loaded');
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
        observer.unobserve(img);
      });
    },
    {
      rootMargin: '0px 0px 200px 0px', // start loading 200px before entering viewport
      threshold:  0
    }
  );

  lazyImages.forEach(function (img) {
    observer.observe(img);
  });
}

// ============================================================
// INIT — Run all on DOMContentLoaded
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
  initScrollAnimations();
  initCountUp();
  initHeroParallax();
  initSwipers();
  initFaqAccordion();
  initLazyImages();
});

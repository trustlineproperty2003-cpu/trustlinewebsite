/**
 * TrustLine Properties — Main JavaScript
 * Handles: Navbar, Modal, Mobile Menu, Dropdown, Property Filter, Smooth Scroll
 * Business: TrustLine Properties | Prayagraj, UP
 * Phone: +91 84291 92003 | Email: trustlineproperties@gmail.com
 */

'use strict';

// ============================================================
// 1. NAVBAR SCROLL BEHAVIOR
// ============================================================
// Adds 'navbar--scrolled' class when scrollY > 80px
// CSS transitions navbar from transparent to solid black with backdrop blur

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 80;

  function handleNavbarScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  // Run once on load to set correct initial state
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
}

// ============================================================
// 2. MOBILE HAMBURGER MENU
// ============================================================
// Toggles #navMenu 'active' class on #navToggle click
// Toggles 'open' class on #navToggle for the X animation
// Closes menu on click outside navbar, on nav-link click, on Escape key

function initMobileMenu() {
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');
  const navbar    = document.getElementById('navbar');
  if (!navToggle || !navMenu) return;

  function openMenu() {
    navMenu.classList.add('active');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // Also close any open dropdowns
    document.querySelectorAll('.dropdown-menu.dropdown--open').forEach(function (dd) {
      dd.classList.remove('dropdown--open');
    });
  }

  function isMenuOpen() {
    return navMenu.classList.contains('active');
  }

  // Toggle on hamburger click
  navToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    isMenuOpen() ? closeMenu() : openMenu();
  });

  // Close when clicking a nav-link (single-page scroll links)
  navMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth < 640) {
        closeMenu();
      }
    });
  });

  // Close on click outside the navbar
  document.addEventListener('click', function (e) {
    if (navbar && !navbar.contains(e.target) && isMenuOpen()) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isMenuOpen()) {
      closeMenu();
      navToggle.focus();
    }
  });
}

// ============================================================
// 3. DROPDOWN MENU (touch-friendly)
// ============================================================
// Desktop (>= 640px): CSS :hover handles dropdown
// Mobile: tap on .nav-item--dropdown > .nav-link toggles dropdown

function initDropdowns() {
  const dropdownItems = document.querySelectorAll('.nav-item--dropdown');
  if (!dropdownItems.length) return;

  dropdownItems.forEach(function (item) {
    const trigger  = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown-menu');
    if (!trigger || !dropdown) return;

    trigger.addEventListener('click', function (e) {
      // Only intercept on mobile
      if (window.innerWidth >= 640) return;
      e.preventDefault();
      e.stopPropagation();

      const isOpen = dropdown.classList.contains('dropdown--open');

      // Close all other open dropdowns
      document.querySelectorAll('.dropdown-menu.dropdown--open').forEach(function (dd) {
        if (dd !== dropdown) dd.classList.remove('dropdown--open');
      });

      dropdown.classList.toggle('dropdown--open', !isOpen);
    });
  });
}

// ============================================================
// 4. BOOK A CALL MODAL
// ============================================================
// Opens via #openModal and #floatingCta
// Closes via #closeModal, overlay click, or Escape key
// Focus trap ensures keyboard accessibility

function initModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  const modal        = document.getElementById('bookCallModal');
  const openBtns     = [
    document.getElementById('openModal'),
    document.getElementById('floatingCta')
  ].filter(Boolean);
  const closeBtn = document.getElementById('closeModal');
  if (!modalOverlay || !modal) return;

  function openModal() {
    modalOverlay.classList.add('active');
    document.body.classList.add('modal-open');
    // Focus first focusable input in the modal
    const firstInput = modal.querySelector('input, select, textarea, button');
    if (firstInput) {
      setTimeout(function () { firstInput.focus(); }, 100);
    }
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  openBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close on overlay click but NOT on the modal card itself
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Focus trap inside modal
  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

// ============================================================
// 5. ACTIVE NAV LINK HIGHLIGHTING
// ============================================================
// Compares window.location.pathname to each nav-link href
// Handles index.html → '/' equivalence

function initActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  if (!navLinks.length) return;

  let path = window.location.pathname;
  // Normalize: treat /index.html as /
  if (path.endsWith('/index.html')) {
    path = path.replace('/index.html', '/');
  }
  // Ensure trailing slash for root
  if (path === '') path = '/';

  navLinks.forEach(function (link) {
    let href = link.getAttribute('href') || '';
    // Ignore anchor-only links and external links
    if (href.startsWith('#') || href.startsWith('http')) return;

    if (href.endsWith('/index.html')) {
      href = href.replace('/index.html', '/');
    }

    // Strip query string / hash from href for comparison
    const hrefPath = href.split('?')[0].split('#')[0];

    if (hrefPath && (path === hrefPath || path.endsWith(hrefPath))) {
      link.classList.add('nav-link--active');
    }
  });
}

// ============================================================
// 6. PROPERTY FILTER BUTTONS
// ============================================================
// .filter-btn[data-filter] controls visibility of .property-card[data-type]
// Adds fade animation on filter change

function initPropertyFilter() {
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const propertyCards = document.querySelectorAll('.property-card');
  if (!filterBtns.length || !propertyCards.length) return;

  function fadeOutCards(cards) {
    cards.forEach(function (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(8px)';
    });
  }

  function fadeInCards(cards) {
    cards.forEach(function (card, i) {
      setTimeout(function () {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 60);
    });
  }

  // Set initial transition styles
  propertyCards.forEach(function (card) {
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.getAttribute('data-filter') || 'all';

      // Update active button state
      filterBtns.forEach(function (b) { b.classList.remove('filter-btn--active'); });
      btn.classList.add('filter-btn--active');

      // Fade out visible cards
      const visibleCards = Array.from(propertyCards).filter(function (c) {
        return !c.hasAttribute('hidden');
      });
      fadeOutCards(visibleCards);

      setTimeout(function () {
        const toShow = [];
        propertyCards.forEach(function (card) {
          const type = card.getAttribute('data-type') || '';
          if (filter === 'all' || type === filter) {
            card.removeAttribute('hidden');
            card.style.display = '';
            toShow.push(card);
          } else {
            card.setAttribute('hidden', '');
            card.style.display = 'none';
          }
        });
        fadeInCards(toShow);
      }, 300);
    });
  });
}

// ============================================================
// 7. SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================
// For all <a href="#..."> that point to an element on the page

function initSmoothScroll() {
  document.addEventListener('click', function (e) {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;

    const href = target.getAttribute('href');
    if (!href || href === '#') return;

    const destination = document.querySelector(href);
    if (!destination) return;

    e.preventDefault();

    const navbar      = document.getElementById('navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const top = destination.getBoundingClientRect().top + window.scrollY - navbarHeight - 8;

    window.scrollTo({ top: top, behavior: 'smooth' });
  });
}

// ============================================================
// 8. BACK TO TOP BUTTON
// ============================================================
// Show/hide on scroll > 400px, smooth scroll to top on click

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  function handleScroll() {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// 9. STICKY CONTACT STRIP ON MOBILE
// ============================================================
// Shows bottom bar with Call Now + WhatsApp on mobile < 640px
// when user has scrolled > 600px

function initStickyContactStrip() {
  const strip = document.getElementById('stickyContactStrip');
  if (!strip) return;

  function handleStripVisibility() {
    const isMobile  = window.innerWidth < 640;
    const isScrolled = window.scrollY > 600;
    if (isMobile && isScrolled) {
      strip.classList.add('visible');
    } else {
      strip.classList.remove('visible');
    }
  }

  handleStripVisibility();
  window.addEventListener('scroll', handleStripVisibility, { passive: true });
  window.addEventListener('resize', handleStripVisibility, { passive: true });
}

// ============================================================
// 10. UTILITY: Format phone number for WhatsApp link
// ============================================================
// formatWhatsAppLink(phone, message) → returns wa.me URL
// '8429192003' → 'https://wa.me/918429192003?text=...'

function formatWhatsAppLink(phone, message) {
  // Strip all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // Add India country code if not already present
  const e164 = digits.startsWith('91') ? digits : '91' + digits;
  const encodedMsg = message ? encodeURIComponent(message) : '';
  return 'https://wa.me/' + e164 + (encodedMsg ? '?text=' + encodedMsg : '');
}

// Attach WhatsApp links to all .whatsapp-link elements
function initWhatsAppLinks() {
  const phone   = '8429192003';
  const message = 'Hello, I am interested in your property listings. Please share more details.';
  const url     = formatWhatsAppLink(phone, message);

  document.querySelectorAll('.whatsapp-link').forEach(function (el) {
    el.setAttribute('href', url);
    if (!el.hasAttribute('target')) {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

// ============================================================
// UTILITY: Debounce helper
// ============================================================
function debounce(fn, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(this, arguments), delay);
  };
}

// ============================================================
// 11. INIT ON DOM READY
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
  initNavbarScroll();
  initMobileMenu();
  initDropdowns();
  initModal();
  initActiveNavLink();
  initPropertyFilter();
  initSmoothScroll();
  initBackToTop();
  initStickyContactStrip();
  initWhatsAppLinks();
});

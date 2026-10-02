/**
 * TRUST LINE PROPERTIES - CLIENT JAVASCRIPT
 * Prayagraj Land Specialists
 * Features: Mobile Nav, Sticky Header, Accordion FAQ (+ / - toggle), Modal, Form Validation, Stat Counter
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. STICKY HEADER & SCROLL BEHAVIOR ---
  const header = document.querySelector('.header');
  const scrollTopBtn = document.querySelector('.scroll-top-btn');

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    
    // Header styling on scroll
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll to Top Button Visibility
    if (scrollTopBtn) {
      if (scrollY > 350) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 2. MOBILE HAMBURGER MENU ---
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileNav = (open) => {
    const isOpen = typeof open === 'boolean' ? open : !mobileNavDrawer.classList.contains('active');
    
    if (hamburgerBtn) hamburgerBtn.classList.toggle('open', isOpen);
    if (mobileNavOverlay) mobileNavOverlay.classList.toggle('active', isOpen);
    if (mobileNavDrawer) mobileNavDrawer.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => toggleMobileNav());
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', () => toggleMobileNav(false));
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileNav(false));
  });

  // --- 3. ACCORDION FAQ SYSTEM (+ / - TOGGLE) ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');
    const toggleBtn = item.querySelector('.faq-toggle-btn');

    if (header && body) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Auto-close other accordion items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherBody = otherItem.querySelector('.faq-body');
            const otherToggle = otherItem.querySelector('.faq-toggle-btn');
            if (otherBody) otherBody.style.maxHeight = null;
            if (otherToggle) otherToggle.textContent = '+';
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          body.style.maxHeight = null;
          if (toggleBtn) toggleBtn.textContent = '+';
        } else {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
          if (toggleBtn) toggleBtn.textContent = '−';
        }
      });
    }
  });

  // Ensure first FAQ has correct toggle state on load
  const firstActiveFaq = document.querySelector('.faq-item.active');
  if (firstActiveFaq) {
    const firstBody = firstActiveFaq.querySelector('.faq-body');
    const firstToggle = firstActiveFaq.querySelector('.faq-toggle-btn');
    if (firstBody) firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
    if (firstToggle) firstToggle.textContent = '−';
  }

  // --- 4. BOOK A CALL MODAL ---
  const modalOverlay = document.getElementById('bookCallModal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtns = document.querySelectorAll('.close-modal-btn');

  const openModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // --- 5. TOAST NOTIFICATION UTILITY ---
  const showToast = (message, type = 'success') => {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = 'position: fixed; bottom: 30px; left: 30px; background: #1D2125; border-left: 4px solid #EBBD6D; color: #FFFFFF; padding: 16px 22px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); z-index: 3000; font-size: 14px; max-width: 380px; line-height: 1.5;';
    toast.innerHTML = `<strong>Success:</strong> ${message}`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  };

  // --- 6. REAL-TIME FORM VALIDATION ---
  const validatePhoneIndia = (phone) => {
    const cleaned = phone.replace(/[\s\-()]/g, '');
    const regex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
    return regex.test(cleaned);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const setupFormValidation = (formElement) => {
    if (!formElement) return;

    const nameInput = formElement.querySelector('[name="name"]');
    const emailInput = formElement.querySelector('[name="email"]');
    const phoneInput = formElement.querySelector('[name="phone"]');

    formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      if (nameInput && nameInput.value.trim().length < 2) {
        alert('Please enter your full name (minimum 2 characters).');
        nameInput.focus();
        isValid = false;
        return;
      }

      if (phoneInput && !validatePhoneIndia(phoneInput.value.trim())) {
        alert('Please enter a valid 10-digit Indian phone number.');
        phoneInput.focus();
        isValid = false;
        return;
      }

      if (emailInput && emailInput.value.trim() && !validateEmail(emailInput.value.trim())) {
        alert('Please enter a valid email address.');
        emailInput.focus();
        isValid = false;
        return;
      }

      if (isValid) {
        const submitBtn = formElement.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
        
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Submitting Request...';
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
          
          formElement.reset();
          closeModal();
          showToast('Thank you! Your call request has been registered. Our Prayagraj property specialist will contact you shortly.');
        }, 1000);
      }
    });
  };

  setupFormValidation(document.getElementById('discoveryForm'));
  setupFormValidation(document.getElementById('modalContactForm'));

  // --- 7. ANIMATED STATS / NUMBER COUNTERS ---
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statNumbers.length > 0) {
    const animateCounters = () => {
      statNumbers.forEach(el => {
        const targetText = el.getAttribute('data-target') || el.innerText.trim();
        const numMatch = targetText.match(/\d+/);
        
        if (numMatch) {
          const targetNum = parseInt(numMatch[0], 10);
          const suffix = targetText.replace(/\d+/, '') || '+';
          let count = 0;
          const duration = 1600;
          const stepCount = 40;
          const increment = Math.ceil(targetNum / stepCount);
          const stepTime = Math.floor(duration / stepCount);
          
          el.innerText = '0' + suffix;
          
          const timer = setInterval(() => {
            count += increment;
            if (count >= targetNum) {
              count = targetNum;
              clearInterval(timer);
            }
            el.innerText = count + suffix;
          }, stepTime);
        }
      });
    };

    if ('IntersectionObserver' in window) {
      const statsSection = document.querySelector('.stats-section');
      if (statsSection) {
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animateCounters();
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15 });
        
        observer.observe(statsSection);
      } else {
        animateCounters();
      }
    } else {
      animateCounters();
    }
  }

  // --- 8. SMOOTH SCROLL FOR ANCHORS ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#!') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- 9. SQUEEZE CAROUSEL CONTROLLER (5 Prayagraj Prime Locations) ---
  const initSqueezeCarousel = () => {
    const wrapper = document.getElementById('primeLocationsSqueezeCarousel');
    if (!wrapper) return;

    const cards = Array.from(wrapper.querySelectorAll('.squeeze-card'));
    const infoItems = Array.from(wrapper.querySelectorAll('.squeeze-info-item'));
    const prevBtn = wrapper.querySelector('.squeeze-prev-btn');
    const nextBtn = wrapper.querySelector('.squeeze-next-btn');

    if (cards.length === 0) return;

    const total = cards.length;
    let currentIndex = 0;
    let autoPlayTimer = null;
    let isPaused = false;

    const setActiveSlide = (index) => {
      currentIndex = ((index % total) + total) % total;

      cards.forEach((card, idx) => {
        const isActive = idx === currentIndex;
        card.classList.toggle('active', isActive);
        card.setAttribute('tabindex', isActive ? '0' : '-1');
        card.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      infoItems.forEach((item, idx) => {
        item.classList.toggle('active', idx === currentIndex);
      });
    };

    const nextSlide = () => setActiveSlide(currentIndex + 1);
    const prevSlide = () => setActiveSlide(currentIndex - 1);

    // Click & Hover interactions on cards
    cards.forEach((card, idx) => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveSlide(idx);
        startAutoPlay();
      });

      card.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 1024) {
          setActiveSlide(idx);
        }
      });
    });

    // Arrow Controls
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoPlay();
      });
    }

    // Keyboard navigation
    wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
        startAutoPlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
        startAutoPlay();
      }
    });

    // Autoplay handling (Every 4 seconds)
    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        if (!isPaused) {
          nextSlide();
        }
      }, 4000);
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    };

    wrapper.addEventListener('mouseenter', () => { isPaused = true; });
    wrapper.addEventListener('mouseleave', () => { isPaused = false; });
    wrapper.addEventListener('focusin', () => { isPaused = true; });
    wrapper.addEventListener('focusout', () => { isPaused = false; });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoPlay();
      else startAutoPlay();
    });

    // Touch Swipe for Mobile
    let touchStartX = 0;
    let touchStartY = 0;
    wrapper.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      if (!touchStartX) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) nextSlide();
        else prevSlide();
        startAutoPlay();
      }
      touchStartX = 0;
    }, { passive: true });

    // Initial activation
    setActiveSlide(0);
    startAutoPlay();
  };

  // --- 10. LUXURY SCROLL REVEAL ANIMATIONS (One-Time Elegant Entrance) ---
  const initScrollReveal = () => {
    const revealSelectors = [
      '.hero-title',
      '.hero-desc',
      '.hero-divider',
      '.section-title-wrap',
      '.section-title',
      '.section-subtitle',
      '.stat-card',
      '.about-media',
      '.about-title',
      '.about-desc',
      '.about-desc-extra',
      '.about-cta-group',
      '.feature-banner-inner',
      '.feature-banner-img',
      '.carousel-stacked-wrapper',
      '.goal-card',
      '.faq-item',
      '.discovery-info',
      '.discovery-form-card',
      '.testimonial-card',
      '.blog-article-card',
      '.reveal-item'
    ];

    const elements = document.querySelectorAll(revealSelectors.join(', '));
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-delay') || '0', 10);

          if (delay > 0) {
            setTimeout(() => {
              el.classList.add('is-revealed');
            }, delay);
          } else {
            el.classList.add('is-revealed');
          }

          // Unobserve so animation runs ONLY ONCE on first view
          obs.unobserve(el);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    // Auto-stagger container items
    const staggerGroups = [
      { parent: '.hero-content', items: ['.hero-title', '.hero-desc', '.hero-divider'], step: 160 },
      { parent: '.stats-grid', items: ['.stat-card'], step: 120 },
      { parent: '.about-grid', items: ['.about-media', '.about-title', '.about-desc', '.about-desc-extra', '.about-cta-group'], step: 140 },
      { parent: '.goals-grid', items: ['.goal-card'], step: 130 },
      { parent: '.faq-list', items: ['.faq-item'], step: 90 },
      { parent: '.discovery-grid', items: ['.discovery-info', '.discovery-form-card'], step: 150 }
    ];

    staggerGroups.forEach(group => {
      const container = document.querySelector(group.parent);
      if (container) {
        let currentDelay = 0;
        group.items.forEach(itemSel => {
          container.querySelectorAll(itemSel).forEach(childEl => {
            if (!childEl.hasAttribute('data-delay')) {
              childEl.setAttribute('data-delay', currentDelay.toString());
              currentDelay += group.step;
            }
          });
        });
      }
    });

    elements.forEach(el => {
      observer.observe(el);
    });

    // Immediate choreographed reveal for Hero top elements
    setTimeout(() => {
      const heroEls = document.querySelectorAll('.hero-title, .hero-desc, .hero-divider');
      heroEls.forEach((el, idx) => {
        setTimeout(() => el.classList.add('is-revealed'), (idx + 1) * 120);
      });
    }, 60);
  };

  // --- 11. SCROLL EXPANSION INTRO (Figma Spec, Left/Right Text Slide & Full Fill) ---
  const initScrollExpansionIntro = () => {
    const introSection = document.getElementById('hero-expand-intro');
    if (!introSection) return;

    const bgBackdrop = document.getElementById('heroBgBackdrop');
    const card = document.getElementById('scrollExpandCard');
    const cardContent = document.getElementById('heroCardContent');
    const lineLeft = document.getElementById('heroLineLeft');
    const lineRight = document.getElementById('heroLineRight');
    const bottomPrompt = document.getElementById('heroBottomPrompt');
    const mainHero = document.getElementById('home');

    if (!card) return;

    let scrollProgress = 0;
    let isFullyExpanded = false;
    let touchStartY = 0;
    let animFrame = null;

    // Set initial active state based on scroll position
    const currentScrollY = window.scrollY || window.pageYOffset;
    if (currentScrollY <= 15) {
      document.body.classList.add('intro-active');
      document.body.classList.remove('intro-completed');
      scrollProgress = 0;
      isFullyExpanded = false;
    } else {
      document.body.classList.remove('intro-active');
      document.body.classList.add('intro-completed');
      scrollProgress = 1;
      isFullyExpanded = true;
    }

    const renderIntroExpansion = (progress) => {
      const isMobile = window.innerWidth < 768;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Card initial size: ~65% on desktop, ~88% on mobile
      const initialWidth = isMobile
        ? Math.max(vw * 0.88, 280)
        : Math.min(Math.max(vw * 0.65, 320), 1100);
      const initialHeight = isMobile
        ? Math.max(vh * 0.56, 320)
        : Math.min(Math.max(vh * 0.65, 380), 740);

      // Target full screen fill (100vw × 100vh)
      const targetWidth = vw;
      const targetHeight = vh;

      const currentWidth = initialWidth + progress * (targetWidth - initialWidth);
      const currentHeight = initialHeight + progress * (targetHeight - initialHeight);
      const borderRadius = Math.max(0, (isMobile ? 18 : 24) * (1 - progress));

      // Left & Right text slide factor
      const textTranslateX = progress * (isMobile ? 120 : 90);
      const textOpacity = Math.max(0, 1 - progress * 2.0);

      if (progress >= 0.98) {
        card.style.width = '100vw';
        card.style.height = '100vh';
        card.style.borderRadius = '0px';
        card.style.boxShadow = 'none';
        card.style.borderColor = 'transparent';
      } else {
        card.style.width = `${currentWidth}px`;
        card.style.height = `${currentHeight}px`;
        card.style.borderRadius = `${borderRadius}px`;
        card.style.boxShadow = `0 30px 80px rgba(0, 0, 0, ${0.88 * (1 - progress)}), 0 0 45px rgba(235, 189, 109, ${0.18 * (1 - progress)})`;
        card.style.borderColor = `rgba(255, 255, 255, ${0.12 * (1 - progress)})`;
      }

      // Slide Line 1 to the Left
      if (lineLeft) {
        lineLeft.style.transform = `translate3d(-${textTranslateX}vw, 0, 0)`;
        lineLeft.style.opacity = textOpacity.toString();
      }

      // Slide Line 2 to the Right
      if (lineRight) {
        lineRight.style.transform = `translate3d(${textTranslateX}vw, 0, 0)`;
        lineRight.style.opacity = textOpacity.toString();
      }

      // Slide bottom prompt down & fade out
      if (bottomPrompt) {
        const promptOpacity = Math.max(0, 1 - progress * 2.4);
        bottomPrompt.style.transform = `translate3d(0, ${progress * 70}px, 0)`;
        bottomPrompt.style.opacity = promptOpacity.toString();
      }

      // Fade out backdrop blur overlay
      if (bgBackdrop) {
        bgBackdrop.style.opacity = Math.max(0, 1 - progress * 1.5).toString();
      }
    };

    const smoothSetProgress = (newProgress) => {
      newProgress = Math.min(Math.max(newProgress, 0), 1);
      scrollProgress = newProgress;

      if (animFrame) cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(() => {
        renderIntroExpansion(scrollProgress);

        if (scrollProgress >= 1) {
          isFullyExpanded = true;
          document.body.classList.remove('intro-active');
          document.body.classList.add('intro-completed');
          if (mainHero && window.scrollY < 20) {
            mainHero.scrollIntoView({ behavior: 'smooth' });
          }
        } else if (scrollProgress < 0.85) {
          isFullyExpanded = false;
          document.body.classList.add('intro-active');
          document.body.classList.remove('intro-completed');
        }
      });
    };

    // Wheel event handling
    window.addEventListener('wheel', (e) => {
      const scrollY = window.scrollY || window.pageYOffset;

      if (isFullyExpanded && e.deltaY < 0 && scrollY <= 15) {
        isFullyExpanded = false;
        e.preventDefault();
        smoothSetProgress(0.92);
      } else if (!isFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0018;
        smoothSetProgress(scrollProgress + scrollDelta);
      }
    }, { passive: false });

    // Touch events for mobile devices (Android & iPhone / iOS)
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!touchStartY || e.touches.length !== 1) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      const scrollY = window.scrollY || window.pageYOffset;

      if (isFullyExpanded && deltaY < -20 && scrollY <= 15) {
        isFullyExpanded = false;
        e.preventDefault();
        smoothSetProgress(0.92);
        touchStartY = touchY;
      } else if (!isFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.007 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        smoothSetProgress(scrollProgress + scrollDelta);
        touchStartY = touchY;
      }
    }, { passive: false });

    window.addEventListener('touchend', () => {
      touchStartY = 0;
    });

    window.addEventListener('resize', () => {
      renderIntroExpansion(scrollProgress);
    });

    // Initial render
    renderIntroExpansion(scrollProgress);
  };

  initScrollExpansionIntro();

  initScrollReveal();

  initSqueezeCarousel();

});






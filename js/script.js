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

  // --- 9. 3D STACKED DECK CAROUSEL CONTROLLER (5 Locations) ---
  const initStackedCarousel = () => {
    const carouselWrapper = document.getElementById('primeLocationsCarousel');
    if (!carouselWrapper) return;

    const stage = carouselWrapper.querySelector('.carousel-stacked-stage');
    const cards = Array.from(carouselWrapper.querySelectorAll('.carousel-stacked-card'));
    const prevBtn = carouselWrapper.querySelector('.carousel-prev-btn');
    const nextBtn = carouselWrapper.querySelector('.carousel-next-btn');
    const dots = Array.from(carouselWrapper.querySelectorAll('.carousel-dot'));

    if (!stage || cards.length === 0) return;

    const total = cards.length;
    let currentProgress = 0;
    let targetProgress = 0;
    let isDragging = false;
    let startX = 0;
    let lastX = 0;
    let dragStartTime = 0;
    let startProgress = 0;
    let velocityX = 0;
    let animFrameId = null;

    const getCarouselConfig = (width) => {
      if (width < 640) {
        return {
          distanceDivisor: 120,
          velocityDivisor: 500,
          sensitivity: 180,
          xMultiplier: 90,
          yMultiplier: 20,
          rotationMultiplier: 8,
          scaleReduction: 0.06,
        };
      }
      if (width < 1024) {
        return {
          distanceDivisor: 160,
          velocityDivisor: 650,
          sensitivity: 220,
          xMultiplier: 130,
          yMultiplier: 30,
          rotationMultiplier: 10,
          scaleReduction: 0.09,
        };
      }
      return {
        distanceDivisor: 200,
        velocityDivisor: 800,
        sensitivity: 250,
        xMultiplier: 170,
        yMultiplier: 40,
        rotationMultiplier: 12,
        scaleReduction: 0.12,
      };
    };

    let config = getCarouselConfig(window.innerWidth);

    window.addEventListener('resize', () => {
      config = getCarouselConfig(window.innerWidth);
      renderCards(currentProgress);
    }, { passive: true });

    const updateDots = (progress) => {
      const normalizedIndex = ((Math.round(progress) % total) + total) % total;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === normalizedIndex);
      });
    };

    const renderCards = (progress) => {
      cards.forEach((card, index) => {
        let diff = (index - progress) % total;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        const x = diff * config.xMultiplier;
        const absDiff = Math.abs(diff);
        const rotate = absDiff < 0.05 ? 0 : diff * config.rotationMultiplier;
        const y = absDiff * config.yMultiplier;
        const scale = Math.max(0.5, 1 - absDiff * config.scaleReduction);
        const zIndex = Math.round(100 - absDiff * 10);

        let opacity = 1;
        const maxThreshold = total / 2;
        if (absDiff > maxThreshold - 0.5) {
          opacity = Math.max(0, 1 - (absDiff - (maxThreshold - 0.5)) / 0.5);
        }

        card.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`;
        card.style.zIndex = zIndex;
        card.style.opacity = opacity;

        const shade = card.querySelector('.carousel-card-overlay-shade');
        if (shade) {
          let shadeOpacity = 0;
          if (absDiff > 0.05) {
            shadeOpacity = Math.min(0.55, absDiff * 0.22);
          }
          shade.style.opacity = shadeOpacity;
        }

        const content = card.querySelector('.carousel-card-content');
        if (content) {
          content.style.opacity = absDiff > 0.8 ? '0.35' : '1';
        }
      });

      updateDots(progress);
    };

    // Smooth Spring-like interpolation
    const animateTo = (target) => {
      targetProgress = target;
      if (animFrameId) cancelAnimationFrame(animFrameId);

      const step = () => {
        const diff = targetProgress - currentProgress;
        if (Math.abs(diff) < 0.002) {
          currentProgress = targetProgress;
          renderCards(currentProgress);
          return;
        }

        // Spring dampening
        currentProgress += diff * 0.16;
        renderCards(currentProgress);
        animFrameId = requestAnimationFrame(step);
      };

      step();
    };

    const handlePointerDown = (clientX) => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      isDragging = true;
      startX = clientX;
      lastX = clientX;
      dragStartTime = performance.now();
      startProgress = currentProgress;
      velocityX = 0;
      stage.classList.add('is-dragging');
    };

    const handlePointerMove = (clientX) => {
      if (!isDragging) return;
      const now = performance.now();
      const dt = Math.max(1, now - dragStartTime);
      const deltaX = clientX - startX;
      velocityX = (clientX - lastX) / (dt || 16);
      lastX = clientX;

      const progressDelta = -deltaX / config.sensitivity;
      currentProgress = startProgress + progressDelta;
      renderCards(currentProgress);
    };

    const handlePointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      stage.classList.remove('is-dragging');

      const dragDistance = lastX - startX;
      const distanceShift = -dragDistance / config.distanceDivisor;
      const velocityShift = -velocityX * 100 / config.velocityDivisor;

      let totalShift = Math.round(distanceShift + velocityShift);
      totalShift = Math.max(-3, Math.min(3, totalShift));

      const target = Math.round(startProgress) + totalShift;
      animateTo(target);
    };

    // --- Auto Drag / Autoplay (Every 1.8 seconds) ---
    let autoPlayTimer = null;
    let isHovered = false;

    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        if (!isDragging && !isHovered) {
          animateTo(Math.round(currentProgress) + 1);
        }
      }, 1800);
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    };

    carouselWrapper.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    carouselWrapper.addEventListener('mouseleave', () => {
      isHovered = false;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    });

    // Mouse Events
    stage.addEventListener('mousedown', (e) => {
      if (e.target.closest('.read-more-link') || e.target.closest('button')) return;
      handlePointerDown(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) handlePointerMove(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        handlePointerUp();
        startAutoPlay();
      }
    });

    // Touch Events
    stage.addEventListener('touchstart', (e) => {
      if (e.target.closest('.read-more-link') || e.target.closest('button')) return;
      if (e.touches.length === 1) {
        handlePointerDown(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        handlePointerMove(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (isDragging) {
        handlePointerUp();
        startAutoPlay();
      }
    });

    // Arrow Buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        animateTo(Math.round(currentProgress) - 1);
        startAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        animateTo(Math.round(currentProgress) + 1);
        startAutoPlay();
      });
    }

    // Dot Indicators
    dots.forEach((dot, dotIdx) => {
      dot.addEventListener('click', () => {
        const currentNorm = ((Math.round(currentProgress) % total) + total) % total;
        let diff = dotIdx - currentNorm;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;
        animateTo(Math.round(currentProgress) + diff);
        startAutoPlay();
      });
    });

    // Card click to bring to center if not center
    cards.forEach((card, cardIdx) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.read-more-link')) return;
        const currentNorm = ((Math.round(currentProgress) % total) + total) % total;
        if (cardIdx !== currentNorm) {
          e.preventDefault();
          let diff = cardIdx - currentNorm;
          if (diff > total / 2) diff -= total;
          if (diff < -total / 2) diff += total;
          animateTo(Math.round(currentProgress) + diff);
          startAutoPlay();
        }
      });
    });

    // Initial render & start autoplay
    renderCards(0);
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

  // --- 11. SCROLL EXPANSION INTRO (First-Time-Only on Initial Page Open) ---
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
    let isCompleted = false;
    let touchStartY = 0;
    let animFrame = null;
    let isAutoCompleting = false;

    // Set initial active state based on scroll position
    const currentScrollY = window.scrollY || window.pageYOffset;
    if (currentScrollY <= 15) {
      document.body.classList.add('intro-active');
      document.body.classList.remove('intro-completed');
      scrollProgress = 0;
      isCompleted = false;
    } else {
      // If user refreshed while scrolled down, skip intro completely
      document.body.classList.remove('intro-active');
      document.body.classList.add('intro-completed');
      introSection.style.display = 'none';
      return;
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

      // Fast Left & Right text slide out
      const textTranslateX = progress * (isMobile ? 180 : 130);
      const textOpacity = Math.max(0, 1 - progress * 2.8);

      if (progress >= 0.96) {
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

      // Slide bottom prompt down & fade out quickly
      if (bottomPrompt) {
        const promptOpacity = Math.max(0, 1 - progress * 3.2);
        bottomPrompt.style.transform = `translate3d(0, ${progress * 80}px, 0)`;
        bottomPrompt.style.opacity = promptOpacity.toString();
      }

      // Fade out backdrop blur overlay
      if (bgBackdrop) {
        bgBackdrop.style.opacity = Math.max(0, 1 - progress * 2.0).toString();
      }
    };

    const cleanupAndFinishIntro = () => {
      if (isCompleted) return;
      isCompleted = true;
      isAutoCompleting = false;

      document.body.classList.remove('intro-active');
      document.body.classList.add('intro-completed');

      // Remove intro event listeners so it never triggers again on scrolling up
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      // Hide intro section immediately and ensure clean start at the exact top
      if (introSection) {
        introSection.style.display = 'none';
      }
      
      // Ensure scroll is at the very top of the page (0,0)
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    };

    const smoothSetProgress = (newProgress, autoSnap = true) => {
      if (isCompleted) return;

      newProgress = Math.min(Math.max(newProgress, 0), 1);
      scrollProgress = newProgress;

      if (animFrame) cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(() => {
        renderIntroExpansion(scrollProgress);

        // Smooth auto-complete once user has scrolled past 65%
        if (autoSnap && scrollProgress >= 0.65 && !isAutoCompleting) {
          isAutoCompleting = true;
          let snapTarget = scrollProgress;
          const snapStep = () => {
            snapTarget += (1 - snapTarget) * 0.16;
            if (snapTarget >= 0.98) {
              scrollProgress = 1;
              renderIntroExpansion(1);
              cleanupAndFinishIntro();
              return;
            }
            scrollProgress = snapTarget;
            renderIntroExpansion(scrollProgress);
            requestAnimationFrame(snapStep);
          };
          requestAnimationFrame(snapStep);
          return;
        }

        if (scrollProgress >= 1) {
          cleanupAndFinishIntro();
        }
      });
    };

    // Wheel event handler (Smoothed out delta for natural control)
    const handleWheel = (e) => {
      if (isCompleted) return;

      if (e.deltaY > 0) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0018;
        smoothSetProgress(scrollProgress + scrollDelta, true);
      }
    };

    // Touch event handlers for mobile (Smooth touch factor)
    const handleTouchStart = (e) => {
      if (isCompleted) return;
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (isCompleted || !touchStartY || e.touches.length !== 1) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (deltaY > 0) {
        e.preventDefault();
        const scrollFactor = 0.006;
        const scrollDelta = deltaY * scrollFactor;
        smoothSetProgress(scrollProgress + scrollDelta, true);
        touchStartY = touchY;
      }
    };

    const handleTouchEnd = () => {
      touchStartY = 0;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Click on prompt or card to expand to main site
    if (bottomPrompt) {
      bottomPrompt.style.cursor = 'pointer';
      bottomPrompt.addEventListener('click', () => {
        smoothSetProgress(0.7, true);
      });
    }

    if (card) {
      card.addEventListener('click', () => {
        if (!isCompleted) {
          smoothSetProgress(0.7, true);
        }
      });
    }

    window.addEventListener('resize', () => {
      if (!isCompleted) {
        renderIntroExpansion(scrollProgress);
      }
    });

    // Initial render
    renderIntroExpansion(scrollProgress);
  };

  initScrollExpansionIntro();

  initScrollReveal();

  initStackedCarousel();

});






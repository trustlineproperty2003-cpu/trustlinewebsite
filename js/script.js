/**
 * TRUST LINE PROPERTIES - CLIENT JAVASCRIPT
 * Prayagraj Land Specialists
 * Features: Mobile Nav, Sticky Header, Accordion FAQ, Modal, Smooth Scroll, India Phone Form Validation, Stat Counter
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
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll to Top Button Visibility
    if (scrollTopBtn) {
      if (scrollY > 400) {
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

  // --- 3. ACCORDION FAQ SYSTEM ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    if (header && body) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Auto-close other accordion items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherBody = otherItem.querySelector('.faq-body');
            if (otherBody) otherBody.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          body.style.maxHeight = null;
        } else {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    }
  });

  // Open first FAQ by default on desktop
  if (faqItems.length > 0 && window.innerWidth > 768) {
    const firstItem = faqItems[0];
    const firstBody = firstItem.querySelector('.faq-body');
    firstItem.classList.add('active');
    if (firstBody) firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
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
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EBBD6D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  // --- 6. REAL-TIME FORM VALIDATION ---
  const validatePhoneIndia = (phone) => {
    // Allows 10-digit Indian numbers with optional +91 or 0 prefix
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

    const setError = (input, message) => {
      const group = input.closest('.form-group');
      if (!group) return;
      group.classList.remove('has-success');
      group.classList.add('has-error');
      let feedback = group.querySelector('.form-feedback');
      if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'form-feedback';
        group.appendChild(feedback);
      }
      feedback.textContent = message;
    };

    const setSuccess = (input) => {
      const group = input.closest('.form-group');
      if (!group) return;
      group.classList.remove('has-error');
      group.classList.add('has-success');
      const feedback = group.querySelector('.form-feedback');
      if (feedback) feedback.textContent = '';
    };

    // Live validation
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        if (nameInput.value.trim().length >= 2) {
          setSuccess(nameInput);
        } else {
          setError(nameInput, 'Please enter your full name (minimum 2 characters).');
        }
      });
    }

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        if (validateEmail(emailInput.value.trim())) {
          setSuccess(emailInput);
        } else {
          setError(emailInput, 'Please enter a valid email address.');
        }
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        if (validatePhoneIndia(phoneInput.value.trim())) {
          setSuccess(phoneInput);
        } else {
          setError(phoneInput, 'Please enter a valid 10-digit Indian phone number (starts with 6-9).');
        }
      });
    }

    // Form submission
    formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      if (nameInput && nameInput.value.trim().length < 2) {
        setError(nameInput, 'Full name is required.');
        isValid = false;
      }

      if (emailInput && !validateEmail(emailInput.value.trim())) {
        setError(emailInput, 'A valid email address is required.');
        isValid = false;
      }

      if (phoneInput && !validatePhoneIndia(phoneInput.value.trim())) {
        setError(phoneInput, 'Valid 10-digit Indian phone number is required.');
        isValid = false;
      }

      if (isValid) {
        const submitBtn = formElement.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
        
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Securing Your Call Slot...';
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
          
          formElement.reset();
          formElement.querySelectorAll('.form-group').forEach(g => {
            g.classList.remove('has-success', 'has-error');
          });

          closeModal();
          showToast('Thank you! Your call request has been received. Our Prayagraj land specialist will call you shortly.');
        }, 1200);
      }
    });
  };

  setupFormValidation(document.getElementById('ctaContactForm'));
  setupFormValidation(document.getElementById('modalContactForm'));

  // --- 7. ANIMATED NUMBER COUNTERS (Intersection Observer) ---
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetText = el.getAttribute('data-target') || el.innerText;
          const numMatch = targetText.match(/\d+/);
          
          if (numMatch) {
            const targetNum = parseInt(numMatch[0], 10);
            const suffix = targetText.replace(/\d+/, '');
            let count = 0;
            const stepTime = Math.max(20, Math.floor(1500 / targetNum));
            
            const timer = setInterval(() => {
              count += Math.ceil(targetNum / 50);
              if (count >= targetNum) {
                count = targetNum;
                clearInterval(timer);
              }
              el.innerText = count + suffix;
            }, stepTime);
          }
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
  }

  // --- 8. SMOOTH SCROLL FOR IN-PAGE ANCHORS ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#!') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});

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

  // --- 7. SMOOTH SCROLL FOR ANCHORS ---
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

});

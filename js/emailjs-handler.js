/**
 * TrustLine Properties — EmailJS Handler
 * Business: TrustLine Properties | Prayagraj, UP
 * Phone: +91 80027 07546 | Email: trustlineproperties@gmail.com
 *
 * ──────────────────────────────────────────────────────────────
 * SETUP INSTRUCTIONS FOR CLIENT:
 * ──────────────────────────────────────────────────────────────
 * 1. Sign up at https://www.emailjs.com (free plan: 200 emails/month)
 * 2. Click "Add New Service" → choose Gmail → connect your Gmail account
 *    → copy the SERVICE ID shown (e.g. service_abc123)
 * 3. Click "Email Templates" → "Create New Template"
 *    - Template for Book a Call form — include these variables:
 *      {{from_name}}, {{phone}}, {{preferred_time}}, {{to_name}}
 *    - Template for Contact form — include:
 *      {{from_name}}, {{phone}}, {{email}}, {{message}}, {{to_name}}
 *    - Template for Property Inquiry — include:
 *      {{from_name}}, {{phone}}, {{email}}, {{message}}, {{property_name}}, {{to_name}}
 *    Copy each TEMPLATE ID (e.g. template_xyz789)
 * 4. Go to Account → General → copy your PUBLIC KEY
 * 5. Replace the placeholder values below with your actual IDs
 * ──────────────────────────────────────────────────────────────
 */

'use strict';

// ============================================================
// CONFIGURATION — ⚠️ REPLACE THESE VALUES WITH YOUR EMAILJS IDS
// ============================================================
var EMAILJS_PUBLIC_KEY        = 'YOUR_PUBLIC_KEY';          // Account > General > Public Key
var EMAILJS_SERVICE_ID        = 'YOUR_SERVICE_ID';          // Email Services > your service
var EMAILJS_TEMPLATE_CALL     = 'YOUR_CALL_TEMPLATE_ID';    // Template for Book a Call form
var EMAILJS_TEMPLATE_CONTACT  = 'YOUR_CONTACT_TEMPLATE_ID'; // Template for Contact page form
var EMAILJS_TEMPLATE_INQUIRY  = 'YOUR_INQUIRY_TEMPLATE_ID'; // Template for Property Inquiry form

var WHATSAPP_PHONE            = '918002707546';             // Country code + number (no +)
var BUSINESS_NAME             = 'TrustLine Properties';

// ============================================================
// VALIDATION HELPERS
// ============================================================

/**
 * validatePhone — returns true if phone contains 10+ digits
 * @param {string} phone
 * @returns {boolean}
 */
function validatePhone(phone) {
  var digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
}

/**
 * validateEmail — basic RFC-style email check
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * showFieldError — marks a form field as invalid and shows error text
 * @param {HTMLElement} input
 * @param {string} message
 */
function showFieldError(input, message) {
  input.classList.add('field--error');
  input.setAttribute('aria-invalid', 'true');

  // Remove any existing error message for this field
  var existing = input.parentElement.querySelector('.field-error-msg');
  if (existing) existing.remove();

  var errorEl       = document.createElement('span');
  errorEl.className = 'field-error-msg';
  errorEl.textContent = message;
  errorEl.setAttribute('role', 'alert');
  errorEl.style.cssText = 'display:block;color:#e53e3e;font-size:0.78rem;margin-top:4px;';
  input.parentElement.appendChild(errorEl);
}

/**
 * clearFieldError — removes error state from a field
 * @param {HTMLElement} input
 */
function clearFieldError(input) {
  input.classList.remove('field--error');
  input.removeAttribute('aria-invalid');
  var errorEl = input.parentElement.querySelector('.field-error-msg');
  if (errorEl) errorEl.remove();
}

/**
 * clearAllFieldErrors — clears all error states in a form
 * @param {HTMLFormElement} form
 */
function clearAllFieldErrors(form) {
  form.querySelectorAll('.field--error').forEach(function (input) {
    clearFieldError(input);
  });
}

/**
 * setButtonLoading — disables button and shows spinner text
 * @param {HTMLButtonElement} btn
 * @param {boolean} isLoading
 */
function setButtonLoading(btn, isLoading) {
  if (isLoading) {
    btn.disabled          = true;
    btn.dataset.origText  = btn.textContent;
    btn.textContent       = 'Sending…';
    btn.classList.add('btn--loading');
  } else {
    btn.disabled    = false;
    btn.textContent = btn.dataset.origText || 'Submit';
    btn.classList.remove('btn--loading');
  }
}

/**
 * showFormError — shows a general error message below a form
 * @param {HTMLFormElement} form
 * @param {string} message
 */
function showFormError(form, message) {
  var existing = form.querySelector('.form-error-banner');
  if (existing) existing.remove();

  var banner       = document.createElement('div');
  banner.className = 'form-error-banner';
  banner.setAttribute('role', 'alert');
  banner.style.cssText = [
    'background:#fff5f5',
    'border:1px solid #fc8181',
    'color:#c53030',
    'padding:10px 14px',
    'border-radius:6px',
    'margin-top:12px',
    'font-size:0.875rem'
  ].join(';');
  banner.textContent = message;
  form.appendChild(banner);

  // Auto-remove after 6 seconds
  setTimeout(function () { if (banner.parentElement) banner.remove(); }, 6000);
}

// ============================================================
// WHATSAPP LINK HELPER
// ============================================================

/**
 * generateWhatsAppLink — builds a wa.me URL
 * @param {string} message
 * @returns {string}
 */
function generateWhatsAppLink(message) {
  return 'https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(message);
}

/**
 * initWhatsAppLinks — sets href on all .whatsapp-link elements
 */
function initWhatsAppLinks() {
  var defaultMessage = 'Hello ' + BUSINESS_NAME + '! I am interested in your property listings. Please share more details.';
  var url = generateWhatsAppLink(defaultMessage);

  document.querySelectorAll('.whatsapp-link').forEach(function (el) {
    el.setAttribute('href', url);
    if (!el.hasAttribute('target')) {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

// ============================================================
// BOOK A CALL MODAL FORM — #bookCallForm
// ============================================================
// Sends: from_name, phone, preferred_time, to_name
// Success: hides form, shows #modalSuccess
// Error: shows error banner, re-enables button

function initBookCallForm() {
  var form = document.getElementById('bookCallForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAllFieldErrors(form);

    var nameInput  = form.querySelector('[name="from_name"]');
    var phoneInput = form.querySelector('[name="phone"]');
    var timeInput  = form.querySelector('[name="preferred_time"]');
    var submitBtn  = form.querySelector('[type="submit"]');
    var hasErrors  = false;

    // Validation
    if (!nameInput || nameInput.value.trim().length < 2) {
      showFieldError(nameInput, 'Please enter your full name (at least 2 characters).');
      hasErrors = true;
    }
    if (!phoneInput || !validatePhone(phoneInput.value)) {
      showFieldError(phoneInput, 'Please enter a valid 10-digit phone number.');
      hasErrors = true;
    }
    if (hasErrors) return;

    // Loading state
    setButtonLoading(submitBtn, true);

    var templateParams = {
      from_name:      nameInput.value.trim(),
      phone:          phoneInput.value.trim(),
      preferred_time: timeInput ? timeInput.value.trim() : 'Any time',
      to_name:        BUSINESS_NAME
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CALL, templateParams)
      .then(function () {
        // Hide form, show success
        form.style.display = 'none';
        var successDiv = document.getElementById('modalSuccess');
        if (successDiv) {
          successDiv.classList.add('show');
          successDiv.removeAttribute('hidden');
        }

        // Reset form after 5 seconds so user can re-use if they open modal again
        setTimeout(function () {
          form.reset();
          form.style.display = '';
          setButtonLoading(submitBtn, false);
          if (successDiv) {
            successDiv.classList.remove('show');
            successDiv.setAttribute('hidden', '');
          }
        }, 5000);
      })
      .catch(function (error) {
        console.error('TrustLine EmailJS Error (Book a Call):', error);
        setButtonLoading(submitBtn, false);
        showFormError(form, 'Something went wrong. Please try calling us directly at +91 80027 07546.');
      });
  });

  // Real-time validation: clear errors on input
  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('input', function () { clearFieldError(field); });
  });
}

// ============================================================
// CONTACT PAGE FORM — #contactForm
// ============================================================
// Sends: from_name, phone, email, message, to_name
// Success: replaces form with inline success message

function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAllFieldErrors(form);

    var nameInput    = form.querySelector('[name="from_name"]');
    var phoneInput   = form.querySelector('[name="phone"]');
    var emailInput   = form.querySelector('[name="email"]');
    var messageInput = form.querySelector('[name="message"]');
    var submitBtn    = form.querySelector('[type="submit"]');
    var hasErrors    = false;

    // Validation
    if (!nameInput || nameInput.value.trim().length < 2) {
      showFieldError(nameInput, 'Please enter your name (at least 2 characters).');
      hasErrors = true;
    }
    if (!phoneInput || !validatePhone(phoneInput.value)) {
      showFieldError(phoneInput, 'Please enter a valid 10-digit phone number.');
      hasErrors = true;
    }
    if (emailInput && emailInput.value.trim() && !validateEmail(emailInput.value)) {
      showFieldError(emailInput, 'Please enter a valid email address.');
      hasErrors = true;
    }
    if (!messageInput || messageInput.value.trim().length < 10) {
      showFieldError(messageInput, 'Please enter a message (at least 10 characters).');
      hasErrors = true;
    }
    if (hasErrors) return;

    setButtonLoading(submitBtn, true);

    var templateParams = {
      from_name: nameInput.value.trim(),
      phone:     phoneInput.value.trim(),
      email:     emailInput ? emailInput.value.trim() : '',
      message:   messageInput.value.trim(),
      to_name:   BUSINESS_NAME
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CONTACT, templateParams)
      .then(function () {
        // Replace form content with success message
        var wrapper = form.parentElement || form;
        var successHtml = [
          '<div class="contact-success" role="alert" style="text-align:center;padding:40px 20px;">',
          '  <div style="font-size:3rem;margin-bottom:12px;">✅</div>',
          '  <h3 style="margin:0 0 8px;font-size:1.4rem;">Message Received!</h3>',
          '  <p style="color:#555;margin:0 0 16px;">',
          '    Thank you for reaching out to <strong>' + BUSINESS_NAME + '</strong>.',
          '    Our team will contact you within 24 hours.',
          '  </p>',
          '  <p style="color:#555;margin:0;">',
          '    For urgent queries, call us at',
          '    <a href="tel:+918002707546" style="color:inherit;font-weight:600;">+91 80027 07546</a>.',
          '  </p>',
          '</div>'
        ].join('');

        form.innerHTML = successHtml;
      })
      .catch(function (error) {
        console.error('TrustLine EmailJS Error (Contact Form):', error);
        setButtonLoading(submitBtn, false);
        showFormError(form, 'Something went wrong. Please email us at trustlineproperties@gmail.com or call +91 80027 07546.');
      });
  });

  // Real-time validation
  form.querySelectorAll('input, textarea').forEach(function (field) {
    field.addEventListener('input', function () { clearFieldError(field); });
  });
}

// ============================================================
// PROPERTY INQUIRY FORM — #propertyInquiryForm (property-detail.html)
// ============================================================
// Sends: from_name, phone, email, message, property_name, to_name
// Success: replaces form with inline success message

function initPropertyInquiryForm() {
  var form = document.getElementById('propertyInquiryForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAllFieldErrors(form);

    var nameInput        = form.querySelector('[name="from_name"]');
    var phoneInput       = form.querySelector('[name="phone"]');
    var emailInput       = form.querySelector('[name="email"]');
    var messageInput     = form.querySelector('[name="message"]');
    var propertyNameInput = form.querySelector('[name="property_name"]');
    var submitBtn        = form.querySelector('[type="submit"]');
    var hasErrors        = false;

    // Validation
    if (!nameInput || nameInput.value.trim().length < 2) {
      showFieldError(nameInput, 'Please enter your name.');
      hasErrors = true;
    }
    if (!phoneInput || !validatePhone(phoneInput.value)) {
      showFieldError(phoneInput, 'Please enter a valid 10-digit phone number.');
      hasErrors = true;
    }
    if (emailInput && emailInput.value.trim() && !validateEmail(emailInput.value)) {
      showFieldError(emailInput, 'Please enter a valid email address.');
      hasErrors = true;
    }
    if (hasErrors) return;

    setButtonLoading(submitBtn, true);

    var templateParams = {
      from_name:     nameInput.value.trim(),
      phone:         phoneInput.value.trim(),
      email:         emailInput ? emailInput.value.trim() : '',
      message:       messageInput ? messageInput.value.trim() : 'Interested in this property.',
      property_name: propertyNameInput ? propertyNameInput.value.trim() : 'Not specified',
      to_name:       BUSINESS_NAME
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_INQUIRY, templateParams)
      .then(function () {
        var successHtml = [
          '<div class="inquiry-success" role="alert" style="text-align:center;padding:32px 16px;background:#f0fff4;border:1px solid #9ae6b4;border-radius:8px;">',
          '  <div style="font-size:2.5rem;margin-bottom:8px;">🏠</div>',
          '  <h3 style="margin:0 0 6px;font-size:1.2rem;color:#276749;">Inquiry Sent Successfully!</h3>',
          '  <p style="color:#276749;margin:0;">',
          '    Our agent will call you back at <strong>' + (phoneInput ? phoneInput.value.trim() : '') + '</strong> shortly.',
          '  </p>',
          '</div>'
        ].join('');

        form.innerHTML = successHtml;
      })
      .catch(function (error) {
        console.error('TrustLine EmailJS Error (Property Inquiry):', error);
        setButtonLoading(submitBtn, false);
        showFormError(form, 'Failed to send inquiry. Please call us directly at +91 80027 07546.');
      });
  });

  // Real-time validation
  form.querySelectorAll('input, textarea').forEach(function (field) {
    field.addEventListener('input', function () { clearFieldError(field); });
  });
}

// ============================================================
// INIT — DOMContentLoaded
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // Initialize EmailJS SDK if available
  if (typeof emailjs !== 'undefined') {
    try {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    } catch (err) {
      console.warn('TrustLine: EmailJS init failed:', err.message);
    }
  } else {
    // EmailJS SDK not loaded — forms will degrade gracefully
    console.warn('TrustLine: EmailJS SDK not found. Make sure to include the EmailJS CDN script before this file.');
  }

  // Attach form handlers
  initBookCallForm();
  initContactForm();
  initPropertyInquiryForm();

  // Set WhatsApp links
  initWhatsAppLinks();
});

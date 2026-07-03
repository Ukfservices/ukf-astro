/**
 * UKF Services — B2B Exit Intent & Lead Capture System
 * Smart adaptive form — 3 challenge options → relevant fields
 */

(function() {
  'use strict';

  // Config
  var FORMSPREE_URL = 'https://formspree.io/f/xzdpekbl';
  var SHOW_DELAY = 45000; // 45 seconds on page
  var EXIT_SENSITIVITY = 20; // px from top to trigger exit intent
  var COOKIE_NAME = 'ukf_cta_shown';
  var COOKIE_DAYS = 7;

  // State
  var triggered = false;
  var modalShown = false;

  // Cookie helpers
  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/';
  }

  function getCookie(name) {
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(name + '=') === 0) return c.substring(name.length + 1);
    }
    return '';
  }

  // Don't show if already seen this session
  if (getCookie(COOKIE_NAME)) return;

  // Challenge options config
  var challenges = {
    quote: {
      icon: '📦',
      label: 'I need a freight quote',
      sub: 'Air, sea, road or customs',
      fields: [
        { id: 'name', label: 'Your Name', type: 'text', placeholder: 'Ahmed Al Mansouri', required: true },
        { id: 'email', label: 'Email', type: 'email', placeholder: 'ahmed@company.com', required: true },
        { id: 'phone', label: 'WhatsApp / Phone', type: 'tel', placeholder: '+971 XX XXX XXXX', required: false },
        { id: 'route', label: 'Route', type: 'text', placeholder: 'e.g. Dubai → London', required: false },
        { id: 'service', label: 'Service', type: 'select', required: false, options: [
          'Select service...', 'Air Freight', 'Ocean Freight (FCL)', 'Ocean Freight (LCL)',
          'Customs Clearance', 'Road Freight', 'Cross-Border GCC', 'Incoterms Advisory'
        ]}
      ],
      cta: 'Get My Quote — 24hr Response',
      note: '100% UAE customs compliance since 2008. No obligation.'
    },
    customs: {
      icon: '📋',
      label: 'I have a customs issue',
      sub: 'Clearance, delays or documentation',
      fields: [
        { id: 'name', label: 'Your Name', type: 'text', placeholder: 'Ahmed Al Mansouri', required: true },
        { id: 'email', label: 'Email', type: 'email', placeholder: 'ahmed@company.com', required: true },
        { id: 'phone', label: 'WhatsApp / Phone', type: 'tel', placeholder: '+971 XX XXX XXXX', required: true },
        { id: 'issue', label: 'Describe your customs issue', type: 'textarea', placeholder: 'e.g. Shipment held at Dubai Customs, incorrect HS code flagged...', required: true }
      ],
      cta: 'Speak to a Customs Specialist',
      note: 'We respond within 2 hours for urgent customs issues.'
    },
    corridor: {
      icon: '🌏',
      label: 'I\'m exploring a trade corridor',
      sub: 'New routes, Indonesia, GCC–Europe',
      fields: [
        { id: 'name', label: 'Your Name', type: 'text', placeholder: 'Ahmed Al Mansouri', required: true },
        { id: 'email', label: 'Email', type: 'email', placeholder: 'ahmed@company.com', required: true },
        { id: 'corridor', label: 'Which corridor?', type: 'select', required: false, options: [
          'Select corridor...', 'UAE → UK', 'UAE → Europe', 'UAE → USA',
          'UAE → Indonesia', 'UAE → China', 'UAE → GCC Cross-Border', 'Other'
        ]},
        { id: 'cargo', label: 'Cargo type', type: 'text', placeholder: 'e.g. Electronics, Food, Textiles', required: false }
      ],
      cta: 'Get Corridor Intelligence',
      note: 'Our specialists know every route. Free initial consultation.'
    }
  };

  // Build modal HTML
  function buildModal() {
    var modal = document.createElement('div');
    modal.id = 'ukf-cta-modal';
    modal.innerHTML = `
      <div class="ukf-modal-backdrop"></div>
      <div class="ukf-modal-box" role="dialog" aria-modal="true" aria-labelledby="ukf-modal-title">
        <button class="ukf-modal-close" id="ukf-modal-close" aria-label="Close">&times;</button>

        <!-- Step 1: Challenge selection -->
        <div id="ukf-step-1">
          <div class="ukf-modal-header">
            <div class="ukf-modal-badge">UKF SERVICES · DUBAI CARGO VILLAGE</div>
            <h2 id="ukf-modal-title">Before You Go — One Question.</h2>
            <p>What's your most pressing freight challenge right now?</p>
          </div>
          <div class="ukf-challenge-options">
            <button class="ukf-challenge-btn" data-challenge="quote">
              <span class="ukf-challenge-icon">📦</span>
              <div>
                <strong>I need a freight quote</strong>
                <span>Air, sea, road or customs</span>
              </div>
              <span class="ukf-challenge-arrow">→</span>
            </button>
            <button class="ukf-challenge-btn" data-challenge="customs">
              <span class="ukf-challenge-icon">📋</span>
              <div>
                <strong>I have a customs issue</strong>
                <span>Clearance, delays or documentation</span>
              </div>
              <span class="ukf-challenge-arrow">→</span>
            </button>
            <button class="ukf-challenge-btn" data-challenge="corridor">
              <span class="ukf-challenge-icon">🌏</span>
              <div>
                <strong>I'm exploring a trade corridor</strong>
                <span>New routes, Indonesia, GCC–Europe</span>
              </div>
              <span class="ukf-challenge-arrow">→</span>
            </button>
          </div>
          <p class="ukf-modal-footer-note">17+ years at Dubai Cargo Village · 100% UAE customs compliance · 200+ exporters served</p>
        </div>

        <!-- Step 2: Adaptive form -->
        <div id="ukf-step-2" style="display:none;">
          <div class="ukf-modal-header">
            <button class="ukf-back-btn" id="ukf-back-btn">← Back</button>
            <div id="ukf-step2-icon" class="ukf-step2-icon"></div>
            <h2 id="ukf-step2-title"></h2>
            <p id="ukf-step2-sub"></p>
          </div>
          <form id="ukf-adaptive-form" class="ukf-form">
            <div id="ukf-form-fields"></div>
            <input type="hidden" name="challenge_type" id="ukf-challenge-type" value="" />
            <input type="hidden" name="_subject" value="UKF Website Enquiry" />
            <button type="submit" class="ukf-submit-btn" id="ukf-submit-btn">
              <span id="ukf-submit-text">Submit</span>
            </button>
            <p class="ukf-form-note" id="ukf-form-note"></p>
          </form>
        </div>

        <!-- Step 3: Success -->
        <div id="ukf-step-3" style="display:none;">
          <div class="ukf-success">
            <div class="ukf-success-icon">✓</div>
            <h2>We'll be in touch.</h2>
            <p>Your enquiry has been received by our Dubai Cargo Village team. Expect a response within 24 hours — or call us directly on <a href="tel:+971552572837">+971 55 257 2837</a>.</p>
            <a href="https://wa.me/971552572837" target="_blank" rel="noopener" class="ukf-wa-btn">
              Continue on WhatsApp →
            </a>
          </div>
        </div>

      </div>
    `;
    return modal;
  }

  // Build form fields for selected challenge
  function buildFields(challenge) {
    var config = challenges[challenge];
    var html = '';
    config.fields.forEach(function(field) {
      html += '<div class="ukf-field">';
      html += '<label for="ukf-' + field.id + '">' + field.label + (field.required ? ' <span>*</span>' : '') + '</label>';

      if (field.type === 'select') {
        html += '<select id="ukf-' + field.id + '" name="' + field.id + '">';
        field.options.forEach(function(opt) {
          html += '<option>' + opt + '</option>';
        });
        html += '</select>';
      } else if (field.type === 'textarea') {
        html += '<textarea id="ukf-' + field.id + '" name="' + field.id + '" placeholder="' + field.placeholder + '" rows="3"></textarea>';
      } else {
        html += '<input type="' + field.type + '" id="ukf-' + field.id + '" name="' + field.id + '" placeholder="' + (field.placeholder || '') + '"' + (field.required ? ' required' : '') + ' />';
      }
      html += '</div>';
    });
    return html;
  }

  // Show modal
  function showModal() {
    if (modalShown) return;
    modalShown = true;
    setCookie(COOKIE_NAME, '1', COOKIE_DAYS);

    var modal = buildModal();
    document.body.appendChild(modal);

    // Animate in
    requestAnimationFrame(function() {
      modal.classList.add('ukf-modal-visible');
    });

    var step1 = document.getElementById('ukf-step-1');
    var step2 = document.getElementById('ukf-step-2');
    var step3 = document.getElementById('ukf-step-3');
    var closeBtn = document.getElementById('ukf-modal-close');
    var backBtn = document.getElementById('ukf-back-btn');
    var form = document.getElementById('ukf-adaptive-form');
    var currentChallenge = '';

    // Close
    function closeModal() {
      modal.classList.remove('ukf-modal-visible');
      setTimeout(function() { if (modal.parentNode) modal.parentNode.removeChild(modal); }, 400);
    }

    closeBtn.addEventListener('click', closeModal);
    modal.querySelector('.ukf-modal-backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });

    // Challenge selection
    modal.querySelectorAll('.ukf-challenge-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        currentChallenge = btn.getAttribute('data-challenge');
        var config = challenges[currentChallenge];

        document.getElementById('ukf-step2-icon').textContent = config.icon;
        document.getElementById('ukf-step2-title').textContent = config.label;
        document.getElementById('ukf-step2-sub').textContent = config.sub;
        document.getElementById('ukf-form-fields').innerHTML = buildFields(currentChallenge);
        document.getElementById('ukf-submit-text').textContent = config.cta;
        document.getElementById('ukf-form-note').textContent = config.note;
        document.getElementById('ukf-challenge-type').value = currentChallenge;

        step1.style.display = 'none';
        step2.style.display = 'block';
      });
    });

    // Back
    backBtn.addEventListener('click', function() {
      step2.style.display = 'none';
      step1.style.display = 'block';
    });

    // Form submit
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var submitBtn = document.getElementById('ukf-submit-btn');
      var submitText = document.getElementById('ukf-submit-text');
      submitBtn.disabled = true;
      submitText.textContent = 'Sending...';

      fetch(FORMSPREE_URL, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function(res) {
        if (res.ok) {
          step2.style.display = 'none';
          step3.style.display = 'block';
          if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_modal_submit', {
              event_category: 'Lead Generation',
              event_label: currentChallenge
            });
          }
        } else {
          submitText.textContent = challenges[currentChallenge].cta;
          submitBtn.disabled = false;
        }
      }).catch(function() {
        submitText.textContent = challenges[currentChallenge].cta;
        submitBtn.disabled = false;
      });
    });
  }

  // Inject styles
  var styles = `
    #ukf-cta-modal {
      position: fixed;
      inset: 0;
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.4s ease;
      padding: 20px;
    }
    #ukf-cta-modal.ukf-modal-visible { opacity: 1; }
    .ukf-modal-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(10, 22, 40, 0.85);
      backdrop-filter: blur(4px);
    }
    .ukf-modal-box {
      position: relative;
      background: #ffffff;
      border-radius: 16px;
      padding: 40px;
      max-width: 520px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 32px 80px rgba(0,0,0,0.4);
      transform: translateY(20px);
      transition: transform 0.4s ease;
    }
    #ukf-cta-modal.ukf-modal-visible .ukf-modal-box { transform: translateY(0); }
    .ukf-modal-close {
      position: absolute;
      top: 16px; right: 16px;
      background: #f4f4f4;
      border: none;
      width: 32px; height: 32px;
      border-radius: 50%;
      font-size: 18px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: #666;
      transition: background 0.2s;
      line-height: 1;
    }
    .ukf-modal-close:hover { background: #e8e8e8; }
    .ukf-modal-badge {
      display: inline-block;
      background: rgba(201,168,76,0.12);
      border: 1px solid rgba(201,168,76,0.3);
      color: #c9a84c;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 2px;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 14px;
      font-family: 'Inter', sans-serif;
    }
    .ukf-modal-header { text-align: center; margin-bottom: 28px; }
    .ukf-modal-header h2 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 26px;
      font-weight: 800;
      color: #0a1628;
      margin-bottom: 8px;
      line-height: 1.25;
    }
    .ukf-modal-header p { font-size: 14px; color: #666; font-family: 'Inter', sans-serif; margin: 0; }
    .ukf-challenge-options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
    .ukf-challenge-btn {
      display: flex;
      align-items: center;
      gap: 14px;
      background: #f8f6f0;
      border: 1.5px solid #e8e8e8;
      border-radius: 10px;
      padding: 16px 18px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
      width: 100%;
      font-family: 'Inter', sans-serif;
    }
    .ukf-challenge-btn:hover {
      border-color: #c9a84c;
      background: #fffdf5;
      transform: translateX(4px);
    }
    .ukf-challenge-icon { font-size: 24px; flex-shrink: 0; }
    .ukf-challenge-btn div { flex: 1; }
    .ukf-challenge-btn strong { display: block; font-size: 14px; color: #0a1628; margin-bottom: 2px; }
    .ukf-challenge-btn span { font-size: 12px; color: #888; }
    .ukf-challenge-arrow { color: #c9a84c; font-size: 18px; font-weight: 700; flex-shrink: 0; }
    .ukf-modal-footer-note { font-size: 11px; color: #aaa; text-align: center; font-family: 'Inter', sans-serif; margin: 0; }

    /* Step 2 */
    .ukf-back-btn {
      background: none; border: none; color: #c9a84c;
      font-size: 13px; font-weight: 600; cursor: pointer;
      font-family: 'Inter', sans-serif; padding: 0; margin-bottom: 16px;
    }
    .ukf-step2-icon { font-size: 36px; margin-bottom: 10px; }
    .ukf-form { display: flex; flex-direction: column; gap: 14px; }
    .ukf-field { display: flex; flex-direction: column; gap: 5px; }
    .ukf-field label { font-size: 11px; font-weight: 700; color: #0a1628; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Inter', sans-serif; }
    .ukf-field label span { color: #e63946; }
    .ukf-field input, .ukf-field select, .ukf-field textarea {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: #1a1a2e;
      border: 1.5px solid #e8e8e8;
      border-radius: 8px;
      padding: 10px 14px;
      outline: none;
      transition: border-color 0.2s;
      width: 100%;
      background: #fff;
    }
    .ukf-field input:focus, .ukf-field select:focus, .ukf-field textarea:focus { border-color: #c9a84c; }
    .ukf-field textarea { resize: vertical; min-height: 80px; }
    .ukf-submit-btn {
      background: #0a1628;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 700;
      padding: 14px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;
      width: 100%;
      margin-top: 4px;
    }
    .ukf-submit-btn:hover { background: #c9a84c; color: #0a1628; }
    .ukf-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .ukf-form-note { font-size: 12px; color: #aaa; text-align: center; font-family: 'Inter', sans-serif; margin: 0; }

    /* Step 3 */
    .ukf-success { text-align: center; padding: 20px 0; }
    .ukf-success-icon {
      width: 64px; height: 64px;
      border-radius: 50%;
      background: #10b981;
      color: #fff;
      font-size: 28px;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
    }
    .ukf-success h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; color: #0a1628; margin-bottom: 12px; }
    .ukf-success p { font-size: 14px; color: #666; line-height: 1.7; margin-bottom: 24px; font-family: 'Inter', sans-serif; }
    .ukf-success a { color: #c9a84c; font-weight: 600; }
    .ukf-wa-btn {
      display: inline-block;
      background: #25D366;
      color: #fff !important;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      padding: 12px 28px;
      border-radius: 8px;
      text-decoration: none;
      transition: opacity 0.2s;
    }
    .ukf-wa-btn:hover { opacity: 0.9; }

    @media (max-width: 560px) {
      .ukf-modal-box { padding: 28px 20px; }
      .ukf-modal-header h2 { font-size: 22px; }
    }
  `;

  var styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Triggers
  function tryShow() {
    if (triggered) return;
    triggered = true;
    setTimeout(showModal, 300);
  }

  // Exit intent — mouse leaves viewport from top
  document.addEventListener('mouseleave', function(e) {
    if (e.clientY < EXIT_SENSITIVITY) tryShow();
  });

  // Time on page fallback
  setTimeout(tryShow, SHOW_DELAY);

  // Scroll depth fallback — 70% of page
  window.addEventListener('scroll', function() {
    var scrollPct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    if (scrollPct > 70) tryShow();
  }, { passive: true });

})();

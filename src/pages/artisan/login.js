/**
 * Artisan Login — Knoticeable
 * OTP phone login with WhatsApp-style simplicity
 */

import { navigate } from '../../router.js';
import { setCurrentArtisan } from '../../utils/demo-data.js';
import { showToast } from '../../components/toast.js';

let currentView = 'phone'; // 'phone' | 'otp'
let phoneNumber = '';
let otpDigits = ['', '', '', '', '', ''];
let resendTimer = 30;
let resendInterval = null;

export function render() {
  if (currentView === 'otp') {
    return renderOtpView();
  }
  return renderPhoneView();
}

function renderPhoneView() {
  return `
    <section class="page page--no-header page--no-nav" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100dvh;padding:var(--space-6);">
      <div style="width:100%;max-width:360px;text-align:center;">
        
        <!-- Yarn emoji -->
        <div style="font-size:4rem;margin-bottom:var(--space-6);line-height:1;">🧶</div>
        
        <!-- Welcome text -->
        <h1 style="font-size:var(--text-2xl);font-weight:var(--font-bold);color:var(--color-on-surface);margin-bottom:var(--space-2);">
          Welcome to Knoticeable
        </h1>
        
        <!-- Subtitle -->
        <p class="text-muted" style="margin-bottom:var(--space-8);font-size:var(--text-base);">
          Set up your crochet shop in 2 minutes
        </p>
        
        <!-- Phone input -->
        <div class="input-group" style="margin-bottom:var(--space-6);">
          <div class="input-with-prefix" style="min-height:56px;">
            <span class="input-prefix" style="min-height:56px;">+91</span>
            <input 
              type="tel" 
              id="phone-input"
              class="input" 
              placeholder="Enter phone number"
              maxlength="10"
              inputmode="numeric"
              pattern="[0-9]*"
              autocomplete="tel"
              aria-label="Phone number"
              style="min-height:56px;border:none;box-sizing:border-box;"
            />
          </div>
        </div>
        
        <!-- Send OTP button -->
        <button id="send-otp-btn" class="btn btn-primary" style="text-transform:uppercase;font-size:var(--text-base);letter-spacing:0.5px;">
          📲 SEND OTP
        </button>
        
        <!-- Progress dots -->
        <div class="progress-steps" style="margin-top:var(--space-8);margin-bottom:0;">
          <span class="progress-dot progress-dot--active"></span>
          <span class="progress-dot"></span>
          <span class="progress-dot"></span>
          <span class="progress-dot"></span>
        </div>
        
      </div>
    </section>
  `;
}

function renderOtpView() {
  return `
    <section class="page page--no-header page--no-nav" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100dvh;padding:var(--space-6);">
      <div style="width:100%;max-width:360px;text-align:center;">
        
        <!-- Lock emoji -->
        <div style="font-size:4rem;margin-bottom:var(--space-6);line-height:1;">🔐</div>
        
        <!-- Title -->
        <h1 style="font-size:var(--text-2xl);font-weight:var(--font-bold);color:var(--color-on-surface);margin-bottom:var(--space-2);">
          Enter OTP
        </h1>
        
        <!-- Subtitle -->
        <p class="text-muted" style="margin-bottom:var(--space-8);font-size:var(--text-sm);">
          Sent to +91 ${phoneNumber}
        </p>
        
        <!-- OTP digit boxes -->
        <div id="otp-container" style="display:flex;gap:var(--space-2);justify-content:center;margin-bottom:var(--space-6);">
          ${[0,1,2,3,4,5].map(i => `
            <input 
              type="tel"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="1"
              class="otp-digit"
              data-index="${i}"
              aria-label="OTP digit ${i + 1}"
              autocomplete="one-time-code"
              style="
                width:52px;
                height:52px;
                text-align:center;
                font-size:var(--text-xl);
                font-weight:var(--font-bold);
                background:var(--color-surface-variant);
                border:2px solid var(--color-border);
                border-radius:var(--radius-md);
                color:var(--color-on-surface);
                transition:all var(--transition-fast);
                box-sizing:border-box;
              "
            />
          `).join('')}
        </div>
        
        <!-- Resend timer -->
        <p id="resend-text" class="text-muted" style="margin-bottom:var(--space-6);font-size:var(--text-sm);">
          Didn't get it? <span id="resend-action" style="color:var(--color-on-surface-muted);">Resend in ${resendTimer}s</span>
        </p>
        
        <!-- Verify button -->
        <button id="verify-btn" class="btn btn-primary" style="text-transform:uppercase;font-size:var(--text-base);letter-spacing:0.5px;">
          ✅ VERIFY
        </button>
        
        <!-- Back link -->
        <button id="back-to-phone" class="btn btn-ghost" style="margin-top:var(--space-3);font-size:var(--text-sm);">
          ← Change phone number
        </button>
        
        <!-- Progress dots -->
        <div class="progress-steps" style="margin-top:var(--space-6);margin-bottom:0;">
          <span class="progress-dot progress-dot--done"></span>
          <span class="progress-dot progress-dot--active"></span>
          <span class="progress-dot"></span>
          <span class="progress-dot"></span>
        </div>
        
      </div>
    </section>
  `;
}

export function init() {
  if (currentView === 'phone') {
    initPhoneView();
  } else {
    initOtpView();
  }

  // Cleanup function
  return () => {
    if (resendInterval) {
      clearInterval(resendInterval);
      resendInterval = null;
    }
  };
}

function initPhoneView() {
  const phoneInput = document.getElementById('phone-input');
  const sendBtn = document.getElementById('send-otp-btn');

  if (phoneInput) {
    phoneInput.value = phoneNumber;
    phoneInput.focus();

    // Only allow digits
    phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
      phoneNumber = e.target.value;
    });

    phoneInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sendBtn?.click();
      }
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      if (phoneNumber.length < 10) {
        showToast('Please enter a valid 10-digit phone number', 'error');
        phoneInput?.focus();
        return;
      }

      showToast('OTP sent to +91 ' + phoneNumber, 'success');
      currentView = 'otp';
      resendTimer = 30;

      // Re-render
      const app = document.getElementById('app');
      app.innerHTML = render();
      init();
    });
  }
}

function initOtpView() {
  const digits = document.querySelectorAll('.otp-digit');
  const verifyBtn = document.getElementById('verify-btn');
  const backBtn = document.getElementById('back-to-phone');
  const resendAction = document.getElementById('resend-action');

  // Auto-advance OTP inputs
  digits.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      const val = e.target.value.replace(/\D/g, '');
      e.target.value = val.slice(0, 1);
      otpDigits[index] = e.target.value;

      if (val && index < 5) {
        digits[index + 1].focus();
      }

      // Style filled inputs
      if (e.target.value) {
        e.target.style.borderColor = 'var(--color-primary)';
        e.target.style.background = 'var(--color-primary-light)';
      } else {
        e.target.style.borderColor = 'var(--color-border)';
        e.target.style.background = 'var(--color-surface-variant)';
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        digits[index - 1].focus();
        digits[index - 1].value = '';
        otpDigits[index - 1] = '';
      }
    });

    input.addEventListener('focus', () => {
      input.select();
    });
  });

  // Focus first digit
  if (digits[0]) digits[0].focus();

  // Resend countdown timer
  startResendTimer(resendAction);

  // Verify button
  if (verifyBtn) {
    verifyBtn.addEventListener('click', () => {
      const otp = otpDigits.join('');
      if (otp.length < 6) {
        showToast('Please enter the complete 6-digit OTP', 'error');
        return;
      }

      // Demo: any 6-digit OTP is valid
      showToast('Phone verified successfully!', 'success');

      // Reset state for next visit
      currentView = 'phone';
      otpDigits = ['', '', '', '', '', ''];
      if (resendInterval) {
        clearInterval(resendInterval);
        resendInterval = null;
      }

      navigate('/artisan/onboard');
    });
  }

  // Back to phone
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      currentView = 'phone';
      if (resendInterval) {
        clearInterval(resendInterval);
        resendInterval = null;
      }

      const app = document.getElementById('app');
      app.innerHTML = render();
      init();
    });
  }
}

function startResendTimer(resendAction) {
  if (resendInterval) clearInterval(resendInterval);

  resendTimer = 30;
  updateResendText(resendAction);

  resendInterval = setInterval(() => {
    resendTimer--;
    updateResendText(resendAction);

    if (resendTimer <= 0) {
      clearInterval(resendInterval);
      resendInterval = null;
    }
  }, 1000);
}

function updateResendText(el) {
  if (!el) return;

  if (resendTimer > 0) {
    el.innerHTML = `Resend in ${resendTimer}s`;
    el.style.color = 'var(--color-on-surface-muted)';
    el.style.cursor = 'default';
  } else {
    el.innerHTML = `<strong style="color:var(--color-primary);cursor:pointer;">Resend OTP</strong>`;
    el.style.cursor = 'pointer';

    el.onclick = () => {
      showToast('OTP resent to +91 ' + phoneNumber, 'success');
      startResendTimer(el);
    };
  }
}

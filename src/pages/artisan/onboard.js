/**
 * Artisan Onboarding — Knoticeable
 * Chat-bubble style step-by-step wizard
 */

import { navigate } from '../../router.js';
import { setCurrentArtisan } from '../../utils/demo-data.js';
import { showToast } from '../../components/toast.js';

let currentStep = 1; // 1 = shop name, 2 = UPI ID
let shopName = '';
let upiId = '';

export function render() {
  return `
    <section class="page page--no-header page--no-nav" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100dvh;padding:var(--space-6);">
      <div style="width:100%;max-width:360px;">
        ${currentStep === 1 ? renderStep1() : renderStep2()}
      </div>
    </section>
  `;
}

function renderStep1() {
  return `
    <!-- Progress dots (step 3 of 4 — login was 1-2) -->
    <div class="progress-steps" style="margin-bottom:var(--space-8);">
      <span class="progress-dot progress-dot--done"></span>
      <span class="progress-dot progress-dot--done"></span>
      <span class="progress-dot progress-dot--active"></span>
      <span class="progress-dot"></span>
    </div>
    
    <!-- Emoji header -->
    <div style="text-align:center;font-size:4rem;margin-bottom:var(--space-6);line-height:1;">🏪</div>
    
    <!-- Chat bubble -->
    <div style="
      background:var(--color-surface-variant);
      border-radius:var(--radius-bubble);
      border-top-left-radius:var(--space-1);
      padding:var(--space-4) var(--space-5);
      margin-bottom:var(--space-8);
      font-size:var(--text-base);
      color:var(--color-on-surface);
      line-height:var(--leading-normal);
      position:relative;
    ">
      What should we call your shop? 🎨
    </div>
    
    <!-- Shop name input -->
    <div class="input-group" style="margin-bottom:var(--space-6);">
      <input 
        type="text"
        id="shop-name-input"
        class="input"
        placeholder="e.g. Priya's Crochet"
        maxlength="50"
        autocomplete="organization"
        aria-label="Shop name"
        style="min-height:56px;font-size:var(--text-lg);box-sizing:border-box;"
      />
    </div>
    
    <!-- Next button -->
    <button id="step1-next-btn" class="btn btn-primary" style="text-transform:uppercase;font-size:var(--text-base);letter-spacing:0.5px;">
      ✅ NEXT
    </button>
  `;
}

function renderStep2() {
  return `
    <!-- Progress dots (step 4 of 4) -->
    <div class="progress-steps" style="margin-bottom:var(--space-8);">
      <span class="progress-dot progress-dot--done"></span>
      <span class="progress-dot progress-dot--done"></span>
      <span class="progress-dot progress-dot--done"></span>
      <span class="progress-dot progress-dot--active"></span>
    </div>
    
    <!-- Emoji header -->
    <div style="text-align:center;font-size:4rem;margin-bottom:var(--space-6);line-height:1;">💰</div>
    
    <!-- Chat bubble -->
    <div style="
      background:var(--color-surface-variant);
      border-radius:var(--radius-bubble);
      border-top-left-radius:var(--space-1);
      padding:var(--space-4) var(--space-5);
      margin-bottom:var(--space-8);
      font-size:var(--text-base);
      color:var(--color-on-surface);
      line-height:var(--leading-normal);
      position:relative;
    ">
      Where should we send your earnings? 💸
    </div>
    
    <!-- UPI ID input -->
    <div class="input-group" style="margin-bottom:var(--space-2);">
      <input 
        type="text"
        id="upi-input"
        class="input"
        placeholder="yourname@upi"
        maxlength="50"
        autocomplete="off"
        aria-label="UPI ID"
        style="min-height:56px;font-size:var(--text-lg);box-sizing:border-box;"
      />
    </div>
    
    <!-- Helper text -->
    <p class="input-hint" style="margin-bottom:var(--space-6);text-align:center;">
      This is the same UPI ID you use in Google Pay, PhonePe, or Paytm
    </p>
    
    <!-- Start Selling button -->
    <button id="step2-finish-btn" class="btn btn-primary" style="text-transform:uppercase;font-size:var(--text-base);letter-spacing:0.5px;">
      🎉 START SELLING
    </button>
    
    <!-- Back link -->
    <button id="back-to-step1" class="btn btn-ghost" style="margin-top:var(--space-3);font-size:var(--text-sm);">
      ← Back
    </button>
  `;
}

export function init() {
  if (currentStep === 1) {
    initStep1();
  } else {
    initStep2();
  }
}

function initStep1() {
  const nameInput = document.getElementById('shop-name-input');
  const nextBtn = document.getElementById('step1-next-btn');

  if (nameInput) {
    nameInput.value = shopName;
    nameInput.focus();

    nameInput.addEventListener('input', (e) => {
      shopName = e.target.value;
    });

    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') nextBtn?.click();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (!shopName.trim()) {
        showToast('Please enter a shop name', 'error');
        nameInput?.focus();
        return;
      }

      currentStep = 2;
      const app = document.getElementById('app');
      app.innerHTML = render();
      init();
    });
  }
}

function initStep2() {
  const upiInput = document.getElementById('upi-input');
  const finishBtn = document.getElementById('step2-finish-btn');
  const backBtn = document.getElementById('back-to-step1');

  if (upiInput) {
    upiInput.value = upiId;
    upiInput.focus();

    upiInput.addEventListener('input', (e) => {
      upiId = e.target.value;
    });

    upiInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') finishBtn?.click();
    });
  }

  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      if (!upiId.trim()) {
        showToast('Please enter your UPI ID', 'error');
        upiInput?.focus();
        return;
      }

      if (!upiId.includes('@')) {
        showToast('Please enter a valid UPI ID (e.g. name@upi)', 'error');
        upiInput?.focus();
        return;
      }

      // Save artisan data
      const artisan = {
        uid: 'artisan-new-' + Date.now(),
        phone: '+91' + (localStorage.getItem('crochet_phone') || '9876543210'),
        shopName: shopName.trim(),
        upiId: upiId.trim(),
        bio: '',
        profileImageUrl: '',
        isActive: true,
        createdAt: new Date(),
      };

      setCurrentArtisan(artisan);
      showToast('🎉 Your shop is ready! Welcome aboard!', 'success');

      // Reset state
      currentStep = 1;
      shopName = '';
      upiId = '';

      navigate('/artisan/dashboard');
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      currentStep = 1;
      const app = document.getElementById('app');
      app.innerHTML = render();
      init();
    });
  }
}

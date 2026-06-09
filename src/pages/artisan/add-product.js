/**
 * Add Product — Knoticeable
 * 1-click product uploader for artisans
 */

import { navigate } from '../../router.js';
import { showToast } from '../../components/toast.js';
import { demoCategories } from '../../utils/demo-data.js';

let selectedCategory = '';
let imagePreviewUrl = '';
let isListed = false;

export function render() {
  if (isListed) {
    return renderSuccess();
  }
  return renderForm();
}

function renderForm() {
  return `
    <!-- Fixed Header -->
    <header class="header">
      <a class="header__action" id="back-btn" href="#/artisan/dashboard" aria-label="Go back" role="button">
        ←
      </a>
      <div class="header__title">Add Product</div>
    </header>

    <section class="page page--no-nav">
      
      <!-- Upload Zone -->
      <div class="upload-zone ${imagePreviewUrl ? 'upload-zone--filled' : ''}" id="upload-zone" role="button" tabindex="0" aria-label="Tap to add photo">
        ${imagePreviewUrl ? `
          <img class="upload-zone__preview" src="${imagePreviewUrl}" alt="Product preview" />
          <button class="upload-zone__remove" id="remove-image-btn" aria-label="Remove image" type="button">✕</button>
        ` : `
          <span class="upload-zone__icon">📷</span>
          <span class="upload-zone__text">Tap to add photo</span>
        `}
      </div>
      <input 
        type="file" 
        id="file-input" 
        accept="image/*" 
        capture="environment" 
        style="display:none;" 
        aria-hidden="true"
      />

      <!-- Product Name -->
      <div class="input-group">
        <input 
          type="text"
          id="product-name"
          class="input"
          placeholder="What did you make?"
          maxlength="100"
          aria-label="Product name"
          style="min-height:52px;box-sizing:border-box;"
        />
      </div>

      <!-- Price -->
      <div class="input-group">
        <div class="input-with-prefix" style="min-height:52px;">
          <span class="input-prefix" style="min-height:52px;">₹</span>
          <input 
            type="tel"
            inputmode="numeric"
            id="product-price"
            class="input"
            placeholder="Price"
            maxlength="6"
            aria-label="Product price in rupees"
            style="min-height:52px;border:none;box-sizing:border-box;"
          />
        </div>
      </div>

      <!-- Category chips -->
      <div style="margin-bottom:var(--space-6);">
        <label class="input-label" style="margin-bottom:var(--space-3);">Category</label>
        <div id="category-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-2);">
          ${demoCategories.map(cat => `
            <div 
              class="chip ${selectedCategory === cat.id ? 'chip--active' : ''}" 
              data-category="${cat.id}"
              role="radio"
              tabindex="0"
              aria-checked="${selectedCategory === cat.id}"
              aria-label="${cat.name}"
            >
              <span class="chip__icon">${cat.icon}</span>
              <span>${cat.name}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- List button -->
      <button id="list-btn" class="btn btn-primary" style="text-transform:uppercase;font-size:var(--text-base);letter-spacing:0.5px;">
        ✅ LIST FOR SALE
      </button>

    </section>
  `;
}

function renderSuccess() {
  return `
    <!-- Fixed Header -->
    <header class="header">
      <div class="header__title" style="justify-content:center;">
        <span>🧶</span>
        <span>Knoticeable</span>
      </div>
    </header>

    <section class="page page--no-nav" style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <div style="width:100%;max-width:360px;text-align:center;">
        
        <!-- Success emoji -->
        <div style="font-size:5rem;margin-bottom:var(--space-6);line-height:1;">🎉</div>
        
        <!-- Chat bubble success message -->
        <div style="
          background:var(--color-success-light);
          border-radius:var(--radius-bubble);
          border-top-left-radius:var(--space-1);
          padding:var(--space-5) var(--space-6);
          margin-bottom:var(--space-8);
          font-size:var(--text-base);
          color:var(--color-success);
          line-height:var(--leading-normal);
          text-align:left;
          font-weight:var(--font-medium);
        ">
          Your product is now live in search results! 🎉
        </div>
        
        <!-- Action buttons -->
        <button id="add-another-btn" class="btn btn-primary" style="margin-bottom:var(--space-3);">
          📸 Add Another Product
        </button>
        <button id="go-dashboard-btn" class="btn btn-secondary">
          🏠 Go to Dashboard
        </button>
      </div>
    </section>
  `;
}

export function init() {
  if (isListed) {
    initSuccess();
    return;
  }
  initForm();
}

function initForm() {
  const uploadZone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');
  const removeBtn = document.getElementById('remove-image-btn');
  const listBtn = document.getElementById('list-btn');
  const priceInput = document.getElementById('product-price');
  const categoryChips = document.querySelectorAll('#category-grid .chip');

  // Upload zone click → trigger file input
  if (uploadZone && fileInput) {
    uploadZone.addEventListener('click', (e) => {
      // Don't open file picker if clicking remove button
      if (e.target.id === 'remove-image-btn' || e.target.closest('#remove-image-btn')) return;
      fileInput.click();
    });

    uploadZone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
      }
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          imagePreviewUrl = ev.target.result;
          // Re-render just the upload zone
          reRenderPage();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Remove image
  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      imagePreviewUrl = '';
      if (fileInput) fileInput.value = '';
      reRenderPage();
    });
  }

  // Price input: only allow numbers
  if (priceInput) {
    priceInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  }

  // Category chips
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      selectedCategory = chip.dataset.category;
      // Update active states
      categoryChips.forEach(c => {
        c.classList.remove('chip--active');
        c.setAttribute('aria-checked', 'false');
      });
      chip.classList.add('chip--active');
      chip.setAttribute('aria-checked', 'true');
    });

    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        chip.click();
      }
    });
  });

  // List button
  if (listBtn) {
    listBtn.addEventListener('click', () => {
      const name = document.getElementById('product-name')?.value?.trim();
      const price = document.getElementById('product-price')?.value?.trim();

      if (!name) {
        showToast('Please enter a product name', 'error');
        document.getElementById('product-name')?.focus();
        return;
      }

      if (!price || parseInt(price) <= 0) {
        showToast('Please enter a valid price', 'error');
        document.getElementById('product-price')?.focus();
        return;
      }

      if (!selectedCategory) {
        showToast('Please select a category', 'error');
        return;
      }

      // Demo: show success
      showToast('Product listed successfully!', 'success');
      isListed = true;
      reRenderPage();
    });
  }
}

function initSuccess() {
  const addAnotherBtn = document.getElementById('add-another-btn');
  const goDashboardBtn = document.getElementById('go-dashboard-btn');

  if (addAnotherBtn) {
    addAnotherBtn.addEventListener('click', () => {
      resetState();
      reRenderPage();
    });
  }

  if (goDashboardBtn) {
    goDashboardBtn.addEventListener('click', () => {
      resetState();
      navigate('/artisan/dashboard');
    });
  }
}

function resetState() {
  selectedCategory = '';
  imagePreviewUrl = '';
  isListed = false;
}

function reRenderPage() {
  const app = document.getElementById('app');
  app.innerHTML = render();
  init();
}

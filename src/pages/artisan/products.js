/**
 * My Products — Knoticeable
 * Product list manager for artisans
 */

import { navigate } from '../../router.js';
import { demoProducts } from '../../utils/demo-data.js';
import { formatRupees } from '../../utils/format.js';
import { showToast } from '../../components/toast.js';

// Track availability toggles locally (in a real app, this persists)
let availabilityState = {};

export function render() {
  const products = demoProducts.filter(p => p.artisanId === 'artisan-1');

  // Initialize availability state from product data
  products.forEach(p => {
    if (availabilityState[p.id] === undefined) {
      availabilityState[p.id] = p.isAvailable;
    }
  });

  return `
    <!-- Fixed Header -->
    <header class="header">
      <a class="header__action" id="back-btn" href="#/artisan/dashboard" aria-label="Go back" role="button">
        ←
      </a>
      <div class="header__title">My Products</div>
      <a class="header__action" href="#/artisan/add-product" aria-label="Add product" role="button">
        ➕
      </a>
    </header>

    <section class="page page--no-nav">
      
      ${products.length > 0 ? `
        <!-- Product count -->
        <p class="text-muted text-sm" style="margin-bottom:var(--space-4);">
          ${products.length} product${products.length !== 1 ? 's' : ''}
        </p>

        <!-- Product list -->
        <div class="surface rounded-md shadow-card" style="overflow:hidden;">
          ${products.map(product => `
            <div class="list-item" style="cursor:default;">
              <!-- Emoji thumbnail -->
              <div class="list-item__image" style="
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:1.75rem;
                background:${product.color ? product.color + '20' : 'var(--color-surface-variant)'};
              ">
                ${product.emoji || '🧶'}
              </div>
              
              <!-- Content -->
              <div class="list-item__content">
                <div class="list-item__title">${product.title}</div>
                <div class="list-item__subtitle" style="color:var(--color-primary);font-weight:var(--font-semibold);">
                  ${formatRupees(product.price / 100)}
                </div>
              </div>
              
              <!-- Availability toggle -->
              <div class="list-item__action">
                <label class="toggle" aria-label="Toggle availability for ${product.title}">
                  <input 
                    class="toggle__input" 
                    type="checkbox" 
                    data-product-id="${product.id}"
                    ${availabilityState[product.id] ? 'checked' : ''}
                  />
                  <span class="toggle__track"></span>
                  <span class="toggle__thumb"></span>
                </label>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <!-- Empty state -->
        <div class="empty-state">
          <div class="empty-state__icon">📦</div>
          <div class="empty-state__title">No products yet</div>
          <p class="empty-state__text">Add your first crochet creation and start selling!</p>
          <button id="add-first-product-btn" class="btn btn-primary" style="max-width:280px;margin-top:var(--space-4);">
            📸 Add your first product
          </button>
        </div>
      `}

    </section>
  `;
}

export function init() {
  // Toggle availability switches
  const toggles = document.querySelectorAll('.toggle__input');
  toggles.forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const productId = e.target.dataset.productId;
      const isAvailable = e.target.checked;
      availabilityState[productId] = isAvailable;

      if (isAvailable) {
        showToast('Product is now visible to buyers', 'success');
      } else {
        showToast('Product hidden from search', 'info');
      }
    });
  });

  // Empty state: add first product
  const addFirstBtn = document.getElementById('add-first-product-btn');
  if (addFirstBtn) {
    addFirstBtn.addEventListener('click', () => {
      navigate('/artisan/add-product');
    });
  }
}

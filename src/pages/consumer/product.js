/**
 * Product Detail Page — Knoticeable
 * Full product view with add-to-cart and buy-now actions
 */

import { navigate, getParams } from '../../router.js';
import { demoProducts, addToCart } from '../../utils/demo-data.js';
import { formatRupees } from '../../utils/format.js';
import { showToast } from '../../components/toast.js';

function getProduct() {
  const params = getParams();
  const id = params.id || window.__routeParams?.id;
  return demoProducts.find(p => p.id === id) || null;
}

export function render() {
  const product = getProduct();

  if (!product) {
    return `
      <section class="page">
        <div class="empty-state">
          <div class="empty-state__icon">😿</div>
          <div class="empty-state__title">Product not found</div>
          <div class="empty-state__text">This product may have been removed or is no longer available.</div>
          <button class="btn btn-primary" id="pnf-home-btn" style="max-width: 240px; margin-top: var(--space-4);">
            🏠 Go Home
          </button>
        </div>
      </section>`;
  }

  const priceFormatted = formatRupees(product.price / 100);

  return `
    <section class="page product-page">
      <!-- Back Button -->
      <button class="btn btn--icon btn-ghost" id="product-back-btn" aria-label="Go back" style="
        position: absolute;
        top: var(--space-3);
        left: var(--space-3);
        z-index: 10;
        font-size: 1.3rem;
        background: rgba(255,255,255,0.85);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      ">←</button>

      <!-- Product Image -->
      <div style="
        width: 100%;
        aspect-ratio: 4/5;
        background: linear-gradient(135deg, ${product.color}20, ${product.color}40);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8rem;
        position: relative;
      ">
        ${product.emoji}
      </div>

      <!-- Product Info -->
      <div style="padding: var(--space-5) var(--space-4); padding-bottom: var(--space-16);">
        <!-- Title -->
        <h1 style="
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          color: var(--color-on-surface);
          margin-bottom: var(--space-2);
          line-height: var(--leading-tight);
        ">${product.title}</h1>

        <!-- Price -->
        <div style="
          font-size: var(--text-2xl);
          font-weight: var(--font-bold);
          color: var(--color-primary);
          margin-bottom: var(--space-4);
        ">${priceFormatted}</div>

        <!-- Shop -->
        <button id="shop-link" style="
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-base);
          color: var(--color-on-surface-medium);
          margin-bottom: var(--space-4);
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--space-2) 0;
          min-height: var(--touch-min);
        ">
          🏪 <span style="text-decoration: underline;">${product.shopName}</span>
        </button>

        <!-- Category Badge -->
        <div style="margin-bottom: var(--space-5);">
          <span class="badge badge--info" style="font-size: var(--text-sm); padding: var(--space-2) var(--space-4);">
            ${product.category}
          </span>
        </div>

        <!-- Description -->
        <div style="margin-bottom: var(--space-8);">
          <h2 style="
            font-size: var(--text-base);
            font-weight: var(--font-semibold);
            color: var(--color-on-surface);
            margin-bottom: var(--space-2);
          ">Description</h2>
          <p style="
            font-size: var(--text-base);
            color: var(--color-on-surface-medium);
            line-height: var(--leading-relaxed);
          ">${product.description}</p>
        </div>

        <!-- Actions -->
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          <button class="btn btn-primary" id="add-to-cart-btn" data-product-id="${product.id}">
            🛒 Add to Cart
          </button>
          <button class="btn btn-secondary" id="buy-now-btn" data-product-id="${product.id}">
            ⚡ Buy Now
          </button>
        </div>
      </div>
    </section>`;
}

export function init() {
  const product = getProduct();

  // Back button
  const backBtn = document.getElementById('product-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.history.back();
    });
  }

  // Product not found → go home
  const pnfBtn = document.getElementById('pnf-home-btn');
  if (pnfBtn) {
    pnfBtn.addEventListener('click', () => {
      navigate('/');
    });
    return;
  }

  if (!product) return;

  // Add to Cart
  const addBtn = document.getElementById('add-to-cart-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      addToCart(product);
      showToast(`${product.title} added to cart!`, 'success');
    });
  }

  // Buy Now
  const buyBtn = document.getElementById('buy-now-btn');
  if (buyBtn) {
    buyBtn.addEventListener('click', () => {
      addToCart(product);
      navigate('/checkout');
    });
  }

  // Shop name link (could navigate to artisan shop in the future)
  const shopLink = document.getElementById('shop-link');
  if (shopLink) {
    shopLink.addEventListener('click', () => {
      navigate('/search', { query: product.shopName });
    });
  }
}

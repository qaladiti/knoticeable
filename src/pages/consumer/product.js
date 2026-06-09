/**
 * Product Detail Page — Knoticeable
 * Full product view with add-to-cart and buy-now actions
 */

import { navigate, getParams } from '../../router.js';
import { demoProducts, addToCart } from '../../utils/demo-data.js';
import { formatRupees } from '../../utils/format.js';
import { showToast } from '../../components/toast.js';
import { renderNavbar } from '../../components/navbar.js';

// Component state variables
let lastProductId = null;
let activeColor = 'Cream';
let activeSize = 'Standard';
let currentQuantity = 1;
let activeThumbnailIndex = 0;

function getProduct() {
  const params = getParams();
  const id = params.id || window.__routeParams?.id;
  return demoProducts.find(p => p.id === id) || null;
}

function getThumbnails(category, defaultEmoji) {
  if (category === 'Flowers') return [defaultEmoji, '🌸', '🌹', '🌷'];
  if (category === 'Amigurumi') return [defaultEmoji, '🧸', '🐶', '🐰'];
  if (category === 'Bags') return [defaultEmoji, '👜', '🎒', '👛'];
  if (category === 'Home Decor') return [defaultEmoji, '🏠', '🪴', '🌈'];
  return [defaultEmoji, '🧶', '✨', '🎁'];
}

export function render() {
  const product = getProduct();

  if (!product) {
    return `
      ${renderNavbar('search')}
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

  // Reset state if product changed
  if (product.id !== lastProductId) {
    lastProductId = product.id;
    currentQuantity = 1;
    activeColor = 'Cream';
    activeSize = 'Standard';
    activeThumbnailIndex = 0;
  }

  const priceFormatted = formatRupees(product.price / 100);
  const thumbnails = getThumbnails(product.category, product.emoji);
  const mainEmoji = thumbnails[activeThumbnailIndex] || product.emoji;

  const colors = ['Cream', 'Mustard', 'Sage'];
  const sizes = ['Small', 'Standard', 'Tote'];

  const colorPills = colors.map(col => `
    <button class="option-pill ${activeColor === col ? 'option-pill--active' : ''}" data-color="${col}">
      ${col}
    </button>
  `).join('');

  const sizePills = sizes.map(sz => `
    <button class="option-pill ${activeSize === sz ? 'option-pill--active' : ''}" data-size="${sz}">
      ${sz}
    </button>
  `).join('');

  const thumbnailHTML = thumbnails.map((thumb, index) => `
    <div class="thumbnail-variant ${activeThumbnailIndex === index ? 'thumbnail-variant--active' : ''}" data-thumbnail-index="${index}">
      ${thumb}
    </div>
  `).join('');

  return `
    <style>
      .product-page-container {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: var(--space-8);
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--space-6) var(--space-4);
      }
      @media (max-width: 768px) {
        .product-page-container {
          grid-template-columns: 1fr;
          gap: var(--space-6);
          padding: var(--space-4) var(--space-2);
        }
      }
      
      .product-media-col {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }
      .product-main-image-container {
        background-color: #F3ECE6;
        border-radius: 24px;
        aspect-ratio: 4/5;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8rem;
        box-shadow: 0 10px 30px rgba(140, 122, 107, 0.1);
      }
      .watch-video-btn {
        position: absolute;
        bottom: var(--space-4);
        left: 50%;
        transform: translateX(-50%);
        background: white;
        color: var(--wool-charcoal, #2A2C3B);
        border: none;
        padding: 10px 20px;
        border-radius: 100px;
        font-family: 'Comfortaa', sans-serif;
        font-weight: bold;
        font-size: 0.85rem;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;
      }
      .watch-video-btn:hover {
        transform: translateX(-50%) scale(1.05);
        box-shadow: 0 6px 20px rgba(0,0,0,0.12);
      }
      .product-thumbnails-row {
        display: flex;
        gap: var(--space-3);
        overflow-x: auto;
        padding: var(--space-1) 0;
      }
      .thumbnail-variant {
        width: 70px;
        height: 70px;
        border-radius: 16px;
        background: #F3ECE6;
        border: 2px solid transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.2rem;
        transition: all 0.2s;
      }
      .thumbnail-variant--active, .thumbnail-variant:hover {
        border-color: var(--artisan-olive, #5F6B3D);
        transform: translateY(-2px);
      }

      .product-details-col {
        display: flex;
        flex-direction: column;
        gap: var(--space-5);
      }
      .product-category-tag {
        font-family: 'Comfortaa', sans-serif;
        font-weight: 700;
        color: var(--artisan-olive, #5F6B3D);
        text-transform: uppercase;
        font-size: 0.85rem;
        letter-spacing: 1px;
      }
      .product-title-text {
        font-family: 'Playfair Display', serif;
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--wool-charcoal, #2A2C3B);
        line-height: 1.2;
        margin: 0;
      }
      .rating-container {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.95rem;
        color: var(--wool-charcoal, #2A2C3B);
      }
      .star-rating {
        color: #F4C430;
        font-size: 1.1rem;
      }
      .price-large-text {
        font-family: 'Playfair Display', serif;
        font-size: 2.2rem;
        font-weight: 700;
        color: var(--artisan-olive, #5F6B3D);
      }
      
      .option-selector-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .option-label {
        font-weight: 700;
        font-size: 0.9rem;
        color: var(--wool-charcoal, #2A2C3B);
      }
      .options-pills {
        display: flex;
        gap: var(--space-2);
        flex-wrap: wrap;
      }
      .option-pill {
        background: white;
        border: 1px solid var(--border-light, rgba(140, 122, 107, 0.25));
        color: var(--wool-charcoal, #2A2C3B);
        padding: 8px 18px;
        border-radius: 100px;
        font-family: 'Comfortaa', sans-serif;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .option-pill:hover {
        border-color: var(--artisan-olive, #5F6B3D);
        background: var(--soft-oatmeal, #F5EFEB);
      }
      .option-pill--active {
        background: var(--artisan-olive, #5F6B3D);
        color: white;
        border-color: var(--artisan-olive, #5F6B3D);
      }
      
      .actions-flex-row {
        display: flex;
        gap: var(--space-3);
        align-items: center;
        margin-top: var(--space-2);
      }
      .counter-selector {
        display: flex;
        align-items: center;
        border: 1.5px solid var(--border-light, rgba(140, 122, 107, 0.25));
        border-radius: 100px;
        background: white;
        overflow: hidden;
        height: 52px;
      }
      .counter-btn {
        border: none;
        background: none;
        width: 44px;
        height: 100%;
        font-size: 1.2rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--wool-charcoal, #2A2C3B);
        transition: background 0.2s;
      }
      .counter-btn:hover {
        background: var(--soft-oatmeal, #F5EFEB);
      }
      .counter-val {
        width: 36px;
        text-align: center;
        font-family: 'Comfortaa', sans-serif;
        font-weight: 700;
        font-size: 1rem;
        color: var(--wool-charcoal, #2A2C3B);
      }
      .add-to-cart-premium-btn {
        flex: 1;
        background: var(--artisan-olive, #5F6B3D);
        color: white;
        border: none;
        height: 52px;
        border-radius: 100px;
        font-family: 'Comfortaa', sans-serif;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
        box-shadow: 0 4px 15px rgba(95, 107, 61, 0.25);
      }
      .add-to-cart-premium-btn:hover {
        background: #4f5b33;
        transform: translateY(-1px);
      }
      .add-to-cart-premium-btn:active {
        transform: translateY(1px);
      }
      
      .social-proof-accent {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.85rem;
        color: var(--wool-charcoal, #2A2C3B);
        opacity: 0.9;
        margin-top: var(--space-2);
      }
      .avatar-slots {
        display: flex;
        align-items: center;
      }
      .avatar-slot {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid white;
        background-color: var(--soft-oatmeal, #F5EFEB);
        margin-left: -8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.65rem;
        font-weight: bold;
        color: var(--wool-charcoal, #2A2C3B);
      }
      .avatar-slot:first-child {
        margin-left: 0;
      }

      .floating-live-toast {
        position: fixed;
        bottom: var(--space-6);
        left: var(--space-6);
        background: white;
        border: 1px solid var(--border-light, rgba(140, 122, 107, 0.25));
        border-radius: 20px;
        padding: 15px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        z-index: 9999;
        max-width: 320px;
        animation: slideInUp 0.5s ease-out forwards;
        font-family: 'Comfortaa', sans-serif;
        font-size: 0.85rem;
      }
      @keyframes slideInUp {
        from { transform: translateY(100px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    </style>

    ${renderNavbar('search')}

    <section class="page product-page" style="padding-bottom: 120px;">
      <!-- Back Button -->
      <button class="btn btn--icon btn-ghost mobile-only" id="product-back-btn" aria-label="Go back" style="
        position: absolute;
        top: var(--space-3);
        left: var(--space-3);
        z-index: 10;
        font-size: 1.3rem;
        background: rgba(255,255,255,0.85);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      ">←</button>

      <div class="product-page-container">
        <!-- Media Column (Left) -->
        <div class="product-media-col">
          <div class="product-main-image-container">
            ${mainEmoji}
            <button class="watch-video-btn" id="watch-video-btn">
              <span>▶</span> watch video!
            </button>
          </div>
          <div class="product-thumbnails-row">
            ${thumbnailHTML}
          </div>
        </div>

        <!-- Details Column (Right) -->
        <div class="product-details-col">
          <div>
            <div class="product-category-tag">${product.category}</div>
            <h1 class="product-title-text">${product.title}</h1>
            
            <div class="rating-container" style="margin-top: 8px;">
              <span class="star-rating">⭐⭐⭐⭐⭐</span>
              <strong>4.9</strong>
              <span style="color: var(--color-on-surface-muted);">(36 reviews)</span>
            </div>
          </div>

          <div class="price-large-text">
            ${priceFormatted}
          </div>

          <button id="shop-link" style="
            display: flex;
            align-items: center;
            gap: var(--space-2);
            font-size: var(--text-base);
            color: var(--color-on-surface-medium);
            background: none;
            border: none;
            cursor: pointer;
            padding: var(--space-1) 0;
            min-height: var(--touch-min);
            align-self: flex-start;
          ">
            🏪 <span style="text-decoration: underline; font-weight: 600;">${product.shopName}</span>
          </button>

          <!-- Options: Color -->
          <div class="option-selector-group">
            <span class="option-label">Choose color</span>
            <div class="options-pills">
              ${colorPills}
            </div>
          </div>

          <!-- Options: Size -->
          <div class="option-selector-group">
            <span class="option-label">Size</span>
            <div class="options-pills">
              ${sizePills}
            </div>
          </div>

          <!-- Description -->
          <div style="border-top: 1px solid var(--border-light, rgba(140, 122, 107, 0.15)); padding-top: var(--space-4);">
            <h3 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 8px; color: var(--wool-charcoal, #2A2C3B);">Description</h3>
            <p style="
              font-size: 0.95rem;
              color: var(--color-on-surface-medium);
              line-height: 1.6;
              margin: 0;
            ">${product.description}</p>
          </div>

          <!-- Add to Cart Row -->
          <div class="actions-flex-row">
            <div class="counter-selector">
              <button class="counter-btn" id="qty-minus">−</button>
              <span class="counter-val" id="qty-value">${currentQuantity}</span>
              <button class="counter-btn" id="qty-plus">+</button>
            </div>
            <button class="add-to-cart-premium-btn" id="add-to-cart-btn">
              🛒 Add to Cart
            </button>
          </div>

          <!-- Social Proof Accents -->
          <div class="social-proof-accent">
            <div class="avatar-slots">
              <div class="avatar-slot" style="background-color: #DEB887; font-weight: bold;">J</div>
              <div class="avatar-slot" style="background-color: #E6B0AA; font-weight: bold;">R</div>
              <div class="avatar-slot" style="background-color: #C39BD3; font-weight: bold;">S</div>
              <div class="avatar-slot" style="background-color: var(--artisan-olive, #5F6B3D); color: white; font-weight: bold;">+10</div>
            </div>
            <span>13 other people purchased an item from this artisan today</span>
          </div>

          <button class="btn btn-secondary" id="buy-now-btn" style="height: 52px; border-radius: 100px;">
            ⚡ Buy Now
          </button>
        </div>
      </div>

      <!-- Floating Live Toast Notification -->
      <div class="floating-live-toast">
        <div style="font-size: 1.6rem;">🛍️</div>
        <div style="line-height: 1.4; color: var(--wool-charcoal, #2A2C3B);">
          <strong>Janet from Jaipur</strong> purchased a Sunflower bag just now!
        </div>
      </div>
    </section>
  `;
}

function reRenderPage() {
  const app = document.getElementById('app');
  app.innerHTML = render();
  init();
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

  // Thumbnail variants
  document.querySelectorAll('[data-thumbnail-index]').forEach(thumb => {
    thumb.addEventListener('click', () => {
      activeThumbnailIndex = parseInt(thumb.dataset.thumbnailIndex);
      reRenderPage();
    });
  });

  // Color options
  document.querySelectorAll('[data-color]').forEach(pill => {
    pill.addEventListener('click', () => {
      activeColor = pill.dataset.color;
      reRenderPage();
    });
  });

  // Size options
  document.querySelectorAll('[data-size]').forEach(pill => {
    pill.addEventListener('click', () => {
      activeSize = pill.dataset.size;
      reRenderPage();
    });
  });

  // Quantity counter adjustments
  const minusBtn = document.getElementById('qty-minus');
  const plusBtn = document.getElementById('qty-plus');
  const qtyVal = document.getElementById('qty-value');

  if (minusBtn && plusBtn && qtyVal) {
    minusBtn.addEventListener('click', () => {
      if (currentQuantity > 1) {
        currentQuantity--;
        qtyVal.textContent = currentQuantity;
      }
    });
    plusBtn.addEventListener('click', () => {
      currentQuantity++;
      qtyVal.textContent = currentQuantity;
    });
  }

  // Add to Cart
  const addBtn = document.getElementById('add-to-cart-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      addToCart(product, currentQuantity);
      showToast(`${currentQuantity} ${product.title} added to cart!`, 'success');
    });
  }

  // Buy Now
  const buyBtn = document.getElementById('buy-now-btn');
  if (buyBtn) {
    buyBtn.addEventListener('click', () => {
      addToCart(product, currentQuantity);
      navigate('/checkout');
    });
  }

  // Shop name link (navigates directly to the custom storefront page)
  const shopLink = document.getElementById('shop-link');
  if (shopLink) {
    shopLink.addEventListener('click', () => {
      window.location.href = `/artisan-shop.html?id=${product.artisanId}`;
    });
  }

  // Watch video button popover placeholder
  const watchVideoBtn = document.getElementById('watch-video-btn');
  if (watchVideoBtn) {
    watchVideoBtn.addEventListener('click', () => {
      showToast('Video player feature coming soon! 🎥', 'info');
    });
  }
}

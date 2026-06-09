/**
 * Cart Page — Knoticeable
 * Shopping cart with quantity controls, summary, and checkout
 */

import { navigate } from '../../router.js';
import { getCart, removeFromCart, updateCartQuantity, getCartTotal } from '../../utils/demo-data.js';
import { formatRupees } from '../../utils/format.js';
import { showToast } from '../../components/toast.js';

const PLATFORM_FEE_PERCENT = 0.05; // 5% platform fee

function renderCartItem(item) {
  const itemTotal = formatRupees((item.price * item.quantity) / 100);
  const unitPrice = formatRupees(item.price / 100);

  return `
    <div class="cart-item" data-cart-id="${item.id}" style="
      display: flex;
      gap: var(--space-3);
      padding: var(--space-4);
      background: var(--color-surface);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-card);
      margin-bottom: var(--space-3);
    ">
      <!-- Item Image -->
      <div style="
        width: 80px;
        height: 80px;
        border-radius: var(--radius-sm);
        background: linear-gradient(135deg, ${item.color}20, ${item.color}40);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        flex-shrink: 0;
      ">${item.emoji}</div>

      <!-- Item Details -->
      <div style="flex: 1; min-width: 0;">
        <div style="
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          color: var(--color-on-surface);
          margin-bottom: var(--space-1);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        ">${item.title}</div>

        <div style="
          font-size: var(--text-base);
          font-weight: var(--font-bold);
          color: var(--color-primary);
          margin-bottom: var(--space-2);
        ">${unitPrice}</div>

        <!-- Quantity Controls + Remove -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: var(--space-2);">
            <button class="qty-btn qty-minus" data-id="${item.id}" aria-label="Decrease quantity" style="
              width: 48px;
              height: 48px;
              border-radius: var(--radius-sm);
              border: 1px solid var(--color-border);
              background: var(--color-surface-variant);
              font-size: var(--text-lg);
              font-weight: var(--font-bold);
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--color-on-surface);
            ">−</button>
            <span style="
              min-width: 32px;
              text-align: center;
              font-size: var(--text-base);
              font-weight: var(--font-semibold);
            ">${item.quantity}</span>
            <button class="qty-btn qty-plus" data-id="${item.id}" aria-label="Increase quantity" style="
              width: 48px;
              height: 48px;
              border-radius: var(--radius-sm);
              border: 1px solid var(--color-border);
              background: var(--color-surface-variant);
              font-size: var(--text-lg);
              font-weight: var(--font-bold);
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--color-on-surface);
            ">+</button>
          </div>

          <button class="remove-btn" data-id="${item.id}" aria-label="Remove item" style="
            width: 48px;
            height: 48px;
            border: none;
            background: var(--color-error-light);
            color: var(--color-error);
            border-radius: var(--radius-sm);
            font-size: 1.2rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          ">🗑️</button>
        </div>
      </div>
    </div>`;
}

function renderCartSummary(cart) {
  const subtotal = getCartTotal();
  const platformFee = Math.round(subtotal * PLATFORM_FEE_PERCENT);
  const total = subtotal + platformFee;

  return `
    <div style="
      background: var(--color-surface);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-card);
      padding: var(--space-5);
      margin-top: var(--space-4);
    ">
      <h3 style="
        font-size: var(--text-base);
        font-weight: var(--font-semibold);
        margin-bottom: var(--space-4);
        color: var(--color-on-surface);
      ">Order Summary</h3>

      <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-3); font-size: var(--text-base); color: var(--color-on-surface-medium);">
        <span>Subtotal</span>
        <span>${formatRupees(subtotal / 100)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-4); font-size: var(--text-base); color: var(--color-on-surface-medium);">
        <span>Platform Fee (5%)</span>
        <span>${formatRupees(platformFee / 100)}</span>
      </div>
      <div style="
        border-top: 1px solid var(--color-border);
        padding-top: var(--space-3);
        display: flex;
        justify-content: space-between;
        font-size: var(--text-lg);
        font-weight: var(--font-bold);
        color: var(--color-on-surface);
      ">
        <span>Total</span>
        <span style="color: var(--color-primary);">${formatRupees(total / 100)}</span>
      </div>
    </div>

    <button class="btn btn-primary" id="checkout-btn" style="margin-top: var(--space-5);">
      Proceed to Checkout
    </button>`;
}

export function render() {
  const cart = getCart();

  if (cart.length === 0) {
    return `
      <section class="page cart-page">
        <header style="
          padding: var(--space-3) var(--space-4);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          border-bottom: 1px solid var(--color-border);
          min-height: var(--header-height);
        ">
          <button class="btn btn--icon btn-ghost" id="cart-back-btn" aria-label="Go back" style="font-size: 1.3rem;">←</button>
          <h1 style="font-size: var(--text-lg); font-weight: var(--font-bold);">🛒 My Cart</h1>
        </header>
        <div class="empty-state">
          <div class="empty-state__icon">🛒</div>
          <div class="empty-state__title">Your cart is empty</div>
          <div class="empty-state__text">Discover beautiful handmade crochet products from artisans across India.</div>
          <button class="btn btn-primary" id="explore-btn" style="max-width: 280px; margin-top: var(--space-4);">
            ✨ Explore handmade treasures
          </button>
        </div>
      </section>`;
  }

  return `
    <section class="page cart-page">
      <header style="
        padding: var(--space-3) var(--space-4);
        display: flex;
        align-items: center;
        gap: var(--space-3);
        border-bottom: 1px solid var(--color-border);
        min-height: var(--header-height);
        background: var(--color-surface);
        position: sticky;
        top: 0;
        z-index: 10;
      ">
        <button class="btn btn--icon btn-ghost" id="cart-back-btn" aria-label="Go back" style="font-size: 1.3rem;">←</button>
        <h1 style="font-size: var(--text-lg); font-weight: var(--font-bold);">🛒 My Cart</h1>
        <span style="
          font-size: var(--text-sm);
          color: var(--color-on-surface-muted);
          margin-left: auto;
        ">${cart.length} item${cart.length !== 1 ? 's' : ''}</span>
      </header>

      <div style="padding: var(--space-4); padding-bottom: var(--space-16);">
        <!-- Cart Items -->
        <div id="cart-items-list">
          ${cart.map(item => renderCartItem(item)).join('')}
        </div>

        <!-- Summary -->
        <div id="cart-summary">
          ${renderCartSummary(cart)}
        </div>
      </div>
    </section>`;
}

function reRenderCart() {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = render();
    init();
  }
}

export function init() {
  // Back button
  const backBtn = document.getElementById('cart-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.history.back();
    });
  }

  // Explore button (empty state)
  const exploreBtn = document.getElementById('explore-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Quantity minus buttons
  document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const cart = getCart();
      const item = cart.find(i => i.id === id);
      if (item && item.quantity > 1) {
        updateCartQuantity(id, item.quantity - 1);
        reRenderCart();
      } else if (item && item.quantity === 1) {
        removeFromCart(id);
        showToast('Item removed from cart', 'info');
        reRenderCart();
      }
    });
  });

  // Quantity plus buttons
  document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const cart = getCart();
      const item = cart.find(i => i.id === id);
      if (item) {
        updateCartQuantity(id, item.quantity + 1);
        reRenderCart();
      }
    });
  });

  // Remove buttons
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      removeFromCart(id);
      showToast('Item removed from cart', 'info');
      reRenderCart();
    });
  });

  // Checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      navigate('/checkout');
    });
  }
}

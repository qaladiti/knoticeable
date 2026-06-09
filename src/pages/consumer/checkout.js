/**
 * Checkout Page — Knoticeable
 * Delivery form, order summary, and payment confirmation
 */

import { navigate } from '../../router.js';
import { getCart, getCartTotal, clearCart } from '../../utils/demo-data.js';
import { formatRupees, uid } from '../../utils/format.js';
import { showToast } from '../../components/toast.js';
import { renderNavbar } from '../../components/navbar.js';

const PLATFORM_FEE_PERCENT = 0.05;

function renderOrderItem(item) {
  return `
    <div style="
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) 0;
      border-bottom: 1px solid var(--color-surface-variant);
    ">
      <div style="
        width: 48px;
        height: 48px;
        border-radius: var(--radius-sm);
        background: linear-gradient(135deg, ${item.color}20, ${item.color}40);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        flex-shrink: 0;
      ">${item.emoji}</div>
      <div style="flex: 1; min-width: 0;">
        <div style="
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        ">${item.title}</div>
        <div style="font-size: var(--text-xs); color: var(--color-on-surface-muted);">
          Qty: ${item.quantity}
        </div>
      </div>
      <div style="
        font-size: var(--text-sm);
        font-weight: var(--font-semibold);
        color: var(--color-primary);
        flex-shrink: 0;
      ">${formatRupees((item.price * item.quantity) / 100)}</div>
    </div>`;
}

export function render() {
  const cart = getCart();
  const subtotal = getCartTotal();
  const platformFee = Math.round(subtotal * PLATFORM_FEE_PERCENT);
  const total = subtotal + platformFee;

  if (cart.length === 0) {
    return `
      <section class="page checkout-page">
        <div class="empty-state">
          <div class="empty-state__icon">🛒</div>
          <div class="empty-state__title">No items to checkout</div>
          <div class="empty-state__text">Add some handmade treasures to your cart first!</div>
          <button class="btn btn-primary" id="checkout-home-btn" style="max-width: 240px; margin-top: var(--space-4);">
            🏠 Browse Products
          </button>
        </div>
      </section>`;
  }

  return `
    ${renderNavbar('cart')}

    <section class="page checkout-page">
      <!-- Header -->
      <header class="mobile-header" style="
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
        <button class="btn btn--icon btn-ghost" id="checkout-back-btn" aria-label="Go back" style="font-size: 1.3rem;">←</button>
        <h1 style="font-size: var(--text-lg); font-weight: var(--font-bold);">Checkout</h1>
      </header>

      <div style="padding: var(--space-4); padding-bottom: var(--space-16);">
        <div class="checkout-layout-container">
          <div class="checkout-form-column">
            <!-- Delivery Address Form -->
            <div style="
              background: var(--color-surface);
              border-radius: var(--radius-md);
              box-shadow: var(--shadow-card);
              padding: var(--space-5);
              margin-bottom: var(--space-5);
            ">
              <h2 style="
                font-size: var(--text-base);
                font-weight: var(--font-semibold);
                margin-bottom: var(--space-4);
                color: var(--color-on-surface);
              ">📍 Delivery Address</h2>

              <form id="checkout-form" novalidate>
                <div class="input-group">
                  <label class="input-label" for="checkout-name">Full Name *</label>
                  <input
                    type="text"
                    id="checkout-name"
                    class="input"
                    placeholder="Enter your full name"
                    required
                    autocomplete="name"
                  />
                  <div class="input-error" id="name-error" style="display: none;"></div>
                </div>

                <div class="input-group">
                  <label class="input-label" for="checkout-phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="checkout-phone"
                    class="input"
                    placeholder="10-digit mobile number"
                    required
                    autocomplete="tel"
                    maxlength="10"
                    inputmode="numeric"
                  />
                  <div class="input-error" id="phone-error" style="display: none;"></div>
                </div>

                <div class="input-group">
                  <label class="input-label" for="checkout-address">Delivery Address *</label>
                  <textarea
                    id="checkout-address"
                    class="input"
                    placeholder="House/Flat no., Street, Landmark, City, State"
                    required
                    rows="3"
                    style="min-height: var(--input-height); resize: vertical;"
                  ></textarea>
                  <div class="input-error" id="address-error" style="display: none;"></div>
                </div>

                <div class="input-group" style="margin-bottom: 0;">
                  <label class="input-label" for="checkout-pincode">Pincode *</label>
                  <input
                    type="text"
                    id="checkout-pincode"
                    class="input"
                    placeholder="6-digit pincode"
                    required
                    maxlength="6"
                    inputmode="numeric"
                  />
                  <div class="input-error" id="pincode-error" style="display: none;"></div>
                </div>
              </form>
            </div>
          </div>

          <div class="checkout-summary-column">
            <!-- Order Summary -->
            <div style="
              background: var(--color-surface);
              border-radius: var(--radius-md);
              box-shadow: var(--shadow-card);
              padding: var(--space-5);
              margin-bottom: var(--space-5);
            ">
              <h2 style="
                font-size: var(--text-base);
                font-weight: var(--font-semibold);
                margin-bottom: var(--space-3);
                color: var(--color-on-surface);
              ">🛍️ Order Summary</h2>

              ${cart.map(item => renderOrderItem(item)).join('')}

              <div style="margin-top: var(--space-4);">
                <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2); font-size: var(--text-sm); color: var(--color-on-surface-medium);">
                  <span>Subtotal</span>
                  <span>${formatRupees(subtotal / 100)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-3); font-size: var(--text-sm); color: var(--color-on-surface-medium);">
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
                ">
                  <span>Total</span>
                  <span style="color: var(--color-primary);">${formatRupees(total / 100)}</span>
                </div>
              </div>
            </div>

            <!-- Pay Button -->
            <button class="btn btn-primary" id="pay-btn">
              💳 Pay ${formatRupees(total / 100)}
            </button>
          </div>
        </div>
      </div>

      <!-- Success Modal (hidden) -->
      <div id="order-success-modal" style="display: none;">
        <div class="modal-overlay" style="align-items: center;">
          <div style="
            background: var(--color-surface);
            border-radius: var(--radius-xl);
            padding: var(--space-8);
            margin: var(--space-4);
            max-width: 360px;
            width: 100%;
            text-align: center;
            animation: slideUp var(--transition-normal);
          ">
            <div style="font-size: 4rem; margin-bottom: var(--space-4);">🎉</div>
            <h2 style="
              font-size: var(--text-xl);
              font-weight: var(--font-bold);
              color: var(--color-on-surface);
              margin-bottom: var(--space-2);
            ">Order Placed Successfully!</h2>
            <p style="
              font-size: var(--text-base);
              color: var(--color-on-surface-muted);
              margin-bottom: var(--space-2);
            ">Your handmade treasures are on their way! 🧶</p>
            <p id="order-id-text" style="
              font-size: var(--text-sm);
              color: var(--color-on-surface-medium);
              font-weight: var(--font-medium);
              margin-bottom: var(--space-6);
              background: var(--color-surface-variant);
              padding: var(--space-3);
              border-radius: var(--radius-sm);
            "></p>
            <button class="btn btn-primary" id="modal-home-btn">
              🏠 Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </section>`;
}

function validateForm() {
  let isValid = true;

  // Name
  const name = document.getElementById('checkout-name');
  const nameError = document.getElementById('name-error');
  if (!name.value.trim()) {
    nameError.textContent = 'Please enter your full name';
    nameError.style.display = 'block';
    name.classList.add('input--error');
    isValid = false;
  } else {
    nameError.style.display = 'none';
    name.classList.remove('input--error');
  }

  // Phone
  const phone = document.getElementById('checkout-phone');
  const phoneError = document.getElementById('phone-error');
  const phoneVal = phone.value.replace(/\D/g, '');
  if (!phoneVal || phoneVal.length !== 10) {
    phoneError.textContent = 'Please enter a valid 10-digit phone number';
    phoneError.style.display = 'block';
    phone.classList.add('input--error');
    isValid = false;
  } else {
    phoneError.style.display = 'none';
    phone.classList.remove('input--error');
  }

  // Address
  const address = document.getElementById('checkout-address');
  const addressError = document.getElementById('address-error');
  if (!address.value.trim() || address.value.trim().length < 10) {
    addressError.textContent = 'Please enter a complete delivery address';
    addressError.style.display = 'block';
    address.classList.add('input--error');
    isValid = false;
  } else {
    addressError.style.display = 'none';
    address.classList.remove('input--error');
  }

  // Pincode
  const pincode = document.getElementById('checkout-pincode');
  const pincodeError = document.getElementById('pincode-error');
  const pincodeVal = pincode.value.replace(/\D/g, '');
  if (!pincodeVal || pincodeVal.length !== 6) {
    pincodeError.textContent = 'Please enter a valid 6-digit pincode';
    pincodeError.style.display = 'block';
    pincode.classList.add('input--error');
    isValid = false;
  } else {
    pincodeError.style.display = 'none';
    pincode.classList.remove('input--error');
  }

  return isValid;
}

export function init() {
  // Empty cart redirect
  const homeBtn = document.getElementById('checkout-home-btn');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      navigate('/');
    });
    return;
  }

  // Back button
  const backBtn = document.getElementById('checkout-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.history.back();
    });
  }

  // Pay button
  const payBtn = document.getElementById('pay-btn');
  if (payBtn) {
    payBtn.addEventListener('click', () => {
      if (!validateForm()) {
        showToast('Please fill in all required fields', 'error');
        return;
      }

      // Generate order ID
      const orderId = `KN-${uid().toUpperCase()}`;

      // Show success modal
      const modal = document.getElementById('order-success-modal');
      const orderIdText = document.getElementById('order-id-text');
      if (modal && orderIdText) {
        orderIdText.textContent = `Order ID: ${orderId}`;
        modal.style.display = 'block';
      }

      // Clear cart
      clearCart();
    });
  }

  // Modal home button
  const modalHomeBtn = document.getElementById('modal-home-btn');
  if (modalHomeBtn) {
    modalHomeBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Close modal on overlay click
  const modal = document.getElementById('order-success-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal.querySelector('.modal-overlay')) {
        navigate('/');
      }
    });
  }
}

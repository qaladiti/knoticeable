/**
 * Earnings — Knoticeable
 * Artisan earnings and payout view
 */

import { navigate } from '../../router.js';
import { demoOrders, getCurrentArtisan } from '../../utils/demo-data.js';
import { formatRupees, timeAgo } from '../../utils/format.js';
import { renderNavbar } from '../../components/navbar.js';

export function render() {
  const artisan = getCurrentArtisan() || {
    shopName: "Priya's Crochet Studio",
    upiId: 'priya@upi',
  };

  // Filter orders for artisan (demo: artisan-1)
  const orders = demoOrders.filter(o => o.artisanId === 'artisan-1');
  const totalEarnings = orders.reduce((sum, o) => sum + o.artisanEarning, 0);
  const paidOrders = orders.filter(o => o.status === 'delivered');
  const paidTotal = paidOrders.reduce((sum, o) => sum + o.artisanEarning, 0);
  const pendingTotal = totalEarnings - paidTotal;

  return `
    ${renderNavbar('dashboard')}

    <!-- Fixed Header -->
    <header class="header mobile-header">
      <a class="header__action" id="back-btn" href="#/artisan/dashboard" aria-label="Go back" role="button">
        ←
      </a>
      <div class="header__title">
        <span>💰</span>
        <span>Earnings</span>
      </div>
    </header>

    <section class="page">
      <div class="earnings-layout-container">
        <div class="earnings-left-column">
          <!-- Earnings stat card -->
          <div class="stat-card" style="margin-bottom:var(--space-4);">
            <div class="stat-card__value">${formatRupees(totalEarnings / 100)}</div>
            <div class="stat-card__label">Earned this month</div>
          </div>

          <!-- UPI info -->
          <div style="
            text-align:center;
            padding:var(--space-3) var(--space-4);
            background:var(--color-success-light);
            border-radius:var(--radius-md);
            margin-bottom:var(--space-6);
            font-size:var(--text-sm);
            color:var(--color-success);
            font-weight:var(--font-medium);
          ">
            Paid to your UPI · <strong>${artisan.upiId}</strong>
          </div>

          <!-- Earning summary cards -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);margin-bottom:var(--space-6);">
            <div class="card" style="padding:var(--space-4);text-align:center;">
              <div style="font-size:var(--text-xs);color:var(--color-on-surface-muted);margin-bottom:var(--space-1);">Paid Out</div>
              <div style="font-size:var(--text-lg);font-weight:var(--font-bold);color:var(--color-success);">${formatRupees(paidTotal / 100)}</div>
            </div>
            <div class="card" style="padding:var(--space-4);text-align:center;">
              <div style="font-size:var(--text-xs);color:var(--color-on-surface-muted);margin-bottom:var(--space-1);">Pending</div>
              <div style="font-size:var(--text-lg);font-weight:var(--font-bold);color:var(--color-warning);">${formatRupees(pendingTotal / 100)}</div>
            </div>
          </div>

          <!-- Total Earnings Summary -->
          <div style="
            background:var(--color-surface-variant);
            border-radius:var(--radius-md);
            padding:var(--space-5);
            margin-bottom:var(--space-8);
          ">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:var(--font-semibold);color:var(--color-on-surface);font-size:var(--text-base);">
                Total Earnings
              </span>
              <span style="font-weight:var(--font-bold);color:var(--color-primary);font-size:var(--text-xl);">
                ${formatRupees(totalEarnings / 100)}
              </span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:var(--space-2);">
              <span style="font-size:var(--text-xs);color:var(--color-on-surface-muted);">${orders.length} orders</span>
              <span style="font-size:var(--text-xs);color:var(--color-on-surface-muted);">Platform fee deducted</span>
            </div>
          </div>
        </div>

        <div class="earnings-right-column">
          <!-- Recent Payouts -->
          <div style="margin-bottom:var(--space-6);">
            <h2 class="section-title">Recent Payouts</h2>
            
            <div class="surface rounded-md shadow-card" style="overflow:hidden;">
              ${orders.length > 0 ? orders.map(order => `
                <div class="list-item" style="cursor:default;">
                  <div class="list-item__content">
                    <div class="list-item__title">${order.productTitle}</div>
                    <div class="list-item__subtitle">${formatDate(order.createdAt)}</div>
                  </div>
                  <div style="text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:var(--space-1);">
                    <span style="font-weight:var(--font-bold);color:var(--color-on-surface);font-size:var(--text-sm);">
                      ${formatRupees(order.artisanEarning / 100)}
                    </span>
                    <span class="badge badge--${getPayoutBadge(order.status)}">
                      ${getPayoutLabel(order.status)}
                    </span>
                  </div>
                </div>
              `).join('') : `
                <div class="empty-state" style="padding:var(--space-8);">
                  <div class="empty-state__icon">💸</div>
                  <p class="empty-state__text">No payouts yet</p>
                </div>
              `}
            </div>
          </div>
        </div>
      </div>

      <!-- Spacer for bottom nav -->
      <div style="height:var(--space-8);"></div>

    </section>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav" aria-label="Artisan navigation">
      <a class="bottom-nav__item" href="#/artisan/dashboard" aria-label="Home">
        <span class="bottom-nav__icon">🏠</span>
        <span>Home</span>
      </a>
      
      <div class="fab" id="nav-add-product" role="button" tabindex="0" aria-label="Add product">
        <button class="fab__btn" aria-label="Add new product">➕</button>
        <span class="fab__label">Add</span>
      </div>
      
      <a class="bottom-nav__item" href="#/shop" aria-label="Shop Profile">
        <span class="bottom-nav__icon">🏪</span>
        <span>My Shop</span>
      </a>
    </nav>
  `;
}

export function init() {
  // FAB: Add Product
  const fabAdd = document.getElementById('nav-add-product');
  if (fabAdd) {
    fabAdd.addEventListener('click', () => navigate('/artisan/add-product'));
  }
}

function getPayoutBadge(status) {
  const map = {
    delivered: 'success',
    shipped: 'info',
    confirmed: 'warning',
    pending: 'warning',
    cancelled: 'error',
  };
  return map[status] || 'info';
}

function getPayoutLabel(status) {
  const map = {
    delivered: 'Paid',
    shipped: 'Processing',
    confirmed: 'Pending',
    pending: 'Pending',
    cancelled: 'Cancelled',
  };
  return map[status] || status;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

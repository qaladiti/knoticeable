/**
 * Artisan Dashboard — Knoticeable
 * Main home screen for artisans
 */

import { navigate } from '../../router.js';
import { demoOrders, getCurrentArtisan } from '../../utils/demo-data.js';
import { formatRupees, timeAgo } from '../../utils/format.js';
import { showToast } from '../../components/toast.js';

export function render() {
  const artisan = getCurrentArtisan() || {
    shopName: "Priya's Crochet Studio",
    upiId: 'priya@upi',
  };

  // Filter orders for this artisan (demo: use artisan-1's orders)
  const orders = demoOrders.filter(o => o.artisanId === 'artisan-1');
  const totalEarnings = orders.reduce((sum, o) => sum + o.artisanEarning, 0);
  const orderCount = orders.length;

  return `
    <!-- Fixed Header -->
    <header class="header">
      <div class="header__title">
        <span>🧶</span>
        <span>${artisan.shopName}</span>
      </div>
      <a class="header__action" href="#/artisan/earnings" aria-label="Settings" role="button">
        ⚙️
      </a>
    </header>

    <section class="page">
      
      <!-- Earnings stat card -->
      <div class="stat-card" style="margin-bottom:var(--space-6);">
        <div class="stat-card__value">${formatRupees(totalEarnings / 100)}</div>
        <div class="stat-card__label">Total Earnings</div>
        <div class="stat-card__label" style="margin-top:var(--space-2);opacity:0.8;">
          ${orderCount} orders this month
        </div>
      </div>

      <!-- Recent Orders -->
      <div style="margin-bottom:var(--space-6);">
        <h2 class="section-title">
          <span>Recent Orders</span>
          <span class="section-title__link" style="cursor:pointer;">${orderCount} total</span>
        </h2>
        
        <div class="surface rounded-md shadow-card" style="overflow:hidden;">
          ${orders.length > 0 ? orders.map(order => `
            <div class="list-item" style="cursor:default;">
              <div class="list-item__content">
                <div class="list-item__title">${order.productTitle}</div>
                <div class="list-item__subtitle">${timeAgo(order.createdAt)}</div>
              </div>
              <div style="text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:var(--space-1);">
                <span class="badge badge--${getStatusBadge(order.status)}">${capitalize(order.status)}</span>
                <span style="font-weight:var(--font-bold);color:var(--color-primary);font-size:var(--text-sm);">
                  ${formatRupees(order.artisanEarning / 100)}
                </span>
              </div>
            </div>
          `).join('') : `
            <div class="empty-state" style="padding:var(--space-8);">
              <div class="empty-state__icon">📦</div>
              <p class="empty-state__text">No orders yet</p>
            </div>
          `}
        </div>
      </div>

      <!-- Quick Actions -->
      <div style="margin-bottom:var(--space-6);">
        <h2 class="section-title">Quick Actions</h2>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);">
          <div class="card card--interactive quick-action-card" id="action-add-product" role="button" tabindex="0" aria-label="Add Product"
            style="padding:var(--space-6);text-align:center;">
            <div style="font-size:2.5rem;margin-bottom:var(--space-3);line-height:1;">📸</div>
            <div style="font-weight:var(--font-semibold);color:var(--color-on-surface);font-size:var(--text-base);">Add Product</div>
          </div>
          
          <div class="card card--interactive quick-action-card" id="action-my-products" role="button" tabindex="0" aria-label="My Products"
            style="padding:var(--space-6);text-align:center;">
            <div style="font-size:2.5rem;margin-bottom:var(--space-3);line-height:1;">📋</div>
            <div style="font-weight:var(--font-semibold);color:var(--color-on-surface);font-size:var(--text-base);">My Products</div>
          </div>
        </div>
      </div>

      <!-- Share Your Shop -->
      <button id="share-shop-btn" class="btn btn-secondary" style="margin-bottom:var(--space-8);">
        📤 Share Your Shop
      </button>

      <!-- Spacer for bottom nav -->
      <div style="height:var(--space-8);"></div>

    </section>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav" aria-label="Artisan navigation">
      <a class="bottom-nav__item bottom-nav__item--active" href="#/artisan/dashboard" aria-label="Home" aria-current="page">
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
  // Quick action: Add Product
  const addProductBtn = document.getElementById('action-add-product');
  if (addProductBtn) {
    addProductBtn.addEventListener('click', () => navigate('/artisan/add-product'));
    addProductBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/artisan/add-product'); }
    });
  }

  // Quick action: My Products (navigates to their Instagram-style shop page)
  const myProductsBtn = document.getElementById('action-my-products');
  if (myProductsBtn) {
    myProductsBtn.addEventListener('click', () => navigate('/shop'));
    myProductsBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/shop'); }
    });
  }

  // FAB: Add Product
  const fabAdd = document.getElementById('nav-add-product');
  if (fabAdd) {
    fabAdd.addEventListener('click', () => navigate('/artisan/add-product'));
  }

  // Share shop button
  const shareBtn = document.getElementById('share-shop-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const artisan = getCurrentArtisan() || { shopName: "Priya's Crochet Studio" };
      const shareText = `Check out ${artisan.shopName} on Knoticeable! 🧶\n${window.location.origin}`;

      if (navigator.share) {
        navigator.share({
          title: artisan.shopName,
          text: shareText,
          url: window.location.origin,
        }).catch(() => {
          // User cancelled or not supported
          copyToClipboard(shareText);
        });
      } else {
        copyToClipboard(shareText);
      }
    });
  }
}

function copyToClipboard(text) {
  try {
    navigator.clipboard.writeText(text);
    showToast('Shop link copied! Share on WhatsApp 📱', 'success');
  } catch {
    showToast('Could not copy link', 'error');
  }
}

function getStatusBadge(status) {
  const map = {
    delivered: 'success',
    shipped: 'info',
    confirmed: 'warning',
    pending: 'warning',
    cancelled: 'error',
  };
  return map[status] || 'info';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

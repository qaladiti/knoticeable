/**
 * Artisan Dashboard — Knoticeable
 * Digital Studio Hub: Mobile-first management screen for artisans
 */

import { navigate } from '../../router.js';
import { demoOrders, getCurrentArtisan, demoProducts } from '../../utils/demo-data.js';
import { formatRupees } from '../../utils/format.js';
import { showToast } from '../../components/toast.js';
import { renderNavbar } from '../../components/navbar.js';

// Local Component State
let activeTab = 'orders'; // 'orders' | 'shop' | 'stories' | 'wallet'
let orderStatuses = {}; // orderId -> 'accepted' | 'pending' | 'shipped'
let productAvailability = {}; // productId -> true (Available) | false (Sold Out)

export function render() {
  const artisan = getCurrentArtisan() || {
    uid: 'artisan-1',
    shopName: "Priya's Crochet Studio",
    upiId: 'priya@upi',
  };

  let contentHTML = '';

  if (activeTab === 'orders') {
    contentHTML = renderOrdersTab();
  } else if (activeTab === 'shop') {
    contentHTML = renderShopTab();
  } else if (activeTab === 'stories') {
    contentHTML = renderStoriesTab();
  } else if (activeTab === 'wallet') {
    contentHTML = renderWalletTab();
  }

  return `
    <style>
      .studio-hub-container {
        background-color: #FDFBF7;
        color: var(--wool-charcoal, #2A2C3B);
        min-height: calc(100vh - var(--header-height, 60px) - 90px);
        font-family: 'Comfortaa', sans-serif;
        padding: var(--space-4) var(--space-4) 100px var(--space-4);
        box-sizing: border-box;
      }
      
      .studio-header {
        background: var(--soft-oatmeal, #F5EFEB);
        border-radius: 20px;
        padding: var(--space-5);
        margin-bottom: var(--space-6);
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 4px 12px rgba(140, 122, 107, 0.05);
      }
      
      .studio-title {
        font-family: 'Playfair Display', serif;
        font-size: 1.6rem;
        font-weight: 700;
        margin: 0;
        color: var(--wool-charcoal, #2A2C3B);
      }
      
      /* Orders Tab Styles */
      .order-card-large {
        background: white;
        border-radius: 24px;
        padding: var(--space-5);
        border: 1.5px solid var(--border-light, rgba(140, 122, 107, 0.2));
        margin-bottom: var(--space-4);
        box-shadow: 0 8px 24px rgba(140, 122, 107, 0.04);
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }
      .order-product-info {
        display: flex;
        gap: var(--space-4);
        align-items: center;
      }
      .order-product-img {
        width: 80px;
        height: 80px;
        border-radius: 18px;
        background: #F3ECE6;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        flex-shrink: 0;
      }
      .order-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .order-customer-loc {
        color: var(--cozy-taupe, #8C7A6B);
        font-size: 0.85rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 2px;
      }
      
      /* Action Button */
      .studio-btn-xl {
        width: 100%;
        height: 58px;
        border-radius: 100px;
        border: none;
        font-family: 'Comfortaa', sans-serif;
        font-weight: 700;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      .studio-btn-xl--primary {
        background: var(--artisan-olive, #5F6B3D);
        color: white;
        box-shadow: 0 4px 15px rgba(95, 107, 61, 0.25);
      }
      .studio-btn-xl--primary:hover {
        background: #4f5b33;
      }
      .studio-btn-xl--secondary {
        background: var(--soft-oatmeal, #F5EFEB);
        color: var(--wool-charcoal, #2A2C3B);
        border: 1.5px solid var(--border-light, rgba(140, 122, 107, 0.25));
      }
      .studio-btn-xl--secondary:hover {
        background: #eae3de;
      }
      .studio-btn-xl--disabled {
        background: #EAEAEB;
        color: #9A9AA2;
        cursor: not-allowed;
      }
      
      /* Shop Grid */
      .studio-shop-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-4);
      }
      @media (max-width: 576px) {
        .studio-shop-grid {
          grid-template-columns: 1fr;
        }
      }
      .studio-product-card {
        background: white;
        border-radius: 20px;
        padding: var(--space-4);
        border: 1.5px solid var(--border-light, rgba(140, 122, 107, 0.2));
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        position: relative;
      }
      .studio-product-card__img {
        height: 120px;
        border-radius: 16px;
        background: #F3ECE6;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3.5rem;
      }
      .studio-toggle-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: var(--space-2);
        border-top: 1px dashed var(--border-light, rgba(140, 122, 107, 0.2));
      }
      
      /* Big Toggle Switch */
      .big-switch {
        position: relative;
        display: inline-block;
        width: 64px;
        height: 34px;
      }
      .big-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .big-slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: #EAEAEB;
        transition: .4s;
        border-radius: 34px;
      }
      .big-slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      }
      input:checked + .big-slider {
        background-color: var(--artisan-olive, #5F6B3D);
      }
      input:checked + .big-slider:before {
        transform: translateX(30px);
      }
      
      /* Floating Action Button */
      .studio-fab {
        position: fixed;
        bottom: 96px;
        right: 24px;
        width: 64px;
        height: 64px;
        background: var(--artisan-olive, #5F6B3D);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.2rem;
        box-shadow: 0 6px 20px rgba(95, 107, 61, 0.4);
        cursor: pointer;
        transition: all 0.2s;
        z-index: 100;
        border: none;
      }
      .studio-fab:hover {
        transform: scale(1.08) rotate(90deg);
        background: #4f5b33;
      }
      
      /* Stories Tab */
      .stories-container {
        display: flex;
        flex-direction: column;
        gap: var(--space-5);
      }
      .record-story-card {
        background: var(--soft-oatmeal, #F5EFEB);
        border: 2px dashed var(--cozy-taupe, #8C7A6B);
        border-radius: 24px;
        padding: 30px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-3);
        cursor: pointer;
        transition: all 0.2s;
      }
      .record-story-card:hover {
        background: #eae3de;
        transform: scale(1.02);
      }
      .story-post-card {
        background: white;
        border-radius: 24px;
        border: 1.5px solid var(--border-light, rgba(140, 122, 107, 0.2));
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.03);
      }
      .story-post-media {
        aspect-ratio: 16/9;
        background: #F3ECE6;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        position: relative;
      }
      .story-play-overlay {
        position: absolute;
        width: 50px;
        height: 50px;
        background: rgba(255,255,255,0.9);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        color: var(--wool-charcoal, #2A2C3B);
      }
      
      /* Wallet Tab */
      .wallet-card-xl {
        background: white;
        border-radius: 28px;
        padding: 40px var(--space-6);
        border: 1.5px solid var(--border-light, rgba(140, 122, 107, 0.2));
        text-align: center;
        box-shadow: 0 10px 30px rgba(140, 122, 107, 0.05);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-4);
      }
      .wallet-balance-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--cozy-taupe, #8C7A6B);
      }
      .wallet-balance-value {
        font-family: 'Playfair Display', serif;
        font-size: 3rem;
        font-weight: 700;
        color: var(--artisan-olive, #5F6B3D);
      }
      .upi-verified-badge {
        background: #E8F5E9;
        color: #2E7D32;
        padding: 8px 16px;
        border-radius: 100px;
        font-size: 0.85rem;
        font-weight: bold;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      
      /* Bottom Nav */
      .studio-bottom-nav {
        position: fixed;
        bottom: 0; left: 0; right: 0;
        height: 80px;
        background: white;
        border-top: 1.5px solid var(--border-light, rgba(140, 122, 107, 0.25));
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding-bottom: var(--safe-bottom, 0);
        z-index: 999;
      }
      .studio-bottom-nav__item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        background: none;
        border: none;
        color: var(--cozy-taupe, #8C7A6B);
        cursor: pointer;
        font-family: 'Comfortaa', sans-serif;
        font-size: 0.75rem;
        font-weight: bold;
        transition: all 0.2s;
        width: 22%;
        height: 100%;
        justify-content: center;
      }
      .studio-bottom-nav__item--active {
        color: var(--artisan-olive, #5F6B3D);
      }
      .studio-bottom-nav__icon {
        font-size: 1.6rem;
      }
    </style>

    ${renderNavbar('dashboard')}
    
    <div class="studio-hub-container">
      <div class="studio-header">
        <div>
          <span style="font-size: 0.8rem; color: var(--cozy-taupe); font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Digital Studio Hub</span>
          <h1 class="studio-title">${artisan.shopName}</h1>
        </div>
        <button id="studio-logout-btn" class="btn btn-secondary" style="min-height:40px; border-radius:12px; font-size:0.8rem; padding:0 12px; font-weight: bold;">
          🚪 Log Out
        </button>
      </div>

      ${contentHTML}
    </div>

    <!-- Floating Action Button for Shop Tab -->
    ${activeTab === 'shop' ? `
      <button class="studio-fab" id="studio-fab-add" aria-label="Upload new product">
        ＋
      </button>
    ` : ''}

    <!-- Bottom Studio Navigation -->
    <nav class="studio-bottom-nav" aria-label="Studio navigation">
      <button class="studio-bottom-nav__item ${activeTab === 'orders' ? 'studio-bottom-nav__item--active' : ''}" data-tab="orders">
        <span class="studio-bottom-nav__icon">📦</span>
        <span>Orders</span>
      </button>
      <button class="studio-bottom-nav__item ${activeTab === 'shop' ? 'studio-bottom-nav__item--active' : ''}" data-tab="shop">
        <span class="studio-bottom-nav__icon">🏪</span>
        <span>My Shop</span>
      </button>
      <button class="studio-bottom-nav__item ${activeTab === 'stories' ? 'studio-bottom-nav__item--active' : ''}" data-tab="stories">
        <span class="studio-bottom-nav__icon">📸</span>
        <span>Studio Stories</span>
      </button>
      <button class="studio-bottom-nav__item ${activeTab === 'wallet' ? 'studio-bottom-nav__item--active' : ''}" data-tab="wallet">
        <span class="studio-bottom-nav__icon">💰</span>
        <span>Wallet</span>
      </button>
    </nav>
  `;
}

function renderOrdersTab() {
  const orders = demoOrders.filter(o => o.artisanId === 'artisan-1');
  
  if (orders.length === 0) {
    return `
      <div class="empty-state" style="padding: 40px 20px;">
        <div class="empty-state__icon" style="font-size: 3.5rem;">📦</div>
        <div class="empty-state__title" style="font-size: 1.25rem; font-weight: bold; margin-top: 10px;">No Orders Yet</div>
        <p class="empty-state__text">Once customers purchase your creations, they will show up here.</p>
      </div>
    `;
  }
  
  return `
    <h2 style="font-size: 1.2rem; font-weight: bold; margin-bottom: var(--space-4); display: flex; align-items: center; gap: 8px;">
      <span>Active Orders</span>
      <span style="background: var(--artisan-olive); color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.75rem;">${orders.length}</span>
    </h2>
    <div style="display: flex; flex-direction: column; gap: var(--space-4);">
      ${orders.map(order => {
        const product = demoProducts.find(p => p.id === order.productId) || { emoji: '🧶', color: '#DEB887' };
        const status = orderStatuses[order.id] || order.status || 'pending';
        
        let btnText = 'Accept Order';
        let btnClass = 'studio-btn-xl--primary';
        let action = 'accept';
        
        if (status === 'accepted') {
          btnText = 'Call Courier for Doorstep Pickup';
          btnClass = 'studio-btn-xl--primary';
          action = 'call-courier';
        } else if (status === 'shipped' || status === 'delivered') {
          btnText = '✓ Picked Up / Out for Delivery';
          btnClass = 'studio-btn-xl--disabled';
          action = 'done';
        }

        const locations = {
          'order-1': 'Delhi NCR',
          'order-2': 'Mumbai, Maharashtra',
          'order-3': 'Bengaluru, Karnataka',
        };
        const customerLocation = locations[order.id] || 'Jaipur, Rajasthan';
        
        return `
          <div class="order-card-large" data-order-id="${order.id}">
            <div class="order-product-info">
              <div class="order-product-img" style="background: linear-gradient(135deg, ${product.color || '#DEB887'}20, ${product.color || '#DEB887'}40);">
                ${product.emoji || '🧶'}
              </div>
              <div class="order-details">
                <span style="font-weight: bold; font-size: 1.1rem; color: var(--wool-charcoal);">${order.productTitle}</span>
                <span style="font-size: 0.9rem; color: var(--artisan-olive); font-weight: bold;">
                  ${order.quantity} item${order.quantity !== 1 ? 's' : ''} · ${formatRupees(order.totalAmount / 100)}
                </span>
                <div class="order-customer-loc">
                  📍 Delivery to: ${customerLocation}
                </div>
              </div>
            </div>
            
            <button class="studio-btn-xl ${btnClass}" data-order-action="${action}" data-order-id="${order.id}" ${action === 'done' ? 'disabled' : ''}>
              ${btnText}
            </button>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderShopTab() {
  const products = demoProducts.filter(p => p.artisanId === 'artisan-1');
  
  if (products.length === 0) {
    return `
      <div class="empty-state" style="padding: 40px 20px;">
        <div class="empty-state__icon" style="font-size: 3.5rem;">🏪</div>
        <div class="empty-state__title" style="font-size: 1.25rem; font-weight: bold; margin-top: 10px;">Your Shop is Empty</div>
        <p class="empty-state__text">Tap the "+" button below to add your first crochet creation!</p>
      </div>
    `;
  }
  
  return `
    <h2 style="font-size: 1.2rem; font-weight: bold; margin-bottom: var(--space-4);">My Creations</h2>
    <div class="studio-shop-grid">
      ${products.map(p => {
        const isAvailable = productAvailability[p.id] !== undefined ? productAvailability[p.id] : p.isAvailable;
        return `
          <div class="studio-product-card">
            <div class="studio-product-card__img" style="background: linear-gradient(135deg, ${p.color || '#DEB887'}20, ${p.color || '#DEB887'}40);">
              ${p.emoji || '🧶'}
            </div>
            <h3 style="font-size: 1rem; font-weight: bold; margin: 0; text-align: center; color: var(--wool-charcoal);">${p.title}</h3>
            <span style="font-weight: bold; color: var(--artisan-olive); text-align: center; display: block; font-size: 0.95rem;">
              ${formatRupees(p.price / 100)}
            </span>
            
            <div class="studio-toggle-row">
              <span style="font-size: 0.85rem; font-weight: bold; color: ${isAvailable ? 'var(--artisan-olive)' : 'var(--cozy-taupe)'};">
                ${isAvailable ? 'Available' : 'Sold Out'}
              </span>
              <label class="big-switch">
                <input 
                  type="checkbox" 
                  data-product-toggle-id="${p.id}"
                  ${isAvailable ? 'checked' : ''}
                />
                <span class="big-slider"></span>
              </label>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderStoriesTab() {
  return `
    <div class="stories-container">
      <!-- Record Crafting Update Card -->
      <div class="record-story-card" id="record-story-btn">
        <span style="font-size: 3rem; line-height: 1;">🎙️</span>
        <h3 style="font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: bold; margin: 0; color: var(--wool-charcoal);">Record Crafting Update</h3>
        <p style="font-size: 0.85rem; color: var(--cozy-taupe); margin: 0; line-height: 1.4;">
          Tap to record a 15-second voice message or process video for your followers!
        </p>
      </div>
      
      <h2 style="font-size: 1.2rem; font-weight: bold; margin-bottom: var(--space-2); margin-top: var(--space-4);">Your Studio Stories</h2>
      
      <!-- Story 1 -->
      <div class="story-post-card">
        <div class="story-post-media">
          🧶
          <div class="story-play-overlay">▶</div>
        </div>
        <div style="padding: var(--space-4);">
          <strong style="font-size: 0.95rem; display: block; margin-bottom: 4px; color: var(--wool-charcoal);">Granny Square Pattern Progress</strong>
          <span style="font-size: 0.8rem; color: var(--cozy-taupe);">Posted 2 hours ago · 45 views</span>
        </div>
      </div>
      
      <!-- Story 2 -->
      <div class="story-post-card">
        <div class="story-post-media">
          🎨
          <div class="story-play-overlay">▶</div>
        </div>
        <div style="padding: var(--space-4);">
          <strong style="font-size: 0.95rem; display: block; margin-bottom: 4px; color: var(--wool-charcoal);">Dyeing a New Batch of Wool</strong>
          <span style="font-size: 0.8rem; color: var(--cozy-taupe);">Posted yesterday · 98 views</span>
        </div>
      </div>
    </div>
  `;
}

function renderWalletTab() {
  const orders = demoOrders.filter(o => o.artisanId === 'artisan-1');
  const pendingEarning = orders
    .filter(o => o.status !== 'delivered')
    .reduce((sum, o) => sum + o.artisanEarning, 0);

  const artisan = getCurrentArtisan() || { upiId: 'priya@upi' };

  return `
    <div class="wallet-card-xl">
      <span style="font-size: 4rem; line-height: 1;">💰</span>
      <div class="wallet-balance-title">Pending Payout Account Balance</div>
      <div class="wallet-balance-value">${formatRupees(pendingEarning / 100)}</div>
      
      <div class="upi-verified-badge">
        <span>✓ Verified UPI Payout</span>
        <span style="font-family: monospace; opacity: 0.85;">(${artisan.upiId})</span>
      </div>
      
      <p style="font-size: 0.85rem; color: var(--cozy-taupe); line-height: 1.6; max-width: 280px; margin: 0; margin-top: var(--space-4);">
        Payouts are automatically sent to your UPI account within 24 hours of successful doorstep courier pickup.
      </p>
    </div>
  `;
}

function reRenderPage() {
  const app = document.getElementById('app');
  app.innerHTML = render();
  init();
}

export function init() {
  // Setup tab buttons click listeners
  const tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activeTab = tab.dataset.tab;
      reRenderPage();
    });
  });

  // Logout button
  const logoutBtn = document.getElementById('studio-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      import('../../utils/demo-data.js').then(mod => {
        mod.logoutArtisan();
        showToast('Logged out successfully', 'info');
        navigate('/artisan/login');
      });
    });
  }

  // Handle actions on Orders Tab
  if (activeTab === 'orders') {
    document.querySelectorAll('[data-order-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.dataset.orderId;
        const action = btn.dataset.orderAction;

        if (action === 'accept') {
          orderStatuses[orderId] = 'accepted';
          showToast('Order Accepted! Preparing your parcel 📦', 'success');
          reRenderPage();
        } else if (action === 'call-courier') {
          orderStatuses[orderId] = 'shipped';
          showToast('Courier called! Pickup scheduled at your doorstep 🚚', 'success');
          reRenderPage();
        }
      });
    });
  }

  // Handle actions on Shop Tab
  if (activeTab === 'shop') {
    // Availability toggles
    document.querySelectorAll('[data-product-toggle-id]').forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const productId = toggle.dataset.productToggleId;
        const isAvailable = e.target.checked;
        productAvailability[productId] = isAvailable;
        
        // Update product availability in demo-data store
        import('../../utils/demo-data.js').then(mod => {
          mod.updateProductAvailability(productId, isAvailable);
          if (isAvailable) {
            showToast('Item is now listed as Available!', 'success');
          } else {
            showToast('Item marked as Sold Out.', 'info');
          }
          reRenderPage();
        });
      });
    });

    // Floating action button (+)
    const fabAdd = document.getElementById('studio-fab-add');
    if (fabAdd) {
      fabAdd.addEventListener('click', () => {
        navigate('/artisan/add-product');
      });
    }
  }

  // Handle actions on Stories Tab
  if (activeTab === 'stories') {
    const recordBtn = document.getElementById('record-story-btn');
    if (recordBtn) {
      recordBtn.addEventListener('click', () => {
        showToast('🎙️ Voice recorder active! Talk now...', 'info');
      });
    }
  }
}

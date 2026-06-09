/**
 * Shop Page — Knoticeable
 * Instagram-style profile page for artisans
 */

import { navigate, getParams } from '../../router.js';
import { getArtisanById, getProductsByArtisan, getCurrentArtisan, updateArtisan } from '../../utils/demo-data.js';
import { formatRupees } from '../../utils/format.js';
import { showToast } from '../../components/toast.js';
import { renderNavbar } from '../../components/navbar.js';

function getArtisanContext() {
  const params = getParams();
  const artisanId = params.id || window.__routeParams?.id;
  const current = getCurrentArtisan();
  
  // Default to current logged-in artisan if no ID is specified
  if (!artisanId && current) {
    return { artisan: current, isOwner: true };
  }
  
  const artisan = getArtisanById(artisanId) || current || {
    uid: 'artisan-1',
    shopName: "Priya's Crochet Studio",
    bio: 'Handmade crochet with love from Jaipur 🧶',
    upiId: 'priya@upi',
  };
  
  const isOwner = current && current.uid === artisan.uid;
  return { artisan, isOwner };
}

export function render() {
  const { artisan, isOwner } = getArtisanContext();
  const products = getProductsByArtisan(artisan.uid);

  return `
    ${renderNavbar('')}

    <section class="page shop-page" style="padding-bottom: calc(var(--nav-height) + var(--safe-bottom) + var(--space-4));">
      <!-- Header -->
      <header class="mobile-header" style="
        padding: var(--space-3) var(--space-4);
        border-bottom: 1px solid var(--color-border);
        min-height: var(--header-height);
        background: var(--color-surface);
        display: flex;
        align-items: center;
        gap: var(--space-3);
        position: sticky;
        top: 0;
        z-index: 10;
      ">
        <button class="btn btn--icon btn-ghost" id="shop-back-btn" aria-label="Go back" style="font-size: 1.3rem;">←</button>
        <h1 style="font-size: var(--text-base); font-weight: var(--font-bold); color: var(--color-on-surface); margin: 0; flex: 1;">
          ${artisan.shopName}
        </h1>
        ${isOwner ? '<span style="font-size: var(--text-xs); background: var(--color-primary-light); color: var(--color-primary); padding: 4px var(--space-2); border-radius: var(--radius-sm); font-weight: var(--font-bold);">Your Shop</span>' : ''}
      </header>

      <div class="shop-layout-container">
        <div class="shop-profile-column">
          <!-- Instagram Profile Section -->
          <div style="padding: var(--space-4); background: var(--color-surface); border-bottom: 1px solid var(--color-border); border-radius: var(--radius-md); box-shadow: var(--shadow-card);">
            <div style="display: flex; align-items: center; gap: var(--space-5); margin-bottom: var(--space-4);">
              <!-- Shop Icon / Avatar -->
              <div style="
                width: 77px;
                height: 77px;
                border-radius: var(--radius-full);
                background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.2rem;
                color: white;
                border: 2px solid var(--color-surface);
                box-shadow: 0 0 0 2px var(--color-primary);
                flex-shrink: 0;
              ">
                🏪
              </div>

              <!-- Stats Grid -->
              <div style="display: flex; flex: 1; justify-content: space-around; text-align: center;">
                <div>
                  <div style="font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--color-on-surface);">${products.length}</div>
                  <div style="font-size: var(--text-xs); color: var(--color-on-surface-muted);">Products</div>
                </div>
                <div>
                  <div style="font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--color-on-surface);">Live</div>
                  <div style="font-size: var(--text-xs); color: var(--color-on-surface-muted);">Status</div>
                </div>
              </div>
            </div>

            <!-- Shop Name & Bio -->
            <div style="margin-bottom: var(--space-4);">
              <div style="font-size: var(--text-base); font-weight: var(--font-bold); color: var(--color-on-surface);">${artisan.shopName}</div>
              <div id="shop-bio-text" style="font-size: var(--text-sm); color: var(--color-on-surface-medium); line-height: 1.4; white-space: pre-wrap; margin-top: var(--space-1);">${artisan.bio || 'Handmade crochet crafts 🧶'}</div>
              <div style="font-size: var(--text-xs); color: var(--color-primary); font-weight: var(--font-medium); margin-top: var(--space-2); display: flex; align-items: center; gap: 4px;">
                <span>💰 UPI Payout:</span>
                <span style="font-family: monospace;">${artisan.upiId}</span>
              </div>
            </div>

            <!-- Instagram Profile Action Buttons -->
            <div style="display: flex; gap: var(--space-2);">
              ${isOwner ? `
                <button class="btn btn-secondary" id="edit-bio-btn" style="flex: 1; min-height: 40px; font-size: var(--text-sm); border-radius: var(--radius-sm); font-weight: var(--font-semibold);">
                  ✏️ Edit Shop Bio
                </button>
                <button class="btn btn-primary" id="shop-add-btn" style="flex: 1; min-height: 40px; font-size: var(--text-sm); border-radius: var(--radius-sm); font-weight: var(--font-semibold);">
                  📸 Add Product
                </button>
              ` : `
                <button class="btn btn-primary" id="share-shop-whatsapp" style="width: 100%; min-height: 48px; font-size: var(--text-sm); border-radius: var(--radius-sm); font-weight: var(--font-semibold); background: var(--color-accent); border-color: var(--color-accent);">
                  💬 Share Shop on WhatsApp
                </button>
              `}
            </div>
          </div>
        </div>

        <div class="shop-products-column">
          <!-- Instagram Grid Layout -->
          <div style="background: var(--color-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-card); overflow: hidden;">
        <!-- Tab Indicators -->
        <div style="
          display: flex;
          border-bottom: 1px solid var(--color-border);
          justify-content: center;
        ">
          <div style="
            border-bottom: 2px solid var(--color-on-surface);
            padding: var(--space-3) var(--space-6);
            display: flex;
            align-items: center;
            gap: var(--space-2);
            color: var(--color-on-surface);
            font-weight: var(--font-bold);
            font-size: var(--text-sm);
          ">
            <span>📋</span>
            <span>PRODUCTS GRID</span>
          </div>
        </div>

        <!-- Instagram 3-column Grid -->
        ${products.length > 0 ? `
          <div style="
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2px;
            padding: 2px;
          ">
            ${products.map(p => `
              <div class="shop-grid-item" data-id="${p.id}" style="
                aspect-ratio: 1/1;
                background: linear-gradient(135deg, ${p.color}20, ${p.color}40);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.8rem;
                position: relative;
                cursor: pointer;
                overflow: hidden;
              ">
                ${p.emoji}
                <!-- Price tag overlay -->
                <div style="
                  position: absolute;
                  bottom: var(--space-1);
                  right: var(--space-1);
                  background: rgba(0, 0, 0, 0.7);
                  color: white;
                  font-size: 0.75rem;
                  font-weight: var(--font-bold);
                  padding: 2px 6px;
                  border-radius: var(--radius-sm);
                ">
                  ${formatRupees(p.price / 100)}
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state" style="padding: var(--space-12) var(--space-6);">
            <div class="empty-state__icon" style="font-size: 3rem;">📸</div>
            <div class="empty-state__title" style="font-size: var(--text-base); font-weight: var(--font-bold); margin-top: var(--space-2);">No products listed yet</div>
            <p class="empty-state__text" style="font-size: var(--text-sm); color: var(--color-on-surface-muted);">All the products listed by this shop will appear here.</p>
          </div>
        `}
        </div>
      </div>

      <!-- Edit Bio Modal (Hidden by default) -->
      <div id="bio-modal" style="
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 100;
        align-items: center;
        justify-content: center;
        padding: var(--space-4);
      ">
        <div style="
          background: var(--color-surface);
          border-radius: var(--radius-md);
          padding: var(--space-5);
          width: 100%;
          max-width: 340px;
          box-shadow: var(--shadow-lg);
        ">
          <h3 style="margin-top: 0; margin-bottom: var(--space-3); font-size: var(--text-base); font-weight: var(--font-bold); color: var(--color-on-surface);">✏️ Edit Shop Bio</h3>
          <textarea id="bio-textarea" class="input" rows="4" style="resize: none; width: 100%; box-sizing: border-box; margin-bottom: var(--space-4); min-height: 80px;" placeholder="Describe your crochet business..."></textarea>
          <div style="display: flex; gap: var(--space-2); justify-content: flex-end;">
            <button class="btn btn-ghost" id="bio-cancel-btn" style="min-height: 40px; font-size: var(--text-sm);">Cancel</button>
            <button class="btn btn-primary" id="bio-save-btn" style="min-height: 40px; font-size: var(--text-sm); padding: 0 var(--space-4); width: auto;">Save</button>
          </div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      ${isOwner ? `
        <!-- Artisan Nav -->
        <nav class="bottom-nav" aria-label="Artisan navigation">
          <a class="bottom-nav__item" href="#/artisan/dashboard" aria-label="Home">
            <span class="bottom-nav__icon">🏠</span>
            <span>Home</span>
          </a>
          <div class="fab" id="nav-add-product-shop" role="button" tabindex="0" aria-label="Add product">
            <button class="fab__btn" aria-label="Add new product">➕</button>
            <span class="fab__label">Add</span>
          </div>
          <a class="bottom-nav__item bottom-nav__item--active" href="#/shop" aria-label="Shop Profile" aria-current="page">
            <span class="bottom-nav__icon">🏪</span>
            <span>My Shop</span>
          </a>
        </nav>
      ` : `
        <!-- Consumer Nav -->
        <nav class="bottom-nav" aria-label="Main navigation">
          <a class="bottom-nav__item" href="#/">
            <span class="bottom-nav__icon">🏠</span>
            <span>Home</span>
          </a>
          <a class="bottom-nav__item" href="#/search">
            <span class="bottom-nav__icon">🔍</span>
            <span>Search</span>
          </a>
          <a class="bottom-nav__item" href="#/profile">
            <span class="bottom-nav__icon">👤</span>
            <span>Profile</span>
          </a>
        </nav>
      `}
    </section>
  `;
}

export function init() {
  const { artisan, isOwner } = getArtisanContext();
  const products = getProductsByArtisan(artisan.uid);

  // Back button
  const backBtn = document.getElementById('shop-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.history.back();
    });
  }

  // Add Product FAB/Button (Artisan Owner view)
  const addBtn = document.getElementById('shop-add-btn');
  const fabAdd = document.getElementById('nav-add-product-shop');
  
  const handleAddProduct = () => {
    navigate('/artisan/add-product');
  };

  if (addBtn) addBtn.addEventListener('click', handleAddProduct);
  if (fabAdd) fabAdd.addEventListener('click', handleAddProduct);

  // Product Grid item clicks
  document.querySelectorAll('.shop-grid-item').forEach(item => {
    item.addEventListener('click', () => {
      const prodId = item.dataset.id;
      navigate('/product', { id: prodId });
    });
  });

  // Edit Bio Modals & Functionality
  if (isOwner) {
    const editBioBtn = document.getElementById('edit-bio-btn');
    const modal = document.getElementById('bio-modal');
    const cancelBtn = document.getElementById('bio-cancel-btn');
    const saveBtn = document.getElementById('bio-save-btn');
    const textarea = document.getElementById('bio-textarea');
    const bioText = document.getElementById('shop-bio-text');

    if (editBioBtn && modal && textarea) {
      editBioBtn.addEventListener('click', () => {
        textarea.value = artisan.bio || '';
        modal.style.display = 'flex';
        textarea.focus();
      });
    }

    if (cancelBtn && modal) {
      cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    if (saveBtn && modal && textarea && bioText) {
      saveBtn.addEventListener('click', () => {
        const newBio = textarea.value.trim();
        updateArtisan(artisan.uid, { bio: newBio });
        
        // Update view directly
        bioText.textContent = newBio || 'Handmade crochet crafts 🧶';
        artisan.bio = newBio;
        modal.style.display = 'none';
        showToast('Bio updated successfully!', 'success');
      });
    }

    // Close modal on click outside content
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    }
  } else {
    // Share Shop on WhatsApp (Buyer view)
    const shareBtn = document.getElementById('share-shop-whatsapp');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const shareText = `Check out ${artisan.shopName}'s beautiful crochet shop on Knoticeable! 🧶\n${window.location.origin}/#/shop?id=${artisan.uid}`;
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank');
      });
    }
  }
}

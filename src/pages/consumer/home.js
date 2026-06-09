/**
 * Home Page — Knoticeable
 * Marketplace landing with cozy felted wool theme and Okhai-style storefront structure
 */

import { navigate } from '../../router.js';
import { demoProducts, demoCategories, getCartCount, getProductsByArtisan } from '../../utils/demo-data.js';
import { formatRupees } from '../../utils/format.js';

function getArtisanCluster(artisanId) {
  const clusters = {
    'artisan-1': "Priya's Crochet Studio, Jaipur Cluster",
    'artisan-2': 'Meena Craft Corner, Kochi Handcrafts',
    'artisan-3': "Ritu's Yarn Art, Lucknow Cluster",
    'artisan-4': 'Anu Crochet Creations, Madurai Collective',
  };
  return clusters[artisanId] || 'Handcrafts Collective';
}

function renderProductCard(product) {
  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-img" style="
        background: linear-gradient(135deg, ${product.color}20, ${product.color}40);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 5rem;
      ">
        ${product.emoji}
      </div>
      <div class="product-info">
        <h3 class="wool-font" style="margin: 0 0 5px 0; font-size: 1.05rem; line-height: 1.3;">
          ${product.title}
        </h3>
        <div class="artisan-tag" style="font-size: 0.75rem; color: var(--cozy-taupe); margin-bottom: 10px;">
          by ${getArtisanCluster(product.artisanId)}
        </div>
        <div class="price-row" style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
          <span class="price" style="font-weight: bold; font-size: 1.1rem; color: var(--artisan-olive);">${formatRupees(product.price / 100)}</span>
          <button class="cta-btn" style="padding: 6px 14px; font-size: 0.8rem; border-radius: 20px;">View</button>
        </div>
      </div>
    </div>`;
}

export function render() {
  const cartCount = getCartCount();
  const bestsellers = [...demoProducts].slice(0, 4);

  return `
    <!-- Top Announcement Banner -->
    <div class="featured-banner">
      ✨ FEATURED CATEGORY: <span class="wool-font" style="font-style: italic;">Crochet Bags</span> - 15% Off with code WOOL15 👜
    </div>

    <section class="page home-page" style="padding-bottom: calc(var(--nav-height) + var(--safe-bottom) + var(--space-4));">
      
      <!-- Sticky Header -->
      <header class="home-header" style="
        position: sticky;
        top: 0;
        z-index: 50;
        background: var(--color-surface-dim);
        padding: var(--space-3) var(--space-4);
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--cozy-taupe);
        min-height: var(--header-height);
      ">
        <div class="wool-font" style="font-size: var(--text-xl); font-weight: var(--font-bold); color: var(--wool-charcoal);">
          🧶 Knoticeable
        </div>
        <button class="btn btn--icon btn-ghost" id="header-cart-btn" aria-label="Shopping cart" style="position: relative; font-size: 1.5rem;">
          🛒
          ${cartCount > 0 ? `<span style="
            position: absolute;
            top: 2px;
            right: 2px;
            background: var(--artisan-olive);
            color: white;
            font-size: 0.7rem;
            font-weight: var(--font-bold);
            min-width: 18px;
            height: 18px;
            border-radius: var(--radius-full);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 4px;
          ">${cartCount}</span>` : ''}
        </button>
      </header>

      <div class="container" style="padding-top: var(--space-4);">
        <!-- Search Bar -->
        <div class="search-bar" id="search-trigger" style="
          margin-bottom: var(--space-6); 
          background: white; 
          border: 1px solid var(--cozy-taupe);
          border-radius: var(--radius-full);
          padding: 0 var(--space-4);
          display: flex;
          align-items: center;
          height: 52px;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
        ">
          <span style="font-size: 1.2rem; color: var(--cozy-taupe); margin-right: var(--space-3);">🔍</span>
          <input
            type="text"
            placeholder="Search cozy crochet items..."
            readonly
            style="border: none; background: transparent; outline: none; font-size: 1rem; width: 100%; color: var(--wool-charcoal); cursor: pointer;"
          />
        </div>

        <!-- Hero Section -->
        <section class="hero">
          <div class="hero-text">
            <h1 class="wool-font">Woven Stories, Held by Hand.</h1>
            <p>Discover our brand new collection of organic cotton crochet bags. Individually stitched over hours of patient labor by artisan women clusters across India.</p>
            <button class="cta-btn" id="hero-cta-btn">Explore Tote Bags</button>
          </div>
          <div class="hero-img">
            <div style="background: linear-gradient(135deg, #DEB88730, #DEB88760); width: 100%; height: 280px; display: flex; align-items: center; justify-content: center; color: var(--cozy-taupe); font-size: 5rem; border-radius: 16px;">
              👜
            </div>
          </div>
        </section>

        <!-- Bestsellers Section -->
        <section>
          <h2 class="section-title wool-font">The Bestsellers</h2>
          <div class="product-grid">
            ${bestsellers.map(p => renderProductCard(p)).join('')}
          </div>
        </section>

        <!-- Shop Categories -->
        <section style="margin-top: 50px;">
          <h2 class="section-title wool-font">Shop Categories</h2>
          <div class="category-row">
            <div class="category-card" data-category="bags" style="background: linear-gradient(135deg, var(--cozy-taupe), var(--wool-charcoal));">
              <h3 class="wool-font">Bags & Totes 👜</h3>
            </div>
            <div class="category-card" data-category="accessories" style="background: linear-gradient(135deg, var(--artisan-olive), var(--wool-charcoal));">
              <h3 class="wool-font">Wearables & Gear 👗</h3>
            </div>
            <div class="category-card" data-category="home-decor" style="background: linear-gradient(135deg, var(--cozy-taupe), var(--artisan-olive));">
              <h3 class="wool-font">Home & Decor 🏠</h3>
            </div>
          </div>
        </section>

        <!-- Meet Our Artisans Scroll -->
        <section style="margin-bottom: 50px;">
          <h2 class="section-title wool-font">Meet Our Artisans</h2>
          <div class="video-scroll">
            <div class="video-card">
              <div class="video-placeholder">
                <div class="play-btn">▶</div>
              </div>
              <div class="artisan-profile-summary">
                <h4 class="wool-font">Priya S.</h4>
                <div class="artisan-tag" style="margin:0;">Jaipur Handcrafts</div>
                <button class="shop-link-btn" data-artisan-id="artisan-1" style="width: 100%; border: 1px solid var(--cozy-taupe); background: none;">Visit Her Shop</button>
              </div>
            </div>
            <div class="video-card">
              <div class="video-placeholder">
                <div class="play-btn">▶</div>
              </div>
              <div class="artisan-profile-summary">
                <h4 class="wool-font">Meena Devi</h4>
                <div class="artisan-tag" style="margin:0;">Palakkad Collective</div>
                <button class="shop-link-btn" data-artisan-id="artisan-2" style="width: 100%; border: 1px solid var(--cozy-taupe); background: none;">Visit Her Shop</button>
              </div>
            </div>
            <div class="video-card">
              <div class="video-placeholder">
                <div class="play-btn">▶</div>
              </div>
              <div class="artisan-profile-summary">
                <h4 class="wool-font">Ritu Raj</h4>
                <div class="artisan-tag" style="margin:0;">Bastar Craft Cluster</div>
                <button class="shop-link-btn" data-artisan-id="artisan-3" style="width: 100%; border: 1px solid var(--cozy-taupe); background: none;">Visit Her Shop</button>
              </div>
            </div>
            <div class="video-card">
              <div class="video-placeholder">
                <div class="play-btn">▶</div>
              </div>
              <div class="artisan-profile-summary">
                <h4 class="wool-font">Anu Creations</h4>
                <div class="artisan-tag" style="margin:0;">Ludhiana Knitters</div>
                <button class="shop-link-btn" data-artisan-id="artisan-4" style="width: 100%; border: 1px solid var(--cozy-taupe); background: none;">Visit Her Shop</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Footer Element -->
      <footer style="background-color: var(--wool-charcoal); color: var(--soft-oatmeal); padding: 50px 0 25px 0; margin-top: 60px;">
        <div class="container footer-cols">
          <div class="footer-col">
            <h3 class="wool-font" style="color: white; font-size: 1.4rem;">Knoticeable</h3>
            <p>An ecosystem dedicated to empowering independent women crochet crafters and micro-entrepreneurs. Bringing ancient slow-fashion techniques to modern global doorsteps.</p>
          </div>
          <div class="footer-col">
            <h3 class="wool-font" style="color: white;">Discover</h3>
            <p style="color: #A0A5C1; line-height: 1.8;">Our Artisans<br />Bestselling Collections<br />Custom Order Request<br />Sustainability Report</p>
          </div>
          <div class="footer-col">
            <h3 class="wool-font" style="color: white;">Support</h3>
            <p style="color: #A0A5C1; line-height: 1.8;">Fulfillment & Shipping<br />Artisan Fair-Pay Policy<br />Return & Refund Protocol<br />Contact Corporate Trust</p>
          </div>
        </div>
        <div class="footer-bottom">
          &copy; 2026 Knoticeable Inc. Hand-stitched with love. All rights reserved.
        </div>
      </footer>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav" aria-label="Main navigation">
        <a class="bottom-nav__item bottom-nav__item--active" href="#/" aria-current="page">
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
    </section>`;
}

export function init() {
  // Search bar click
  const searchTrigger = document.getElementById('search-trigger');
  if (searchTrigger) {
    searchTrigger.addEventListener('click', () => {
      navigate('/search');
    });
  }

  // Cart icon click
  const cartBtn = document.getElementById('header-cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      navigate('/cart');
    });
  }

  // Hero CTA button (explore bags)
  const heroCta = document.getElementById('hero-cta-btn');
  if (heroCta) {
    heroCta.addEventListener('click', () => {
      navigate('/search?cat=bags');
    });
  }

  // Category card clicks
  document.querySelectorAll('.category-card[data-category]').forEach(card => {
    card.addEventListener('click', () => {
      const catId = card.dataset.category;
      navigate(`/search?cat=${catId}`);
    });
  });

  // Product card clicks (grid list)
  document.querySelectorAll('.product-card[data-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicked on the button directly
      if (e.target.classList.contains('cta-btn')) return;
      const productId = card.dataset.id;
      navigate('/product', { id: productId });
    });
    
    // Support click on "View" button
    const viewBtn = card.querySelector('.cta-btn');
    if (viewBtn) {
      viewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = card.dataset.id;
        navigate('/product', { id: productId });
      });
    }
  });

  // Visit artisan shop buttons
  document.querySelectorAll('.shop-link-btn[data-artisan-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const artisanId = btn.dataset.artisanId;
      navigate('/shop', { id: artisanId });
    });
  });

  // Video carousel play button hover simulation / play toast
  document.querySelectorAll('.video-placeholder .play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showToast('▶ Loading artisan story video...', 'info');
    });
  });
}

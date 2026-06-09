/**
 * Home Page — Knoticeable
 * Marketplace landing with hero, categories, trending products
 */

import { navigate } from '../../router.js';
import { demoProducts, demoCategories, getCartCount } from '../../utils/demo-data.js';
import { formatRupees } from '../../utils/format.js';

function renderProductCard(product) {
  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-card__image" style="background: linear-gradient(135deg, ${product.color}20, ${product.color}40); display: flex; align-items: center; justify-content: center; font-size: 4rem;">${product.emoji}</div>
      <div class="product-card__body">
        <div class="product-card__title">${product.title}</div>
        <div class="product-card__price">${formatRupees(product.price / 100)}</div>
        <div class="product-card__shop">🏪 ${product.shopName}</div>
      </div>
    </div>`;
}

export function render() {
  const cartCount = getCartCount();
  const trendingProducts = [...demoProducts]
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 8);

  return `
    <section class="page home-page">
      <!-- Sticky Header -->
      <header class="home-header" style="
        position: sticky;
        top: 0;
        z-index: 50;
        background: var(--color-surface);
        padding: var(--space-3) var(--space-4);
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--color-border);
        min-height: var(--header-height);
      ">
        <div style="font-size: var(--text-xl); font-weight: var(--font-bold); color: var(--color-primary);">
          🧶 Knoticeable
        </div>
        <button class="btn btn--icon btn-ghost" id="header-cart-btn" aria-label="Shopping cart" style="position: relative; font-size: 1.5rem;">
          🛒
          ${cartCount > 0 ? `<span style="
            position: absolute;
            top: 2px;
            right: 2px;
            background: var(--color-secondary);
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

      <div style="padding: var(--space-4); padding-bottom: calc(var(--nav-height) + var(--safe-bottom) + var(--space-4));">
        <!-- Search Bar -->
        <div class="search-bar" id="search-trigger">
          <span class="search-bar__icon">🔍</span>
          <input
            type="text"
            class="search-bar__input"
            placeholder="Search crochet products..."
            readonly
            aria-label="Search products"
            style="cursor: pointer;"
          />
        </div>

        <!-- Category Chips -->
        <div class="chip-scroll" style="margin-bottom: var(--space-5);">
          ${demoCategories.map(cat => `
            <div class="chip" data-category="${cat.id}" role="button" tabindex="0" aria-label="${cat.name}">
              <span class="chip__icon">${cat.icon}</span>
              <span>${cat.name}</span>
            </div>
          `).join('')}
        </div>

        <!-- Hero Banner -->
        <div style="
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
          border-radius: var(--radius-lg);
          padding: var(--space-8) var(--space-6);
          margin-bottom: var(--space-6);
          color: white;
          text-align: center;
        ">
          <div style="font-size: var(--text-2xl); font-weight: var(--font-bold); margin-bottom: var(--space-2);">
            Handmade with ❤️
          </div>
          <div style="font-size: var(--text-sm); opacity: 0.9; line-height: var(--leading-relaxed);">
            Discover unique crochet creations from artisans across India
          </div>
        </div>

        <!-- Trending Now -->
        <div style="margin-bottom: var(--space-6);">
          <h2 style="font-size: var(--text-xl); font-weight: var(--font-bold); color: var(--color-on-surface); margin-bottom: var(--space-4);">
            🔥 Trending Now
          </h2>
          <div class="product-grid">
            ${trendingProducts.map(p => renderProductCard(p)).join('')}
          </div>
        </div>
      </div>

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
  // Search bar click → navigate to search
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

  // Category chip clicks
  document.querySelectorAll('.chip[data-category]').forEach(chip => {
    chip.addEventListener('click', () => {
      const catId = chip.dataset.category;
      navigate(`/search?cat=${catId}`);
    });
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const catId = chip.dataset.category;
        navigate(`/search?cat=${catId}`);
      }
    });
  });

  // Product card clicks
  document.querySelectorAll('.product-card[data-id]').forEach(card => {
    card.addEventListener('click', () => {
      const productId = card.dataset.id;
      navigate('/product', { id: productId });
    });
  });
}

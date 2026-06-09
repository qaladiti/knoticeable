/**
 * Search Page — Knoticeable
 * Real-time search with category filters and product grid
 */

import { navigate, getParams } from '../../router.js';
import { searchProducts, demoProducts, demoCategories } from '../../utils/demo-data.js';
import { formatRupees } from '../../utils/format.js';
import { renderNavbar } from '../../components/navbar.js';

let debounceTimer = null;

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

function renderResults(products) {
  if (products.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state__icon">🔍</div>
        <div class="empty-state__title">No products found</div>
        <div class="empty-state__text">Try searching for 'sunflower' or 'bag'</div>
      </div>`;
  }

  return `
    <div id="result-count" style="font-size: var(--text-sm); color: var(--color-on-surface-muted); margin-bottom: var(--space-3);">
      ${products.length} product${products.length !== 1 ? 's' : ''} found
    </div>
    <div class="product-grid">
      ${products.map(p => renderProductCard(p)).join('')}
    </div>`;
}

function getActiveCategoryFromHash() {
  const hash = window.location.hash;
  const match = hash.match(/[?&]cat=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getCategoryNameById(catId) {
  const cat = demoCategories.find(c => c.id === catId);
  return cat ? cat.name : null;
}

export function render() {
  const activeCat = getActiveCategoryFromHash();
  const catName = activeCat ? getCategoryNameById(activeCat) : null;
  const params = getParams();
  const queryParam = params.query || '';

  let initialProducts;
  if (queryParam) {
    initialProducts = searchProducts(queryParam);
  } else if (catName) {
    initialProducts = demoProducts.filter(
      p => p.category.toLowerCase() === catName.toLowerCase()
    );
  } else {
    initialProducts = demoProducts;
  }

  return `
    ${renderNavbar('search')}

    <section class="page search-page">
      <!-- Header with back + search -->
      <div class="search-page-header" style="
        padding: var(--space-3) var(--space-4);
        display: flex;
        align-items: center;
        gap: var(--space-3);
        background: var(--color-surface);
        border-bottom: 1px solid var(--color-border);
      ">
        <button class="btn btn--icon btn-ghost" id="search-back-btn" aria-label="Go back" style="flex-shrink: 0; font-size: 1.3rem;">
          ←
        </button>
        <div style="flex: 1; position: relative;">
          <span style="
            position: absolute;
            left: var(--space-4);
            top: 50%;
            transform: translateY(-50%);
            font-size: var(--text-lg);
            color: var(--color-on-surface-muted);
            pointer-events: none;
          ">🔍</span>
          <input
            type="text"
            id="search-input"
            class="search-bar__input"
            placeholder="Search crochet products..."
            aria-label="Search products"
            value="${queryParam || catName || ''}"
            style="padding-left: var(--space-12);"
          />
        </div>
      </div>

      <div style="padding: var(--space-4); padding-bottom: calc(var(--nav-height) + var(--safe-bottom) + var(--space-4));">
        <!-- Category Filter Chips -->
        <div class="chip-scroll" style="margin-bottom: var(--space-4);">
          ${demoCategories.map(cat => `
            <div class="chip ${activeCat === cat.id ? 'chip--active' : ''}" data-filter-cat="${cat.id}" role="button" tabindex="0" aria-label="Filter by ${cat.name}">
              <span class="chip__icon">${cat.icon}</span>
              <span>${cat.name}</span>
            </div>
          `).join('')}
        </div>

        <!-- Results Area -->
        <div id="search-results">
          ${renderResults(initialProducts)}
        </div>
      </div>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav" aria-label="Main navigation">
        <a class="bottom-nav__item" href="#/">
          <span class="bottom-nav__icon">🏠</span>
          <span>Home</span>
        </a>
        <a class="bottom-nav__item bottom-nav__item--active" href="#/search" aria-current="page">
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

function doSearch() {
  const input = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');
  if (!input || !resultsContainer) return;

  const query = input.value.trim();

  // Check if any category chip is active
  const activeChip = document.querySelector('.chip--active[data-filter-cat]');
  let catName = null;
  if (activeChip) {
    const catId = activeChip.dataset.filterCat;
    catName = getCategoryNameById(catId);
  }

  let results;
  if (query) {
    results = searchProducts(query);
  } else if (catName) {
    results = demoProducts.filter(
      p => p.category.toLowerCase() === catName.toLowerCase()
    );
  } else {
    results = demoProducts;
  }

  // If both query and category, filter by both
  if (query && catName) {
    results = results.filter(
      p => p.category.toLowerCase() === catName.toLowerCase()
    );
  }

  resultsContainer.innerHTML = renderResults(results);
  attachProductCardListeners();
}

function attachProductCardListeners() {
  document.querySelectorAll('.product-card[data-id]').forEach(card => {
    card.addEventListener('click', () => {
      const productId = card.dataset.id;
      navigate('/product', { id: productId });
    });
  });
}

export function init() {
  const input = document.getElementById('search-input');

  // Focus the search input
  if (input) {
    input.focus();

    // Real-time search with 300ms debounce
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(doSearch, 300);
    });
  }

  // Back button
  const backBtn = document.getElementById('search-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Category filter chips
  document.querySelectorAll('.chip[data-filter-cat]').forEach(chip => {
    const handler = () => {
      const wasActive = chip.classList.contains('chip--active');
      // Remove active from all
      document.querySelectorAll('.chip[data-filter-cat]').forEach(c =>
        c.classList.remove('chip--active')
      );
      // Toggle this one
      if (!wasActive) {
        chip.classList.add('chip--active');
      }
      doSearch();
    };

    chip.addEventListener('click', handler);
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  });

  // Attach product card listeners for initial render
  attachProductCardListeners();

  return () => {
    clearTimeout(debounceTimer);
  };
}

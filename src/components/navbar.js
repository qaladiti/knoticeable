/**
 * Shared Navbar Component — Knoticeable
 * Renders the top announcement banner and responsive desktop navbar
 */

import { getCartCount } from '../utils/demo-data.js';

/**
 * Renders the responsive desktop header/navbar
 * @param {string} activeTab - The currently active tab ('home', 'search', 'profile', 'cart', 'dashboard', 'shop')
 */
export function renderNavbar(activeTab = '') {
  const cartCount = getCartCount();
  
  return `
    <!-- Top Announcement Category Banner (Visible on all screens) -->
    <div class="featured-banner" style="background-color: var(--artisan-olive); color: white; text-align: center; padding: 10px 20px; font-size: 0.9rem; font-weight: bold; width: 100%; box-sizing: border-box; z-index: 101; position: relative;">
      ✨ FEATURED CATEGORY: <span class="wool-font" style="font-style: italic;">Crochet Bags</span> - 15% Off with code WOOL15 👜
    </div>

    <!-- Desktop Top Navbar (Hidden on mobile, displayed on desktop via CSS) -->
    <header class="desktop-header">
      <a class="desktop-header__logo" href="#/" style="text-decoration: none;">
        <span>🧶</span>
        <span>Knoticeable</span>
      </a>
      
      <nav class="desktop-header__links">
        <a class="desktop-header__link ${activeTab === 'home' ? 'desktop-header__link--active' : ''}" href="#/">Home</a>
        <a class="desktop-header__link ${activeTab === 'search' ? 'desktop-header__link--active' : ''}" href="#/search">Search Products</a>
        <a class="desktop-header__link ${activeTab === 'profile' ? 'desktop-header__link--active' : ''}" href="#/profile">My Profile</a>
        <a class="desktop-header__link ${activeTab === 'dashboard' ? 'desktop-header__link--active' : ''}" href="#/artisan/dashboard">Seller Dashboard</a>
      </nav>
      
      <div class="desktop-header__actions">
        <a href="#/cart" class="btn btn--icon btn-ghost" style="position: relative; font-size: 1.5rem; text-decoration: none; display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 50%;">
          🛒
          ${cartCount > 0 ? `
            <span style="
              position: absolute;
              top: 4px;
              right: 4px;
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
            ">${cartCount}</span>
          ` : ''}
        </a>
      </div>
    </header>
  `;
}

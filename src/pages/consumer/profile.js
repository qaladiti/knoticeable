/**
 * Profile Page — Knoticeable
 * Consumer profile view with artisan mode entry point
 */

import { navigate } from '../../router.js';
import { getCurrentArtisan } from '../../utils/demo-data.js';

export function render() {
  const artisan = getCurrentArtisan();
  const isArtisan = !!artisan;

  return `
    <section class="page profile-page">
      <!-- Header -->
      <header style="
        padding: var(--space-3) var(--space-4);
        border-bottom: 1px solid var(--color-border);
        min-height: var(--header-height);
        background: var(--color-surface);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <h1 style="font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--color-on-surface);">👤 My Profile</h1>
      </header>

      <div style="padding: var(--space-6) var(--space-4); padding-bottom: calc(var(--nav-height) + var(--safe-bottom) + var(--space-4)); display: flex; flex-direction: column; gap: var(--space-6);">
        
        <!-- User Info Card -->
        <div style="
          background: var(--color-surface);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
          padding: var(--space-5);
          display: flex;
          align-items: center;
          gap: var(--space-4);
        ">
          <div style="
            width: 60px;
            height: 60px;
            border-radius: var(--radius-full);
            background: var(--color-primary-light);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: var(--color-primary);
          ">
            👩
          </div>
          <div>
            <div style="font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--color-on-surface);">Guest Buyer</div>
            <div style="font-size: var(--text-sm); color: var(--color-on-surface-muted);">Welcome to Knoticeable!</div>
          </div>
        </div>

        <!-- Artisan Mode Promo Card -->
        <div style="
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
          border-radius: var(--radius-md);
          padding: var(--space-5);
          color: white;
          box-shadow: var(--shadow-md);
        ">
          <h2 style="font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: var(--space-2);">Are you a Crochet Creator? 🧶</h2>
          <p style="font-size: var(--text-sm); opacity: 0.9; margin-bottom: var(--space-5); line-height: var(--leading-relaxed);">
            Start selling your beautiful handmade crochet items. Set up your shop and link UPI in just 2 minutes!
          </p>
          <button class="btn btn-secondary" id="artisan-mode-btn" style="background: white; color: var(--color-primary); width: 100%; border: none;">
            ${isArtisan ? '👩‍🎨 Open Artisan Dashboard' : '📲 Start Selling Crochet'}
          </button>
        </div>

        <!-- App Information -->
        <div style="
          background: var(--color-surface);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
          padding: var(--space-4);
        ">
          <h3 style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--color-on-surface-medium); margin-bottom: var(--space-3); text-transform: uppercase; letter-spacing: 0.5px;">About Knoticeable</h3>
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            <div style="display: flex; justify-content: space-between; font-size: var(--text-sm); border-bottom: 1px solid var(--color-surface-variant); padding-bottom: var(--space-2);">
              <span style="color: var(--color-on-surface-muted);">Version</span>
              <span style="font-weight: var(--font-medium); color: var(--color-on-surface);">1.0.0 (PWA)</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: var(--text-sm); border-bottom: 1px solid var(--color-surface-variant); padding-bottom: var(--space-2);">
              <span style="color: var(--color-on-surface-muted);">Handmade In</span>
              <span style="font-weight: var(--font-medium); color: var(--color-on-surface);">India 🇮🇳</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: var(--text-sm); padding-bottom: var(--space-1);">
              <span style="color: var(--color-on-surface-muted);">Built with</span>
              <span style="font-weight: var(--font-medium); color: var(--color-on-surface);">❤️ & Crochet</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav" aria-label="Main navigation">
        <a class="bottom-nav__item" href="#/">
          <span class="bottom-nav__icon">🏠</span>
          <span>Home</span>
        </a>
        <a class="bottom-nav__item" href="#/search">
          <span class="bottom-nav__icon">🔍</span>
          <span>Search</span>
        </a>
        <a class="bottom-nav__item bottom-nav__item--active" href="#/profile" aria-current="page">
          <span class="bottom-nav__icon">👤</span>
          <span>Profile</span>
        </a>
      </nav>
    </section>
  `;
}

export function init() {
  const artisanBtn = document.getElementById('artisan-mode-btn');
  if (artisanBtn) {
    artisanBtn.addEventListener('click', () => {
      const artisan = getCurrentArtisan();
      if (artisan) {
        navigate('/artisan/dashboard');
      } else {
        navigate('/artisan/login');
      }
    });
  }
}

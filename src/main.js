/**
 * Main Entry — Knoticeable
 * App initialization, route registration, and CSS imports
 */

// Styles
import './styles/tokens.css';
import './styles/reset.css';
import './styles/base.css';
import './styles/components.css';
import './styles/utilities.css';

// Router
import { route, initRouter, getCurrentRoute } from './router.js';

// Register routes
route('/', async (params) => {
  const mod = await import('./pages/consumer/home.js');
  return mod;
});

route('/search', async (params) => {
  const mod = await import('./pages/consumer/search.js');
  return mod;
});

route('/product', async (params) => {
  const mod = await import('./pages/consumer/product.js');
  return mod;
});

route('/cart', async (params) => {
  const mod = await import('./pages/consumer/cart.js');
  return mod;
});

route('/checkout', async (params) => {
  const mod = await import('./pages/consumer/checkout.js');
  return mod;
});

route('/profile', async (params) => {
  const mod = await import('./pages/consumer/profile.js');
  return mod;
});

route('/shop', async (params) => {
  const mod = await import('./pages/consumer/shop.js');
  return mod;
});

route('/artisan', async (params) => {
  const mod = await import('./pages/artisan/login.js');
  return mod;
});

route('/artisan/login', async (params) => {
  const mod = await import('./pages/artisan/login.js');
  return mod;
});

route('/artisan/onboard', async (params) => {
  const mod = await import('./pages/artisan/onboard.js');
  return mod;
});

route('/artisan/dashboard', async (params) => {
  const mod = await import('./pages/artisan/dashboard.js');
  return mod;
});

route('/artisan/add-product', async (params) => {
  const mod = await import('./pages/artisan/add-product.js');
  return mod;
});

route('/artisan/products', async (params) => {
  const mod = await import('./pages/artisan/products.js');
  return mod;
});

route('/artisan/earnings', async (params) => {
  const mod = await import('./pages/artisan/earnings.js');
  return mod;
});

// Initialize the router
initRouter();

// Log app start
console.log('🧶 Knoticeable loaded');

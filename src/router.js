/**
 * SPA Router — Knoticeable
 * Hash-based routing with view transitions and page lifecycle
 */

const routes = {};
let currentPage = null;
let currentCleanup = null;
let activeParams = {};

/**
 * Register a route
 * @param {string} path - Route path (e.g., '/', '/search', '/artisan/login')
 * @param {Function} handler - Async function returning { render(), init?(), cleanup?() }
 */
export function route(path, handler) {
  routes[path] = handler;
}

/**
 * Navigate to a route
 * @param {string} path - Target path
 * @param {Object} params - Optional parameters to pass to the page
 */
export function navigate(path, params = {}) {
  // Store params for the target page
  activeParams = params;
  window.__routeParams = params;
  window.location.hash = path;
}

/**
 * Get current route params
 */
export function getParams() {
  return activeParams;
}

/**
 * Initialize the router
 */
export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

async function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  
  // Initialize activeParams from window.__routeParams (if set by navigate)
  // or default to empty object
  activeParams = window.__routeParams || {};
  
  // Try exact match first, then prefix match for parameterized routes
  let handler = routes[hash];
  let matchedPath = hash;
  
  if (!handler) {
    // Try matching parent paths (e.g., /product/123 → /product)
    const parts = hash.split('/').filter(Boolean);
    while (parts.length > 0) {
      const testPath = '/' + parts.join('/');
      if (routes[testPath]) {
        handler = routes[testPath];
        matchedPath = testPath;
        break;
      }
      // Store the popped segment as a param
      const param = parts.pop();
      activeParams.id = param;
    }
  }
  
  if (!handler) {
    handler = routes['/'] || routes['*'];
  }

  if (!handler) return;

  // Cleanup previous page
  if (currentCleanup) {
    try { currentCleanup(); } catch (e) { /* ignore */ }
    currentCleanup = null;
  }

  const app = document.getElementById('app');
  const page = await handler(activeParams || {});
  
  // Use View Transitions API if available
  const updateDOM = () => {
    app.innerHTML = page.render();
  };

  if (document.startViewTransition) {
    const transition = document.startViewTransition(updateDOM);
    transition.finished.then(() => {
      if (page.init) {
        currentCleanup = page.init() || null;
      }
    });
  } else {
    updateDOM();
    if (page.init) {
      currentCleanup = page.init() || null;
    }
  }

  // Scroll to top on navigation
  window.scrollTo(0, 0);
  
  // Clear temporary global params, but activeParams remains set for current page
  window.__routeParams = {};
  currentPage = matchedPath;
}

/**
 * Get the current route path
 */
export function getCurrentRoute() {
  return window.location.hash.slice(1) || '/';
}

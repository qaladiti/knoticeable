/**
 * Format utilities — Knoticeable
 */

/**
 * Format price in INR (paisa to rupees)
 * @param {number} paisa - Amount in paisa
 * @returns {string} Formatted price like "₹299"
 */
export function formatPrice(paisa) {
  const rupees = paisa / 100;
  return `₹${rupees.toLocaleString('en-IN')}`;
}

/**
 * Format price from rupees directly
 * @param {number} rupees 
 */
export function formatRupees(rupees) {
  return `₹${Number(rupees).toLocaleString('en-IN')}`;
}

/**
 * Format relative time
 * @param {Date|string|number} date 
 * @returns {string} Like "2 hours ago", "Yesterday", "3 days ago"
 */
export function timeAgo(date) {
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return 'Yesterday';
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return then.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

/**
 * Generate a simple unique ID
 */
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * Demo data store — Knoticeable
 * Used when Firebase is not configured (demo mode)
 */

const initialArtisans = [
  {
    uid: 'artisan-1',
    phone: '+919876543210',
    shopName: "Priya's Crochet Studio",
    upiId: 'priya@upi',
    bio: 'Handmade crochet with love from Jaipur 🧶',
    profileImageUrl: '',
    isActive: true,
    createdAt: new Date('2024-06-01'),
  },
  {
    uid: 'artisan-2',
    phone: '+919876543211',
    shopName: 'Meena Craft Corner',
    upiId: 'meena@paytm',
    bio: 'Traditional and modern crochet patterns',
    profileImageUrl: '',
    isActive: true,
    createdAt: new Date('2024-07-15'),
  },
  {
    uid: 'artisan-3',
    phone: '+919876543212',
    shopName: "Ritu's Yarn Art",
    upiId: 'ritu@gpay',
    bio: 'Custom amigurumi and home decor 🏠',
    profileImageUrl: '',
    isActive: true,
    createdAt: new Date('2024-08-20'),
  },
  {
    uid: 'artisan-4',
    phone: '+919876543213',
    shopName: 'Anu Crochet Creations',
    upiId: 'anu@phonepe',
    bio: 'Colorful crochet bags and accessories 👜',
    profileImageUrl: '',
    isActive: true,
    createdAt: new Date('2024-09-10'),
  },
];

const initialProducts = [
  {
    id: 'prod-1',
    artisanId: 'artisan-1',
    shopName: "Priya's Crochet Studio",
    title: 'Sunflower Amigurumi Bouquet',
    description: 'Beautiful handmade crochet sunflower bouquet. Each flower is carefully crafted with premium yarn. Perfect as a gift that lasts forever! 🌻',
    price: 29900,
    images: [],
    category: 'Flowers',
    tags: ['sunflower', 'bouquet', 'amigurumi', 'gift', 'flower'],
    isAvailable: true,
    viewCount: 234,
    orderCount: 45,
    createdAt: new Date('2024-10-01'),
    color: '#F4C430',
    emoji: '🌻',
  },
  {
    id: 'prod-2',
    artisanId: 'artisan-2',
    shopName: 'Meena Craft Corner',
    title: 'Cute Teddy Bear Amigurumi',
    description: 'Adorable stuffed teddy bear, hand crocheted with soft cotton yarn. Safe for babies and children. Size: 8 inches.',
    price: 49900,
    images: [],
    category: 'Amigurumi',
    tags: ['teddy', 'bear', 'amigurumi', 'baby', 'toy', 'stuffed'],
    isAvailable: true,
    viewCount: 189,
    orderCount: 32,
    createdAt: new Date('2024-10-05'),
    color: '#C4A882',
    emoji: '🧸',
  },
  {
    id: 'prod-3',
    artisanId: 'artisan-3',
    shopName: "Ritu's Yarn Art",
    title: 'Boho Crochet Tote Bag',
    description: 'Stylish boho-inspired crochet tote bag. Spacious interior, sturdy handles. Perfect for beach days or grocery shopping! 🏖️',
    price: 79900,
    images: [],
    category: 'Bags',
    tags: ['bag', 'tote', 'boho', 'beach', 'handbag'],
    isAvailable: true,
    viewCount: 156,
    orderCount: 28,
    createdAt: new Date('2024-10-10'),
    color: '#DEB887',
    emoji: '👜',
  },
  {
    id: 'prod-4',
    artisanId: 'artisan-1',
    shopName: "Priya's Crochet Studio",
    title: 'Rainbow Baby Blanket',
    description: 'Soft rainbow-colored baby blanket, made with hypoallergenic cotton yarn. Machine washable. Size: 30×40 inches.',
    price: 129900,
    images: [],
    category: 'Home Decor',
    tags: ['blanket', 'baby', 'rainbow', 'nursery', 'home'],
    isAvailable: true,
    viewCount: 312,
    orderCount: 67,
    createdAt: new Date('2024-10-15'),
    color: '#FF6B6B',
    emoji: '🌈',
  },
  {
    id: 'prod-5',
    artisanId: 'artisan-4',
    shopName: 'Anu Crochet Creations',
    title: 'Crochet Scrunchie Set (5 pcs)',
    description: 'Pack of 5 colorful crochet scrunchies. Gentle on hair, stylish design. Available in pastel and vibrant color sets.',
    price: 19900,
    images: [],
    category: 'Accessories',
    tags: ['scrunchie', 'hair', 'accessory', 'set', 'colorful'],
    isAvailable: true,
    viewCount: 445,
    orderCount: 128,
    createdAt: new Date('2024-10-20'),
    color: '#E6B0AA',
    emoji: '🎀',
  },
  {
    id: 'prod-6',
    artisanId: 'artisan-2',
    shopName: 'Meena Craft Corner',
    title: 'Crochet Table Runner – Mandala',
    description: 'Elegant mandala pattern crochet table runner. Adds a handmade touch to your dining table. Length: 48 inches.',
    price: 89900,
    images: [],
    category: 'Home Decor',
    tags: ['table', 'runner', 'mandala', 'home', 'decor', 'dining'],
    isAvailable: true,
    viewCount: 98,
    orderCount: 15,
    createdAt: new Date('2024-11-01'),
    color: '#F5F5DC',
    emoji: '🏠',
  },
  {
    id: 'prod-7',
    artisanId: 'artisan-3',
    shopName: "Ritu's Yarn Art",
    title: 'Sunflower Wall Hanging',
    description: 'Beautiful crochet sunflower wall hanging with wooden dowel. Perfect for living room or nursery decor. 🌻',
    price: 59900,
    images: [],
    category: 'Home Decor',
    tags: ['sunflower', 'wall', 'hanging', 'decor', 'nursery'],
    isAvailable: true,
    viewCount: 178,
    orderCount: 34,
    createdAt: new Date('2024-11-05'),
    color: '#F4C430',
    emoji: '🌻',
  },
  {
    id: 'prod-8',
    artisanId: 'artisan-4',
    shopName: 'Anu Crochet Creations',
    title: 'Crochet Earrings – Boho Drops',
    description: 'Lightweight crochet earrings with boho design. Hypoallergenic hooks. Perfect for casual and festive wear!',
    price: 14900,
    images: [],
    category: 'Accessories',
    tags: ['earrings', 'jewelry', 'boho', 'accessory', 'festive'],
    isAvailable: true,
    viewCount: 267,
    orderCount: 89,
    createdAt: new Date('2024-11-10'),
    color: '#9B59B6',
    emoji: '✨',
  },
  {
    id: 'prod-9',
    artisanId: 'artisan-1',
    shopName: "Priya's Crochet Studio",
    title: 'Lavender Tulip Bunch',
    description: 'Delicate crochet tulips in shades of lavender and pink. Everlasting blooms for your home. Set of 5 stems.',
    price: 34900,
    images: [],
    category: 'Flowers',
    tags: ['tulip', 'flower', 'lavender', 'bouquet', 'pink'],
    isAvailable: true,
    viewCount: 145,
    orderCount: 23,
    createdAt: new Date('2024-11-15'),
    color: '#C39BD3',
    emoji: '🌷',
  },
  {
    id: 'prod-10',
    artisanId: 'artisan-2',
    shopName: 'Meena Craft Corner',
    title: 'Penguin Amigurumi Keychain',
    description: 'Adorable mini penguin keychain, handmade with crochet. Great as a bag charm or gift! Size: 3 inches.',
    price: 9900,
    images: [],
    category: 'Amigurumi',
    tags: ['penguin', 'keychain', 'amigurumi', 'mini', 'charm', 'gift'],
    isAvailable: true,
    viewCount: 567,
    orderCount: 203,
    createdAt: new Date('2024-11-20'),
    color: '#2C3E50',
    emoji: '🐧',
  },
  {
    id: 'prod-11',
    artisanId: 'artisan-3',
    shopName: "Ritu's Yarn Art",
    title: 'Cozy Winter Beanie Hat',
    description: 'Warm and cozy crochet beanie hat in chunky yarn. One size fits most adults. Available in multiple colors.',
    price: 44900,
    images: [],
    category: 'Accessories',
    tags: ['beanie', 'hat', 'winter', 'warm', 'cozy'],
    isAvailable: true,
    viewCount: 201,
    orderCount: 56,
    createdAt: new Date('2024-12-01'),
    color: '#E74C3C',
    emoji: '🧢',
  },
  {
    id: 'prod-12',
    artisanId: 'artisan-4',
    shopName: 'Anu Crochet Creations',
    title: 'Succulent Plant Set (3 pcs)',
    description: 'Realistic crochet succulent plants in tiny terracotta pots. Never needs watering! Perfect desk decor. 🪴',
    price: 39900,
    images: [],
    category: 'Home Decor',
    tags: ['succulent', 'plant', 'desk', 'decor', 'pot'],
    isAvailable: true,
    viewCount: 334,
    orderCount: 78,
    createdAt: new Date('2024-12-05'),
    color: '#27AE60',
    emoji: '🪴',
  },
];

export const demoArtisans = (() => {
  const stored = localStorage.getItem('crochet_artisans');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map(a => ({ ...a, createdAt: new Date(a.createdAt) }));
    } catch (e) {
      console.error('Failed to parse stored artisans', e);
    }
  }
  return initialArtisans;
})();

export const demoProducts = (() => {
  const stored = localStorage.getItem('crochet_products');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map(p => ({ ...p, createdAt: new Date(p.createdAt) }));
    } catch (e) {
      console.error('Failed to parse stored products', e);
    }
  }
  return initialProducts;
})();

export const demoCategories = [
  { id: 'flowers', name: 'Flowers', icon: '🌸', productCount: 12 },
  { id: 'amigurumi', name: 'Amigurumi', icon: '🧸', productCount: 24 },
  { id: 'bags', name: 'Bags', icon: '👜', productCount: 8 },
  { id: 'home-decor', name: 'Home Decor', icon: '🏠', productCount: 18 },
  { id: 'accessories', name: 'Accessories', icon: '✨', productCount: 15 },
  { id: 'clothing', name: 'Clothing', icon: '👗', productCount: 6 },
  { id: 'baby', name: 'Baby', icon: '👶', productCount: 10 },
];

export const demoOrders = [
  {
    id: 'order-1',
    consumerId: 'consumer-1',
    artisanId: 'artisan-1',
    productId: 'prod-1',
    productTitle: 'Sunflower Amigurumi Bouquet',
    quantity: 1,
    totalAmount: 29900,
    platformFee: 2990,
    artisanEarning: 26910,
    status: 'delivered',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'order-2',
    consumerId: 'consumer-2',
    artisanId: 'artisan-1',
    productId: 'prod-4',
    productTitle: 'Rainbow Baby Blanket',
    quantity: 1,
    totalAmount: 129900,
    platformFee: 12990,
    artisanEarning: 116910,
    status: 'shipped',
    createdAt: new Date('2024-12-10'),
  },
  {
    id: 'order-3',
    consumerId: 'consumer-3',
    artisanId: 'artisan-1',
    productId: 'prod-9',
    productTitle: 'Lavender Tulip Bunch',
    quantity: 2,
    totalAmount: 69800,
    platformFee: 6980,
    artisanEarning: 62820,
    status: 'confirmed',
    createdAt: new Date('2024-12-15'),
  },
];

// Simple cart store
let cart = [];

export function getCart() {
  return cart;
}

export function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  return cart;
}

export function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  return cart;
}

export function updateCartQuantity(productId, quantity) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = Math.max(0, quantity);
    if (item.quantity === 0) {
      return removeFromCart(productId);
    }
  }
  return cart;
}

export function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function getCartCount() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

export function clearCart() {
  cart = [];
  return cart;
}

// Artisan session (demo)
let currentArtisan = null;

export function setCurrentArtisan(artisan) {
  currentArtisan = artisan;
  localStorage.setItem('crochet_artisan', JSON.stringify(artisan));
}

export function getCurrentArtisan() {
  if (currentArtisan) return currentArtisan;
  const stored = localStorage.getItem('crochet_artisan');
  if (stored) {
    currentArtisan = JSON.parse(stored);
    return currentArtisan;
  }
  return null;
}

export function logoutArtisan() {
  currentArtisan = null;
  localStorage.removeItem('crochet_artisan');
}

/**
 * Simple search over demo products
 */
export function searchProducts(query) {
  if (!query || query.trim().length === 0) return demoProducts;
  
  const terms = query.toLowerCase().split(/\s+/);
  
  return demoProducts.filter(product => {
    const searchText = [
      product.title,
      product.description,
      product.category,
      product.shopName,
      ...product.tags
    ].join(' ').toLowerCase();
    
    return terms.every(term => searchText.includes(term));
  }).sort((a, b) => {
    // Prioritize title matches
    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();
    const aMatch = terms.some(t => aTitle.includes(t));
    const bMatch = terms.some(t => bTitle.includes(t));
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return b.orderCount - a.orderCount;
  });
}

/**
 * Add a new product to the local demo database
 */
export function addProduct(product) {
  demoProducts.unshift(product);
  localStorage.setItem('crochet_products', JSON.stringify(demoProducts));
  return demoProducts;
}

/**
 * Get all products listed by a specific artisan
 */
export function getProductsByArtisan(artisanId) {
  return demoProducts.filter(p => p.artisanId === artisanId);
}

/**
 * Get an artisan by their UID
 */
export function getArtisanById(artisanId) {
  return demoArtisans.find(a => a.uid === artisanId) || null;
}

/**
 * Update an artisan's profile details (e.g. bio, name)
 */
export function updateArtisan(artisanId, updatedData) {
  const index = demoArtisans.findIndex(a => a.uid === artisanId);
  if (index !== -1) {
    demoArtisans[index] = { ...demoArtisans[index], ...updatedData };
    localStorage.setItem('crochet_artisans', JSON.stringify(demoArtisans));
    // If updating the current artisan session, update localStorage
    const current = getCurrentArtisan();
    if (current && current.uid === artisanId) {
      setCurrentArtisan(demoArtisans[index]);
    }
    return demoArtisans[index];
  }
  return null;
}

/**
 * Update product availability toggle
 */
export function updateProductAvailability(productId, isAvailable) {
  const index = demoProducts.findIndex(p => p.id === productId);
  if (index !== -1) {
    demoProducts[index].isAvailable = isAvailable;
    localStorage.setItem('crochet_products', JSON.stringify(demoProducts));
    return demoProducts[index];
  }
  return null;
}


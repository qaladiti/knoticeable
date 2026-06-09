/**
 * Add Product — Knoticeable
 * 1-click product uploader for artisans with intermediate preview state
 */

import { navigate } from '../../router.js';
import { showToast } from '../../components/toast.js';
import { demoCategories, addProduct, getCurrentArtisan } from '../../utils/demo-data.js';
import { renderNavbar } from '../../components/navbar.js';

let selectedCategory = '';
let imagePreviewUrl = '';
let currentView = 'form'; // 'form' | 'preview' | 'success'

let tempProduct = {
  name: '',
  price: '',
  description: '',
  category: ''
};

function getRandomColor() {
  const colors = ['#F4C430', '#C4A882', '#DEB887', '#FF6B6B', '#E6B0AA', '#F5F5DC', '#9B59B6', '#C39BD3', '#2C3E50', '#E74C3C', '#27AE60'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function render() {
  if (currentView === 'success') {
    return renderSuccess();
  } else if (currentView === 'preview') {
    return renderPreview();
  }
  return renderForm();
}

function renderForm() {
  return `
    ${renderNavbar('dashboard')}

    <!-- Fixed Header -->
    <header class="header mobile-header">
      <a class="header__action" id="back-btn" href="#/artisan/dashboard" aria-label="Go back" role="button">
        ←
      </a>
      <div class="header__title">Add Product</div>
    </header>

    <section class="page page--no-nav">
      <div class="add-product-form-container">
        <!-- Upload Zone -->
        <div class="upload-zone ${imagePreviewUrl ? 'upload-zone--filled' : ''}" id="upload-zone" role="button" tabindex="0" aria-label="Tap to add photo">
          ${imagePreviewUrl ? `
            <img class="upload-zone__preview" src="${imagePreviewUrl}" alt="Product preview" />
            <button class="upload-zone__remove" id="remove-image-btn" aria-label="Remove image" type="button">✕</button>
          ` : `
            <span class="upload-zone__icon">📷</span>
            <span class="upload-zone__text">Tap to add photo</span>
          `}
        </div>
        <input 
          type="file" 
          id="file-input" 
          accept="image/*" 
          capture="environment" 
          style="display:none;" 
          aria-hidden="true"
        />

        <!-- Product Name -->
        <div class="input-group">
          <input 
            type="text"
            id="product-name"
            class="input"
            placeholder="What did you make?"
            maxlength="100"
            value="${tempProduct.name}"
            aria-label="Product name"
            style="min-height:52px;box-sizing:border-box;"
          />
        </div>

        <!-- Price -->
        <div class="input-group">
          <div class="input-with-prefix" style="min-height:52px;">
            <span class="input-prefix" style="min-height:52px;">₹</span>
            <input 
              type="tel"
              inputmode="numeric"
              id="product-price"
              class="input"
              placeholder="Price"
              maxlength="6"
              value="${tempProduct.price}"
              aria-label="Product price in rupees"
              style="min-height:52px;border:none;box-sizing:border-box;"
            />
          </div>
        </div>

        <!-- Description -->
        <div class="input-group">
          <textarea 
            id="product-description"
            class="input"
            placeholder="Describe your creation... (e.g. size, material, care instructions)"
            maxlength="500"
            rows="3"
            aria-label="Product description"
            style="min-height:80px;box-sizing:border-box;resize:none;padding:var(--space-3);"
          >${tempProduct.description}</textarea>
        </div>

        <!-- Category chips -->
        <div style="margin-bottom:var(--space-6);">
          <label class="input-label" style="margin-bottom:var(--space-3);">Category</label>
          <div id="category-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-2);">
            ${demoCategories.map(cat => `
              <div 
                class="chip ${selectedCategory === cat.id ? 'chip--active' : ''}" 
                data-category="${cat.id}"
                role="radio"
                tabindex="0"
                aria-checked="${selectedCategory === cat.id}"
                aria-label="${cat.name}"
              >
                <span class="chip__icon">${cat.icon}</span>
                <span>${cat.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- List button -->
        <button id="list-btn" class="btn btn-primary" style="text-transform:uppercase;font-size:var(--text-base);letter-spacing:0.5px;">
          👁️ PREVIEW PRODUCT
        </button>
      </div>

    </section>
  `;
}

function renderPreview() {
  const categoryObj = demoCategories.find(c => c.id === selectedCategory);
  const categoryName = categoryObj ? categoryObj.name : 'Handmade';
  const categoryIcon = categoryObj ? categoryObj.icon : '🧶';
  
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(parseFloat(tempProduct.price));

  return `
    ${renderNavbar('dashboard')}

    <!-- Fixed Header -->
    <header class="header mobile-header">
      <button class="header__action" id="preview-back-btn" aria-label="Go back" style="background:none;border:none;cursor:pointer;font-size:1.3rem;">
        ←
      </button>
      <div class="header__title">Product Preview</div>
    </header>

    <section class="page page--no-nav" style="padding-bottom: var(--space-8);">
      
      <!-- Warning Info Banner -->
      <div style="
        background: var(--color-primary-light);
        color: var(--color-primary);
        padding: var(--space-3) var(--space-4);
        border-radius: var(--radius-md);
        font-size: var(--text-sm);
        font-weight: var(--font-semibold);
        margin-bottom: var(--space-5);
        text-align: center;
        border: 1px solid var(--color-primary);
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      ">
        👁️ This is a preview of how buyers will see your product!
      </div>

      <!-- Instagram/Consumer Style Preview Card (Using detail page classes for split view) -->
      <div class="product-detail-container" style="background: var(--color-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-card); padding: var(--space-4) !important;">
        <!-- Product Image Area -->
        <div class="product-detail-image-wrapper" style="
          width: 100%;
          aspect-ratio: 4/5;
          background: ${imagePreviewUrl ? `url(${imagePreviewUrl}) center/cover no-repeat` : `linear-gradient(135deg, ${getRandomColor()}20, ${getRandomColor()}40)`};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8rem;
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
        ">
          ${imagePreviewUrl ? '' : categoryIcon}
        </div>

        <!-- Product Details -->
        <div class="product-detail-info-wrapper" style="padding: var(--space-2) var(--space-4);">
          <h2 style="font-size: var(--text-xl); font-weight: var(--font-bold); color: var(--color-on-surface); margin-top: 0; margin-bottom: var(--space-2); line-height: 1.3;">
            ${tempProduct.name}
          </h2>
          <div style="font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--color-primary); margin-bottom: var(--space-4);">
            ${formattedPrice}
          </div>
          
          <div style="margin-bottom: var(--space-4);">
            <span class="badge badge--info" style="font-size: var(--text-sm); padding: var(--space-2) var(--space-4);">
              ${categoryIcon} ${categoryName}
            </span>
          </div>

          <div style="border-top: 1px solid var(--color-border); padding-top: var(--space-4); margin-bottom: var(--space-6);">
            <h4 style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--color-on-surface-medium); text-transform: uppercase; margin-top: 0; margin-bottom: var(--space-2); letter-spacing: 0.5px;">Description</h4>
            <p style="font-size: var(--text-base); color: var(--color-on-surface-medium); line-height: 1.6; margin: 0; white-space: pre-wrap;">${tempProduct.description || 'No description provided.'}</p>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            <button id="publish-btn" class="btn btn-primary" style="text-transform:uppercase;font-size:var(--text-base);letter-spacing:0.5px;min-height:56px;">
              🚀 PUBLISH PRODUCT
            </button>
            <button id="edit-btn" class="btn btn-secondary" style="min-height:52px;">
              ✏️ Edit Details
            </button>
          </div>
        </div>
      </div>

    </section>
  `;
}

function renderSuccess() {
  const artisan = getCurrentArtisan() || { uid: 'artisan-1' };
  
  return `
    ${renderNavbar('dashboard')}

    <!-- Fixed Header -->
    <header class="header mobile-header">
      <div class="header__title" style="justify-content:center;">
        <span>🧶</span>
        <span>Knoticeable</span>
      </div>
    </header>

    <section class="page page--no-nav" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:var(--space-6);">
      <div class="add-product-form-container" style="width:100%;max-width:360px;text-align:center;">
        
        <!-- Success emoji -->
        <div style="font-size:5rem;margin-bottom:var(--space-6);line-height:1;">🎉</div>
        
        <!-- Chat bubble success message -->
        <div style="
          background:var(--color-success-light);
          border-radius:var(--radius-bubble);
          border-top-left-radius:var(--space-1);
          padding:var(--space-5) var(--space-6);
          margin-bottom:var(--space-8);
          font-size:var(--text-base);
          color:var(--color-success);
          line-height:var(--leading-normal);
          text-align:left;
          font-weight:var(--font-medium);
        ">
          Your product is now live in search results! 🎉
        </div>
        
        <!-- Action buttons -->
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          <button id="view-shop-btn" class="btn btn-primary" data-artisan-id="${artisan.uid}">
            🏪 View in Your Shop
          </button>
          <button id="add-another-btn" class="btn btn-secondary" style="background: white; color: var(--color-primary);">
            📸 Add Another Product
          </button>
          <button id="go-dashboard-btn" class="btn btn-ghost">
            🏠 Go to Dashboard
          </button>
        </div>
      </div>
    </section>
  `;
}

export function init() {
  if (currentView === 'success') {
    initSuccess();
  } else if (currentView === 'preview') {
    initPreview();
  } else {
    initForm();
  }
}

function initForm() {
  const uploadZone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');
  const removeBtn = document.getElementById('remove-image-btn');
  const listBtn = document.getElementById('list-btn');
  const priceInput = document.getElementById('product-price');
  const categoryChips = document.querySelectorAll('#category-grid .chip');

  // Set values from temp state if pre-populated
  const nameInput = document.getElementById('product-name');
  const descInput = document.getElementById('product-description');
  if (nameInput) nameInput.value = tempProduct.name;
  if (descInput) descInput.value = tempProduct.description;
  if (priceInput) priceInput.value = tempProduct.price;

  // Upload zone click
  if (uploadZone && fileInput) {
    uploadZone.addEventListener('click', (e) => {
      if (e.target.id === 'remove-image-btn' || e.target.closest('#remove-image-btn')) return;
      fileInput.click();
    });

    uploadZone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
      }
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          imagePreviewUrl = ev.target.result;
          reRenderPage();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Remove image
  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      imagePreviewUrl = '';
      if (fileInput) fileInput.value = '';
      reRenderPage();
    });
  }

  // Price input filter
  if (priceInput) {
    priceInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
      tempProduct.price = e.target.value;
    });
  }

  // Name input listener to keep state
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      tempProduct.name = e.target.value;
    });
  }

  // Description input listener to keep state
  if (descInput) {
    descInput.addEventListener('input', (e) => {
      tempProduct.description = e.target.value;
    });
  }

  // Category chips
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      selectedCategory = chip.dataset.category;
      categoryChips.forEach(c => {
        c.classList.remove('chip--active');
        c.setAttribute('aria-checked', 'false');
      });
      chip.classList.add('chip--active');
      chip.setAttribute('aria-checked', 'true');
    });

    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        chip.click();
      }
    });
  });

  // Preview List button
  if (listBtn) {
    listBtn.addEventListener('click', () => {
      const name = nameInput?.value?.trim();
      const price = priceInput?.value?.trim();
      const desc = descInput?.value?.trim();

      if (!name) {
        showToast('Please enter a product name', 'error');
        nameInput?.focus();
        return;
      }

      if (!price || parseInt(price) <= 0) {
        showToast('Please enter a valid price', 'error');
        priceInput?.focus();
        return;
      }

      if (!selectedCategory) {
        showToast('Please select a category', 'error');
        return;
      }

      // Save form data to temp product state
      tempProduct = {
        name,
        price,
        description: desc || '',
        category: selectedCategory
      };

      currentView = 'preview';
      reRenderPage();
    });
  }
}

function initPreview() {
  const publishBtn = document.getElementById('publish-btn');
  const editBtn = document.getElementById('edit-btn');
  const backBtn = document.getElementById('preview-back-btn');

  const goBackToForm = () => {
    currentView = 'form';
    reRenderPage();
  };

  if (editBtn) editBtn.addEventListener('click', goBackToForm);
  if (backBtn) backBtn.addEventListener('click', goBackToForm);

  if (publishBtn) {
    publishBtn.addEventListener('click', () => {
      const artisan = getCurrentArtisan() || { uid: 'artisan-1', shopName: "Priya's Crochet Studio" };
      const categoryObj = demoCategories.find(c => c.id === selectedCategory);

      // Create new product object
      const newProduct = {
        id: 'prod-new-' + Date.now(),
        artisanId: artisan.uid,
        shopName: artisan.shopName,
        title: tempProduct.name,
        description: tempProduct.description,
        price: parseFloat(tempProduct.price) * 100, // store in paisa
        images: imagePreviewUrl ? [imagePreviewUrl] : [],
        category: categoryObj ? categoryObj.name : 'Crochet',
        tags: [tempProduct.name.toLowerCase(), selectedCategory],
        isAvailable: true,
        viewCount: 0,
        orderCount: 0,
        createdAt: new Date(),
        color: getRandomColor(),
        emoji: categoryObj ? categoryObj.icon : '🧶'
      };

      // Add product to data store
      addProduct(newProduct);

      showToast('Product published successfully!', 'success');
      currentView = 'success';
      reRenderPage();
    });
  }
}

function initSuccess() {
  const viewShopBtn = document.getElementById('view-shop-btn');
  const addAnotherBtn = document.getElementById('add-another-btn');
  const goDashboardBtn = document.getElementById('go-dashboard-btn');

  if (viewShopBtn) {
    viewShopBtn.addEventListener('click', () => {
      const artisanId = viewShopBtn.dataset.artisanId;
      resetState();
      navigate('/shop', { id: artisanId });
    });
  }

  if (addAnotherBtn) {
    addAnotherBtn.addEventListener('click', () => {
      resetState();
      reRenderPage();
    });
  }

  if (goDashboardBtn) {
    goDashboardBtn.addEventListener('click', () => {
      resetState();
      navigate('/artisan/dashboard');
    });
  }
}

function resetState() {
  selectedCategory = '';
  imagePreviewUrl = '';
  currentView = 'form';
  tempProduct = {
    name: '',
    price: '',
    description: '',
    category: ''
  };
}

function reRenderPage() {
  const app = document.getElementById('app');
  app.innerHTML = render();
  init();
}

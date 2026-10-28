// Global Products Database
const products = [
  { id: 1, title: "Aura Embroidered Silk Evening Gown", category: "gowns", price: 1850, img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80" },
  { id: 2, title: "Celestial Tulle Gala Gown", category: "couture", price: 2400, img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "Velora Ivory Silk Tailored Suit", category: "rtw", price: 950, img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80" },
  { id: 4, title: "Rose Quartz Draped Midi Dress", category: "rtw", price: 680, img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80" }
];

// Persistent State with LocalStorage
let cart = JSON.parse(localStorage.getItem('velora_cart')) || [];
let activeCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  
  if (document.getElementById('home-featured-grid')) {
    renderHomeProducts();
  }
  
  if (document.getElementById('collections-grid')) {
    renderCollectionsProducts();
  }
});

// Render Home Page Highlights
function renderHomeProducts() {
  const container = document.getElementById('home-featured-grid');
  if(!container) return;
  container.innerHTML = products.slice(0, 4).map(product => createProductCard(product)).join('');
}

// Render Catalog Page
function renderCollectionsProducts() {
  const container = document.getElementById('collections-grid');
  if(!container) return;
  
  const filtered = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  container.innerHTML = filtered.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
  return `
    <div class="product-card">
      <div class="product-thumb">
        <img src="${product.img}" alt="${product.title}">
        <div class="product-actions">
          <button class="btn btn-primary" onclick="addToCart(${product.id})">Add To Bag</button>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <span class="product-price">$${product.price.toLocaleString()}</span>
      </div>
    </div>
  `;
}

// Category Filter Function
function setCategoryFilter(category, btnElement) {
  activeCategory = category;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if(btnElement) btnElement.classList.add('active');
  renderCollectionsProducts();
}

// Shopping Bag Drawer Functions
function toggleCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (!drawer || !overlay) return;

  if (drawer.classList.contains('open')) {
    drawer.classList.remove('open');
    overlay.style.display = 'none';
  } else {
    drawer.classList.add('open');
    overlay.style.display = 'block';
  }
}

function addToCart(productId) {
  const item = products.find(p => p.id === productId);
  if (!item) return;

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  saveCart();
  updateCartUI();
  toggleCartDrawer();
}

function removeFromCart(productId) {
  cart = cart.filter(c => c.id !== productId);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('velora_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const badge = document.getElementById('cart-badge');
  const cartBody = document.getElementById('cart-body');
  const subtotalEl = document.getElementById('cart-subtotal-val');

  if (!badge || !cartBody || !subtotalEl) return;

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  badge.innerText = totalQty;
  subtotalEl.innerText = `$${subtotal.toLocaleString()}`;

  if (cart.length === 0) {
    cartBody.innerHTML = `<p style="text-align:center; color:#888; margin-top:40px;">Your shopping bag is currently empty.</p>`;
  } else {
    cartBody.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.title}">
        <div style="flex:1;">
          <h4 style="font-size:0.95rem;">${item.title}</h4>
          <p style="color:var(--accent); font-size:0.85rem;">$${item.price} x ${item.qty}</p>
          <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:red; font-size:0.75rem; cursor:pointer; margin-top:4px;">Remove</button>
        </div>
      </div>
    `).join('');
  }
}

function checkout() {
  if (cart.length === 0) {
    alert("Your shopping bag is empty.");
    return;
  }
  alert("Thank you for choosing Velora Fashion. Your private checkout session is being prepared.");
  cart = [];
  saveCart();
  updateCartUI();
  toggleCartDrawer();
}

// Form Handler
function handleFormSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('fullName').value;
  alert(`Thank you, ${name}. Your bespoke consultation request has been received. Our atelier concierge will contact you shortly.`);
  event.target.reset();
}

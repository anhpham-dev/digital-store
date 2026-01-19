import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import firebaseConfig from './config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Cart Logic
export class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('digitalStoreCart')) || [];
        this.listeners = [];
    }

    save() {
        localStorage.setItem('digitalStoreCart', JSON.stringify(this.items));
        this.notify();
    }

    add(product, customizations = {}) {
        const cartItem = {
            id: `${product.id}_${Date.now()}`,
            productId: product.id,
            title: product.title,
            price: product.price,
            imageUrl: product.imageUrl,
            customizations,
            quantity: 1
        };
        this.items.push(cartItem);
        this.save();
    }

    remove(cartItemId) {
        this.items = this.items.filter(item => item.id !== cartItemId);
        this.save();
    }

    updateQuantity(cartItemId, quantity) {
        if (quantity < 1) {
            this.remove(cartItemId);
            return;
        }
        this.items = this.items.map(item =>
            item.id === cartItemId ? { ...item, quantity } : item
        );
        this.save();
    }

    clear() {
        this.items = [];
        this.save();
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    getCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    subscribe(callback) {
        this.listeners.push(callback);
        // Initial call
        callback(this);
    }

    notify() {
        this.listeners.forEach(cb => cb(this));
    }
}

export const cart = new Cart();

// Shared UI Functions
export async function renderHeader() {
    const headerEl = document.querySelector('header');
    if (!headerEl) return;

    // Load shop name/settings
    let shopName = 'Digital Store';
    let themeColor = '#3b82f6';

    try {
        const docRef = doc(db, 'shop_settings', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            shopName = data.name || shopName;
            themeColor = data.themeColor || themeColor;

            // Set CSS variable
            document.documentElement.style.setProperty('--primary-color', themeColor);
            document.documentElement.style.setProperty('--primary-hover', adjustColorOpacity(themeColor, 0.9));
        }
    } catch (e) {
        console.warn("Could not load shop settings (likely missing config)", e);
    }

    headerEl.innerHTML = `
        <div class="container">
            <div class="nav-content">
                <a href="index.html" class="logo">
                    <div class="logo-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
                    </div>
                    <span>${shopName}</span>
                </a>
                <nav class="nav-links">
                    <a href="index.html" class="nav-link">Products</a>
                    <a href="cart.html" class="cart-btn" aria-label="Cart">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                        <span id="cart-count-badge" class="cart-badge hidden">0</span>
                    </a>
                </nav>
            </div>
        </div>
    `;

    // Initialize cart badge listener
    cart.subscribe(c => {
        const count = c.getCount();
        const badge = document.getElementById('cart-count-badge');
        if (badge) {
            badge.innerText = count;
            badge.classList.toggle('hidden', count === 0);
        }
    });
}

function adjustColorOpacity(hex, opacity) {
    // Simple hex to rgba conversion for theme adjustment
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
    }
    return hex;
}

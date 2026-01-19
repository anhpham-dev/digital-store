import { db, cart } from './app.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById('product-container');
const parsedUrl = new URL(window.location.href);
const productId = parsedUrl.searchParams.get('id');

let currentProduct = null;
let currentCustomizations = {};

async function init() {
    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            window.location.href = 'index.html';
            return;
        }

        currentProduct = { id: docSnap.id, ...docSnap.data() };
        renderProduct(currentProduct);
        initCustomizations(currentProduct.customizations);

    } catch (error) {
        console.error("Error loading product:", error);
        container.innerHTML = `
             <div class="card text-center" style="padding: 4rem;">
                <p style="color: var(--danger); margin-bottom: 1rem;">Failed to load product.</p>
                <a href="index.html" class="btn btn-primary">Go Home</a>
            </div>
        `;
    }
}

function initCustomizations(customizationsDef) {
    if (!customizationsDef) return;

    currentCustomizations = {};
    customizationsDef.forEach(c => {
        if (c.type === 'checkbox') {
            currentCustomizations[c.label] = false;
        } else if (c.type === 'select' && c.options?.length > 0) {
            currentCustomizations[c.label] = c.options[0];
        } else {
            currentCustomizations[c.label] = '';
        }
    });
}

function renderProduct(product) {
    const hasCustomizations = product.customizations && product.customizations.length > 0;

    // Build Customization HTML
    let customizationHtml = '';
    if (hasCustomizations) {
        const fields = product.customizations.map((c) => {
            let inputHtml = '';

            if (c.type === 'text') {
                inputHtml = `<input type="text" class="custom-input" data-label="${c.label}" placeholder="Enter ${c.label}..." onchange="handleInputChange(this)">`;
            } else if (c.type === 'select') {
                const options = c.options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
                inputHtml = `<select class="custom-input" data-label="${c.label}" onchange="handleInputChange(this)">${options}</select>`;
            } else if (c.type === 'checkbox') {
                inputHtml = `
                    <label class="checkbox-label">
                        <input type="checkbox" class="checkbox-input" data-label="${c.label}" onchange="handleInputChange(this)">
                        <span class="text-gray-300">Yes, add this option</span>
                    </label>
                `;
            }

            return `
                <div class="mb-4">
                    <label class="block text-sm font-bold text-gray-300 mb-2">${c.label}</label>
                    ${inputHtml}
                </div>
            `;
        }).join('');

        customizationHtml = `
            <div class="mb-8 p-4 card" style="background-color: rgba(30, 41, 59, 0.3);">
                <div class="flex items-center space-x-2 mb-4">
                    <h2 class="text-xl font-semibold mb-4">Customize</h2>
                </div>
                ${fields}
            </div>
        `;
    }

    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem;">
            <!-- Image -->
            <div style="position: relative;">
                 <div style="aspect-ratio: 1/1; background-color: rgba(255,255,255,0.05); border-radius: 1rem; overflow: hidden; border: 1px solid var(--glass-border);">
                    ${product.imageUrl
            ? `<img src="${product.imageUrl}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;">`
            : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-muted);">
                             <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22v-10"/></svg>
                           </div>`
        }
                </div>
                <div style="position: absolute; top: 1rem; right: 1rem; background-color: var(--primary-color); padding: 0.5rem 1rem; border-radius: 0.75rem; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                    $${parseFloat(product.price).toFixed(2)}
                </div>
            </div>

            <!-- Info -->
            <div>
                <h1 class="text-3xl font-bold mb-4">${product.title}</h1>
                <p class="text-muted mb-8" style="font-size: 1.125rem; white-space: pre-wrap;">${product.description || "No description available."}</p>
                
                ${customizationHtml}

                <button id="add-to-cart-btn" class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1.125rem; margin-top: auto;">
                    Add to Cart - $${parseFloat(product.price).toFixed(2)}
                </button>
            </div>
        </div>
    `;

    document.getElementById('add-to-cart-btn').addEventListener('click', addToCart);
}

// Global scope for HTML onchange attributes
window.handleInputChange = function (input) {
    const label = input.dataset.label;
    const value = input.type === 'checkbox' ? input.checked : input.value;
    currentCustomizations[label] = value;
};

function addToCart() {
    if (!currentProduct) return;

    cart.add(currentProduct, currentCustomizations);

    const btn = document.getElementById('add-to-cart-btn');
    const originalText = btn.innerHTML;

    btn.innerHTML = `Added to Cart!`;
    btn.style.backgroundColor = 'var(--success)';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = '';
        btn.disabled = false;
    }, 2000);
}

init();

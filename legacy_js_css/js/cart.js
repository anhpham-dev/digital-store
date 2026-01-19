import { cart } from './app.js';

const itemsContainer = document.getElementById('cart-items');
const subtotalEl = document.getElementById('summary-subtotal');
const totalEl = document.getElementById('summary-total');
const checkoutBtn = document.getElementById('checkout-btn');

function renderCart(cartInstance) {
    if (cartInstance.items.length === 0) {
        itemsContainer.innerHTML = `
            <div class="card text-center" style="padding: 4rem;">
                <div style="background-color: rgba(255,255,255,0.05); width: 4rem; height: 4rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                </div>
                <h2 class="text-xl font-bold mb-2">Your Cart is Empty</h2>
                <p class="text-muted mb-6">Add some products before checking out.</p>
                <a href="index.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        // Hide summary if empty, or just disable button
        if (checkoutBtn) checkoutBtn.classList.add('hidden');
        return;
    }

    if (checkoutBtn) checkoutBtn.classList.remove('hidden');

    let html = '';
    cartInstance.items.forEach(item => {
        const itemTotal = item.price * item.quantity;

        // Format customizations
        let customHtml = '';
        if (item.customizations && Object.keys(item.customizations).length > 0) {
            customHtml = `<div class="text-sm text-muted mt-2 space-y-1">`;
            for (const [key, value] of Object.entries(item.customizations)) {
                // If boolean true, just show key. If value is string, show Key: Value
                if (value === true) {
                    customHtml += `<div>• ${key}</div>`;
                } else if (value) {
                    customHtml += `<div>• ${key}: ${value}</div>`;
                }
            }
            customHtml += `</div>`;
        }

        html += `
            <div class="card mb-4" style="display: flex; gap: 1.5rem; padding: 1rem;">
                <!-- Image -->
                <div style="width: 6rem; height: 6rem; border-radius: 0.5rem; overflow: hidden; flex-shrink: 0; background-color: rgba(255,255,255,0.05);">
                    ${item.imageUrl
                ? `<img src="${item.imageUrl}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">`
                : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg></div>`
            }
                </div>

                <!-- Content -->
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                        <h3 class="font-bold text-lg truncate" style="max-width: 80%;">${item.title}</h3>
                        <span class="font-bold">$${itemTotal.toFixed(2)}</span>
                    </div>
                    
                    ${customHtml}

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                        <div style="display: flex; align-items: center; background-color: rgba(15, 23, 42, 0.5); border-radius: 0.5rem; border: 1px solid var(--glass-border);">
                            <button class="btn-icon" onclick="updateQty('${item.id}', ${item.quantity - 1})" ${item.quantity <= 1 ? '' : ''}>-</button>
                            <span style="padding: 0 1rem; font-weight: 500;">${item.quantity}</span>
                            <button class="btn-icon" onclick="updateQty('${item.id}', ${item.quantity + 1})">+</button>
                        </div>

                        <button onclick="removeItem('${item.id}')" class="text-muted" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                             Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    itemsContainer.innerHTML = html;

    // Update Summary
    const total = cartInstance.getTotal();
    subtotalEl.innerText = `$${total.toFixed(2)}`;
    totalEl.innerText = `$${total.toFixed(2)}`;
}

// Styles for +/- buttons
const style = document.createElement('style');
style.textContent = `
    .btn-icon {
        background: none;
        border: none;
        color: white;
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        transition: color 0.2s;
    }
    .btn-icon:hover { color: var(--primary-color); }
`;
document.head.appendChild(style);

// Global Actions
window.updateQty = (id, newQty) => cart.updateQuantity(id, newQty);
window.removeItem = (id) => cart.remove(id);

// Init
cart.subscribe(renderCart);

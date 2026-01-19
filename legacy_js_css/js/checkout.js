import { db, cart } from './app.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById('checkout-form');
const summaryItems = document.getElementById('summary-items');
const checkoutTotal = document.getElementById('checkout-total');
const checkoutFinalTotal = document.getElementById('checkout-final-total');
const placeOrderBtn = document.getElementById('place-order-btn');

function init() {
    if (cart.items.length === 0) {
        window.location.href = 'index.html';
        return;
    }
    renderSummary();

    // Update button text with total
    const total = cart.getTotal();
    placeOrderBtn.innerText = `Place Order - $${total.toFixed(2)}`;
}

function renderSummary() {
    let html = '';
    cart.items.forEach(item => {
        html += `
            <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem;">
                <div style="width: 3rem; height: 3rem; background-color: rgba(255,255,255,0.05); border-radius: 0.25rem; overflow: hidden; flex-shrink: 0;">
                     ${item.imageUrl
                ? `<img src="${item.imageUrl}" style="width: 100%; height: 100%; object-fit: cover;">`
                : ''
            }
                </div>
                <div style="flex: 1; min-width: 0;">
                    <p class="font-bold text-sm truncate">${item.title}</p>
                    <p class="text-xs text-muted">Qty: ${item.quantity}</p>
                </div>
                <div class="text-sm font-bold">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `;
    });
    summaryItems.innerHTML = html;

    const total = cart.getTotal();
    checkoutTotal.innerText = `$${total.toFixed(2)}`;
    checkoutFinalTotal.innerText = `$${total.toFixed(2)}`;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (cart.items.length === 0) return;

    // Set loading state
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerText = 'Processing...';

    const formData = new FormData(form);
    const orderData = {
        customer: {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        notes: formData.get('notes'),
        items: cart.items,
        total: cart.getTotal(),
        status: 'pending',
        createdAt: serverTimestamp()
    };

    try {
        const docRef = await addDoc(collection(db, 'orders'), orderData);

        // Success
        cart.clear();
        document.getElementById('checkout-main').classList.add('hidden');
        document.getElementById('success-view').classList.remove('hidden');
        document.getElementById('success-order-id').innerText = docRef.id;

    } catch (error) {
        console.error("Error creating order:", error);
        alert("Failed to place order. Please try again.");
        placeOrderBtn.disabled = false;
        placeOrderBtn.innerText = `Place Order - $${cart.getTotal().toFixed(2)}`;
    }
});

init();

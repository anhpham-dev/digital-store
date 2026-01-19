import { db } from './app.js';
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function loadBanner() {
    try {
        const docRef = doc(db, 'shop_settings', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.bannerUrl) {
                const bannerContainer = document.getElementById('banner-container');
                const bannerImg = document.getElementById('banner-img');
                if (bannerContainer && bannerImg) {
                    bannerImg.src = data.bannerUrl;
                    bannerContainer.classList.remove('hidden');
                }
            }
        }
    } catch (e) {
        console.log("No banner settings found or permission denied.");
    }
}

async function loadProducts() {
    const grid = document.getElementById('product-list');

    try {
        const querySnapshot = await getDocs(collection(db, 'products'));

        if (querySnapshot.empty) {
            grid.innerHTML = `
                <div class="card text-center" style="grid-column: 1 / -1; padding: 4rem;">
                    <p class="text-muted">No products found.</p>
                </div>
            `;
            return;
        }

        let html = '';
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const id = doc.id;

            // Format price
            const price = parseFloat(product.price).toFixed(2);

            html += `
                <a href="product.html?id=${id}" class="card" style="text-decoration: none; color: inherit; display: flex; flex-direction: column;">
                    <div style="aspect-ratio: 16/9; background-color: rgba(255,255,255,0.05); border-radius: 0.5rem; overflow: hidden; margin-bottom: 1rem;">
                        ${product.imageUrl
                    ? `<img src="${product.imageUrl}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;">`
                    : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-muted);">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22v-10"/></svg>
                               </div>`
                }
                    </div>
                    <h3 class="font-bold text-2xl mb-2">${product.title}</h3>
                    <p class="text-muted mb-4" style="flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${product.description || ''}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                        <span class="text-2xl font-bold" style="color: var(--primary-color);">$${price}</span>
                        <div class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">View Details</div>
                    </div>
                </a>
            `;
        });

        grid.innerHTML = html;

    } catch (error) {
        console.error("Error loading products:", error);
        grid.innerHTML = `
            <div class="card text-center" style="grid-column: 1 / -1; padding: 4rem;">
                <p style="color: var(--danger); margin-bottom: 1rem;">Failed to load products.</p>
                <p class="text-muted text-sm">Please check your Firebase configuration in js/config.js</p>
            </div>
        `;
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadBanner();
    loadProducts();
});

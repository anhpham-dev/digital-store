A modern, customizable digital storefront and administration system built for high performance and visual excellence. This project has been migrated to a **pure HTML/JS implementation** to ensure seamless operation across all environments (including `file://` protocols) and to eliminate CORS-related issues.

---

## ✨ Features

### 🛍️ Customer Storefront
- **Dynamic Product Showcase**: Modern grid layout with high-quality product cards.
- **Detailed Product Views**: Full product descriptions, image galleries, and pricing.
- **Intuitive Shopping Cart**: Seamlessly add items to cart and manage quantities.
- **Streamlined Checkout**: A clean, focused checkout process for higher conversion rates.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

### 🔐 Admin Dashboard
- **Product Management**: Create, update, and delete products easily.
- **Order Tracking**: Keep track of customer orders and fulfillment status.
- **Shop Configuration**: Customize shop name, branding, and other settings.
- **Secure Authentication**: Protected admin access via Firebase Authentication.
- **Real-time Analytics**: (Planned) Overview of sales and store performance.

---

- **Core**: Vanilla HTML5, CSS3, and JavaScript (ES6+)
- **Backend / Database**: [Firebase](https://firebase.google.com/) (Firestore, Auth, Storage) via Compat SDK
- **Styling**: Modern CSS with Glassmorphism and Backdrop filters
- **Icons**: SVG-based icons (Lucide-inspired)
- **Deployment**: Zero-build dependency (Static HTML)

---

```text
digital-store/
├── index.html          # Main shop storefront
├── product.html        # Product details page
├── cart.html           # Shopping cart page
├── checkout.html       # Checkout process
├── legacy_js_css/      # Shared assets and config
│   └── js/config.js    # Centralized Firebase config (for reference)
├── FIREBASE_SETUP.md   # Setup instructions
└── .env                # Environment variables (for reference)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd digital-store
   ```

2. **Configure Firebase**
   - Follow the [Firebase Setup Guide](./FIREBASE_SETUP.md).
   - Important: Since this version uses static HTML, you must update the `firebaseConfig` object inside the `<script>` tag of **each HTML file** (`index.html`, `product.html`, etc.) or use a local injection method if preferred.

3. **Run the Application**
   - Simply open `index.html` in any modern web browser.
   - Alternatively, use a static server like **Live Server** (VS Code extension) for the best experience.

---

## 📖 Usage

### Customer Storefront
- Open `index.html` to browse products.
- Click on any product to view details (`product.html`).
- Manage your selection in `cart.html`.
- Complete orders via `checkout.html`.

### Admin Dashboard (Coming Soon)
- The unified HTML version is currently focusing on the customer experience. For admin features, please refer to the `legacy/` directory or wait for the next update.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---   

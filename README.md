# 🏪 Digital Store

A modern, customizable digital storefront and administration system built for high performance and visual excellence. This platform allows you to showcase digital products, manage orders, and customize your store's branding through a powerful admin dashboard.

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

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend / Database**: [Firebase](https://firebase.google.com/) (Firestore, Auth, Storage)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API

---

## 📁 Project Structure

```text
src/
├── components/     # Reusable UI components
├── contexts/       # Auth and Cart context providers
├── layouts/        # Page layouts (Admin, Store)
├── pages/          # Page components
│   └── store/      # Customer-facing store pages
├── assets/         # Images and global styles
└── firebase.js     # Firebase configuration and initialization
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

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Follow the detailed [Firebase Setup Guide](./FIREBASE_SETUP.md) to initialize your database and authentication.
   - Create a `.env` file in the root directory and add your Firebase credentials.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 📖 Usage

### Admin Access
To access the admin panel:
1. Navigate to `/admin/login`.
2. Enter your admin credentials (configured in Firebase).
3. Access the dashboard at `/` to manage your store.

### Customer Storefront
- Visit `/store` to view the customer-facing shop.
- Browse products, add them to your cart, and proceed to checkout.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

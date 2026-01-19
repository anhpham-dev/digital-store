import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ShoppingCart, Store } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function StoreLayout() {
    const [shopSettings, setShopSettings] = useState({
        name: 'Digital Store',
        description: '',
        bannerUrl: '',
        themeColor: '#3b82f6'
    });
    const { getCartCount } = useCart();
    const cartCount = getCartCount();

    useEffect(() => {
        async function loadSettings() {
            try {
                const docRef = doc(db, 'shop_settings', 'main');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setShopSettings(docSnap.data());
                }
            } catch (error) {
                console.error("Error loading shop settings:", error);
            }
        }
        loadSettings();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <header
                className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-gray-700/50"
                style={{ '--theme-color': shopSettings.themeColor }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/store" className="flex items-center space-x-3 group">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                                style={{ background: `linear-gradient(135deg, ${shopSettings.themeColor}, ${shopSettings.themeColor}99)` }}
                            >
                                <Store className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                {shopSettings.name}
                            </span>
                        </Link>

                        <nav className="flex items-center space-x-6">
                            <Link
                                to="/store"
                                className="text-gray-300 hover:text-white transition-colors font-medium"
                            >
                                Products
                            </Link>
                            <Link
                                to="/store/cart"
                                className="relative p-2 text-gray-300 hover:text-white transition-colors"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {cartCount > 0 && (
                                    <span
                                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center animate-pulse"
                                        style={{ backgroundColor: shopSettings.themeColor }}
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Banner */}
            {shopSettings.bannerUrl && (
                <div className="relative h-48 md:h-64 overflow-hidden">
                    <img
                        src={shopSettings.bannerUrl}
                        alt="Store Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet context={{ shopSettings }} />
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-700/50 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} {shopSettings.name}. All rights reserved.
                        </p>
                        <p className="text-gray-500 text-sm">
                            Powered by <a href="https://github.com/Nexgen-Digital-Studio" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">NexGen Digital Studio</a>
                        </p>
                        <Link
                            to="/admin/login"
                            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                        >
                            Admin Login
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

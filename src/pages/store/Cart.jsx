import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Package } from 'lucide-react';

export default function Cart() {
    const { shopSettings } = useOutletContext();
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

    const themeColor = shopSettings?.themeColor || '#3b82f6';
    const total = getCartTotal();

    if (cartItems.length === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center py-16">
                <div className="w-24 h-24 mx-auto bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Your Cart is Empty</h2>
                <p className="text-gray-400 mb-8">
                    Looks like you haven't added any items to your cart yet.
                </p>
                <Link
                    to="/store"
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-medium transition-all hover:shadow-lg"
                    style={{ backgroundColor: themeColor }}
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Continue Shopping</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 flex gap-4"
                        >
                            {/* Image */}
                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-700/50 flex-shrink-0">
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Package className="w-8 h-8 text-gray-600" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white truncate mb-1">
                                    {item.title}
                                </h3>

                                {/* Customizations */}
                                {Object.keys(item.customizations || {}).length > 0 && (
                                    <div className="text-xs text-gray-400 mb-2 space-y-0.5">
                                        {Object.entries(item.customizations).map(([key, value]) => (
                                            <div key={key}>
                                                <span className="text-gray-500">{key}:</span>{' '}
                                                <span className="text-gray-300">
                                                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || '-'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-3">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-1.5 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-600 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center text-white font-medium">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-1.5 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-600 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Price & Delete */}
                                    <div className="flex items-center space-x-4">
                                        <span className="font-semibold text-white">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 sticky top-24">
                        <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal ({cartItems.length} items)</span>
                                <span className="text-white">${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Shipping</span>
                                <span className="text-green-400">Free</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-700/50 pt-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-lg font-semibold text-white">Total</span>
                                <span
                                    className="text-2xl font-bold"
                                    style={{ color: themeColor }}
                                >
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <Link
                            to="/store/checkout"
                            className="block w-full py-4 px-6 rounded-xl text-center text-white font-semibold transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                            style={{
                                backgroundColor: themeColor,
                                boxShadow: `0 10px 40px ${themeColor}40`
                            }}
                        >
                            Proceed to Checkout
                        </Link>

                        <Link
                            to="/store"
                            className="block w-full text-center text-gray-400 hover:text-white mt-4 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

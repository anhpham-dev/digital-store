import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCart } from '../../contexts/CartContext';
import { ArrowLeft, ShoppingBag, Package, CheckCircle, User, Mail, Phone, MessageSquare } from 'lucide-react';

export default function Checkout() {
    const navigate = useNavigate();
    const { shopSettings } = useOutletContext();
    const { cartItems, getCartTotal, clearCart } = useCart();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState('');

    const themeColor = shopSettings?.themeColor || '#3b82f6';
    const total = getCartTotal();

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (cartItems.length === 0) return;

        setSubmitting(true);
        try {
            const orderData = {
                customer: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                },
                notes: formData.notes,
                items: cartItems.map(item => ({
                    productId: item.productId,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity,
                    customizations: item.customizations
                })),
                total: total,
                status: 'pending',
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, 'orders'), orderData);
            setOrderId(docRef.id);
            clearCart();
            setOrderComplete(true);
        } catch (error) {
            console.error("Error creating order:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    // Order Success View
    if (orderComplete) {
        return (
            <div className="max-w-2xl mx-auto text-center py-16">
                <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 animate-bounce" style={{ backgroundColor: `${themeColor}20` }}>
                    <CheckCircle className="w-12 h-12" style={{ color: themeColor }} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Order Placed Successfully!</h2>
                <p className="text-gray-400 mb-2">Thank you for your order.</p>
                <p className="text-gray-500 mb-8">
                    Order ID: <span className="text-white font-mono">{orderId}</span>
                </p>
                <p className="text-gray-400 mb-8">
                    We'll send a confirmation email to <span className="text-white">{formData.email}</span> shortly.
                </p>
                <button
                    onClick={() => navigate('/store')}
                    className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl text-white font-semibold transition-all hover:shadow-xl"
                    style={{ backgroundColor: themeColor }}
                >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Continue Shopping</span>
                </button>
            </div>
        );
    }

    // Empty Cart Redirect
    if (cartItems.length === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center py-16">
                <div className="w-24 h-24 mx-auto bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Your Cart is Empty</h2>
                <p className="text-gray-400 mb-8">Add some products before checking out.</p>
                <button
                    onClick={() => navigate('/store')}
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-medium transition-all hover:shadow-lg"
                    style={{ backgroundColor: themeColor }}
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Browse Products</span>
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <button
                onClick={() => navigate('/store/cart')}
                className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors group"
            >
                <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to Cart
            </button>

            <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                                <User className="w-5 h-5 mr-2" style={{ color: themeColor }} />
                                Contact Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                                <MessageSquare className="w-5 h-5 mr-2" style={{ color: themeColor }} />
                                Additional Notes
                            </h2>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                placeholder="Any special instructions or requests..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 px-6 rounded-xl text-lg font-semibold text-white transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            style={{
                                backgroundColor: themeColor,
                                boxShadow: `0 10px 40px ${themeColor}40`
                            }}
                        >
                            {submitting ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 sticky top-24">
                        <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-3">
                                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-700/50 flex-shrink-0">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <Package className="w-6 h-6 text-gray-600" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{item.title}</p>
                                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-medium text-white">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-700/50 pt-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Subtotal</span>
                                <span className="text-white">${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-4">
                                <span className="text-gray-400">Shipping</span>
                                <span className="text-green-400">Free</span>
                            </div>
                            <div className="flex justify-between pt-4 border-t border-gray-700/50">
                                <span className="text-lg font-semibold text-white">Total</span>
                                <span className="text-2xl font-bold" style={{ color: themeColor }}>
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

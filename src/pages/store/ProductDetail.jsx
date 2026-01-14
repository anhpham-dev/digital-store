import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, ShoppingCart, Package, Check, Sparkles } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { shopSettings } = useOutletContext();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [customizations, setCustomizations] = useState({});
    const [added, setAdded] = useState(false);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const docRef = doc(db, 'products', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = { id: docSnap.id, ...docSnap.data() };
                    setProduct(data);

                    // Initialize customizations with default values
                    const defaults = {};
                    data.customizations?.forEach(c => {
                        if (c.type === 'checkbox') {
                            defaults[c.label] = false;
                        } else if (c.type === 'select' && c.options?.length > 0) {
                            defaults[c.label] = c.options[0];
                        } else {
                            defaults[c.label] = '';
                        }
                    });
                    setCustomizations(defaults);
                } else {
                    navigate('/store');
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id, navigate]);

    function handleCustomizationChange(label, value) {
        setCustomizations(prev => ({ ...prev, [label]: value }));
    }

    function handleAddToCart() {
        if (!product) return;
        addToCart(product, customizations);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400">Loading product...</p>
            </div>
        );
    }

    if (!product) return null;

    const themeColor = shopSettings?.themeColor || '#3b82f6';

    return (
        <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate('/store')}
                className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors group"
            >
                <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to Store
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Image */}
                <div className="relative">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gray-800/50 border border-gray-700/50">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <Package className="w-24 h-24 text-gray-600" />
                            </div>
                        )}
                    </div>

                    {/* Price Badge */}
                    <div
                        className="absolute top-4 right-4 px-4 py-2 rounded-xl text-xl font-bold text-white shadow-xl"
                        style={{ backgroundColor: themeColor }}
                    >
                        ${product.price?.toFixed(2)}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {product.title}
                    </h1>

                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        {product.description || "No description available"}
                    </p>

                    {/* Customizations */}
                    {product.customizations?.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center space-x-2 mb-4">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                                <h2 className="text-xl font-semibold text-white">Customize Your Order</h2>
                            </div>

                            <div className="space-y-4">
                                {product.customizations.map((c) => (
                                    <div key={c.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            {c.label}
                                        </label>

                                        {c.type === 'text' && (
                                            <input
                                                type="text"
                                                className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                placeholder={`Enter ${c.label.toLowerCase()}...`}
                                                value={customizations[c.label] || ''}
                                                onChange={(e) => handleCustomizationChange(c.label, e.target.value)}
                                            />
                                        )}

                                        {c.type === 'select' && (
                                            <select
                                                className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                value={customizations[c.label] || ''}
                                                onChange={(e) => handleCustomizationChange(c.label, e.target.value)}
                                            >
                                                {c.options?.map((opt) => (
                                                    <option key={opt} value={opt} className="bg-gray-800">
                                                        {opt}
                                                    </option>
                                                ))}
                                            </select>
                                        )}

                                        {c.type === 'checkbox' && (
                                            <label className="flex items-center space-x-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 rounded border-gray-600 bg-gray-900/50 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                                                    checked={customizations[c.label] || false}
                                                    onChange={(e) => handleCustomizationChange(c.label, e.target.checked)}
                                                />
                                                <span className="text-gray-300">Yes, add this option</span>
                                            </label>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add to Cart Button */}
                    <div className="mt-auto">
                        <button
                            onClick={handleAddToCart}
                            disabled={added}
                            className={`w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl ${added
                                ? 'bg-green-500 text-white'
                                : 'text-white hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                            style={{
                                backgroundColor: added ? undefined : themeColor,
                                boxShadow: added ? undefined : `0 10px 40px ${themeColor}40`
                            }}
                        >
                            {added ? (
                                <>
                                    <Check className="w-6 h-6" />
                                    <span>Added to Cart!</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-6 h-6" />
                                    <span>Add to Cart - ${product.price?.toFixed(2)}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

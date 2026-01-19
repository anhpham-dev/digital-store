import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Package, ShoppingBag, Sparkles } from 'lucide-react';

export default function StoreFront() {
    const { shopSettings } = useOutletContext();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(list);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400">Loading products...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Welcome to <span style={{ color: shopSettings?.themeColor }}>{shopSettings?.name || 'Our Store'}</span>
                </h1>
                {shopSettings?.description && (
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        {shopSettings.description}
                    </p>
                )}
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-gray-700/50">
                    <Package className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Products Available</h3>
                    <p className="text-gray-400">Check back soon for amazing products!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <Link
                            key={product.id}
                            to={`/store/product/${product.id}`}
                            className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Image */}
                            <div className="relative h-56 bg-gray-700/50 overflow-hidden">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Package className="w-12 h-12 text-gray-600" />
                                    </div>
                                )}

                                {/* Price Badge */}
                                <div
                                    className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-bold text-white shadow-lg"
                                    style={{ backgroundColor: shopSettings?.themeColor || '#3b82f6' }}
                                >
                                    ${product.price?.toFixed(2)}
                                </div>

                                {/* Customizable Badge */}
                                {product.customizations?.length > 0 && (
                                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium bg-purple-500/90 text-white flex items-center space-x-1">
                                        <Sparkles className="w-3 h-3" />
                                        <span>Customizable</span>
                                    </div>
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                    <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20">
                                        View Details
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="font-semibold text-lg text-white mb-2 truncate group-hover:text-blue-400 transition-colors">
                                    {product.title}
                                </h3>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                                    {product.description || "No description available"}
                                </p>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                                    <span className="text-xs text-gray-500">
                                        {product.customizations?.length || 0} options
                                    </span>
                                    <ShoppingBag className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash, Package } from 'lucide-react';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchProducts() {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, 'products'));
            const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(list);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteDoc(doc(db, 'products', id));
            fetchProducts(); // Refresh list
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product.");
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <Link
                    to="/products/new"
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={20} className="mr-2" />
                    Add Product
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading products...</div>
            ) : products.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
                    <p className="text-gray-500 mt-2 mb-6">Create your first customizable product to get started.</p>
                    <Link
                        to="/products/new"
                        className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                        Create Product
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-48 bg-gray-100 relative">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <Package size={32} />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-bold shadow-sm">
                                    ${product.price}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">{product.title}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description || "No description"}</p>

                                <div className="border-t pt-4 flex justify-between items-center">
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        {product.customizations?.length || 0} Customizations
                                    </span>
                                    <div className="flex space-x-2">
                                        <Link
                                            to={`/products/edit/${product.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            title="Delete"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import ProductForm from '../components/ProductForm';
import { ArrowLeft } from 'lucide-react';

export default function ProductEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id) return;

        async function fetchProduct() {
            try {
                const docRef = doc(db, 'products', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setInitialData({ id: docSnap.id, ...docSnap.data() });
                } else {
                    alert('Product not found');
                    navigate('/products');
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id, navigate]);

    async function handleSave(data) {
        setSaving(true);
        try {
            if (id) {
                await updateDoc(doc(db, 'products', id), data);
            } else {
                await addDoc(collection(db, 'products'), {
                    ...data,
                    createdAt: new Date()
                });
            }
            navigate('/products');
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Loading product...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/products')}
                className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                Back to Products
            </button>

            <h1 className="text-3xl font-bold mb-8 text-gray-800">{id ? 'Edit Product' : 'Add New Product'}</h1>

            <ProductForm
                initialData={initialData || {}}
                onSubmit={handleSave}
                loading={saving}
            />
        </div>
    );
}

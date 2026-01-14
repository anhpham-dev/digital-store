import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import ImageUpload from '../components/ImageUpload';

export default function ShopSettings() {
    const [settings, setSettings] = useState({
        name: 'My Store',
        description: '',
        bannerUrl: '',
        currency: 'USD',
        themeColor: '#3b82f6'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadSettings() {
            try {
                const docRef = doc(db, 'shop_settings', 'main');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(docSnap.data());
                }
            } catch (error) {
                console.error("Error loading settings:", error);
            } finally {
                setLoading(false);
            }
        }
        loadSettings();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        try {
            await setDoc(doc(db, 'shop_settings', 'main'), settings);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings. Check console.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading settings...</div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Shop Configuration</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={settings.name}
                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                        required
                        placeholder="e.g. Acme Corp"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                    <ImageUpload
                        currentImage={settings.bannerUrl}
                        onUpload={(url) => setSettings({ ...settings, bannerUrl: url })}
                        folder="shop_assets"
                    />
                    <div className="mt-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Or paste image URL</label>
                        <input
                            type="url"
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                            value={settings.bannerUrl}
                            onChange={(e) => setSettings({ ...settings, bannerUrl: e.target.value })}
                            placeholder="https://example.com/banner.jpg"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Recommended size: 1200x400px</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        rows="3"
                        value={settings.description}
                        onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                        placeholder="Tell us about your store..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={settings.currency}
                            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                        >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="JPY">JPY (¥)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Theme Color</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="color"
                                className="h-10 w-20 p-1 border border-gray-300 rounded cursor-pointer"
                                value={settings.themeColor}
                                onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
                            />
                            <span className="text-sm font-mono text-gray-600 uppercase">{settings.themeColor}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors shadow-md hover:shadow-lg"
                    >
                        {saving ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </form>
        </div>
    );
}

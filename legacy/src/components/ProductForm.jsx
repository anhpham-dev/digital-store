import React, { useState } from 'react';
import { Plus, Trash } from 'lucide-react';
import ImageUpload from './ImageUpload';

export default function ProductForm({ initialData = {}, onSubmit, loading }) {
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || 0,
        imageUrl: initialData.imageUrl || '',
        customizations: initialData.customizations || []
    });

    const [newOption, setNewOption] = useState({ label: '', type: 'text', optionsString: '' });

    function addCustomization() {
        if (!newOption.label) return;
        const options = newOption.type === 'select'
            ? newOption.optionsString.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        setFormData(prev => ({
            ...prev,
            customizations: [
                ...prev.customizations,
                {
                    id: Date.now(),
                    label: newOption.label,
                    type: newOption.type,
                    options
                }
            ]
        }));
        setNewOption({ label: '', type: 'text', optionsString: '' });
    }

    function removeCustomization(id) {
        setFormData(prev => ({
            ...prev,
            customizations: prev.customizations.filter(c => c.id !== id)
        }));
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Personalized Mug"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                        <ImageUpload
                            currentImage={formData.imageUrl}
                            onUpload={url => setFormData({ ...formData, imageUrl: url })}
                            folder="products"
                        />
                        <div className="mt-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Or paste image URL (Internal/External)</label>
                            <input
                                type="url"
                                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                                value={formData.imageUrl}
                                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            rows="3"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the product..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                        <input
                            type="number"
                            min="0" step="0.01"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Customization Options</h3>
                <p className="text-sm text-gray-500 mb-4">Define fields that customizers can fill out (e.g. engraving text, color selection).</p>

                <div className="space-y-3 mb-6">
                    {formData.customizations.map((c) => (
                        <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border text-sm">
                            <div>
                                <span className="font-medium text-gray-800 mr-2">{c.label}</span>
                                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 uppercase tracking-wide">{c.type}</span>
                                {c.type === 'select' && (
                                    <div className="text-xs text-gray-500 mt-1">Options: {c.options.join(', ')}</div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => removeCustomization(c.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                title="Remove customization"
                            >
                                <Trash size={16} />
                            </button>
                        </div>
                    ))}
                    {formData.customizations.length === 0 && (
                        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-400 text-sm">
                            No customization options added yet.
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start border-t pt-4 bg-gray-50 p-4 rounded-lg">
                    <div className="md:col-span-4">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                        <input
                            placeholder="e.g. Engraving Text"
                            className="w-full text-sm border-gray-300 border rounded-md p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                            value={newOption.label}
                            onChange={e => setNewOption({ ...newOption, label: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                        <select
                            className="w-full text-sm border-gray-300 border rounded-md p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                            value={newOption.type}
                            onChange={e => setNewOption({ ...newOption, type: e.target.value })}
                        >
                            <option value="text">Text Input</option>
                            <option value="select">Dropdown Select</option>
                            <option value="checkbox">Yes/No Checkbox</option>
                        </select>
                    </div>
                    <div className="md:col-span-4">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Options (if Select)</label>
                        {newOption.type === 'select' ? (
                            <input
                                placeholder="S, M, L, XL"
                                className="w-full text-sm border-gray-300 border rounded-md p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                                value={newOption.optionsString}
                                onChange={e => setNewOption({ ...newOption, optionsString: e.target.value })}
                            />
                        ) : (
                            <div className="h-9 flex items-center text-xs text-gray-400 italic pl-1">Not applicable</div>
                        )}
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                        <label className="block text-xs font-medium text-transparent mb-1">&nbsp;</label>
                        <button
                            type="button"
                            disabled={!newOption.label}
                            onClick={addCustomization}
                            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-400 transition-colors"
                            title="Add Option"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-md font-medium transition-transform active:scale-95"
                >
                    {loading ? "Saving..." : "Save Product"}
                </button>
            </div>
        </form>
    );
}

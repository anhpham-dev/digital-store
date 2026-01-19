import React, { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Upload, X } from 'lucide-react';

export default function ImageUpload({ onUpload, currentImage, folder = 'uploads' }) {
    const [uploading, setUploading] = useState(false);

    async function handleFile(e) {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            // Create a reference to 'folder/timestamp_filename'
            const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            onUpload(url);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Check console and firebase config.");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="w-full">
            {currentImage ? (
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img src={currentImage} alt="Uploaded" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={() => onUpload('')}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFile} disabled={uploading} />
                </label>
            )}
            {uploading && <p className="text-sm text-blue-500 mt-2 animate-pulse">Uploading...</p>}
        </div>
    );
}

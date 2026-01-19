import React from 'react';

export default function Dashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-gray-500 text-sm">Total Orders</h2>
                    <p className="text-3xl font-bold">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-gray-500 text-sm">Total Revenue</h2>
                    <p className="text-3xl font-bold">$0.00</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-gray-500 text-sm">Products</h2>
                    <p className="text-3xl font-bold">0</p>
                </div>
            </div>
        </div>
    );
}

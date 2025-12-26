// src/components/PreviousSearches.jsx
import React from 'react';

const PreviousSearches = () => {
    const searches = [
        { id: 1, title: "iPhone 14 Pro Max", desc: "256GB, Excellent Condition", price: "₹1,00,000" },
        { id: 2, title: "Toyota Camry 2023", desc: "15,000 miles, Like New", price: "₹25,00,000" },
        { id: 3, title: "2BHK Apartment", desc: "Downtown Area", price: "₹15,00,000/month" },
        { id: 4, title: "MacBook Pro M2", desc: "512GB, Warranty", price: "$1,00,000" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {searches.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                    <div className="bg-gray-200 h-32 mb-3 rounded"></div>
                    <h3 className="font-medium text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                    <p className="text-sm font-semibold mt-2">{item.price}</p>
                </div>
            ))}
            
            
        </div>
    );
};

export default PreviousSearches;
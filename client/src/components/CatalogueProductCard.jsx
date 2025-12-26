import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Calendar, Gauge, Share2 } from 'lucide-react';

const CatalogueProductCard = ({ product, navigate }) => {
    const [showShare, setShowShare] = useState(false);
    const [copied, setCopied] = useState(false);

    // Extract specific dynamic fields if they exist for better display
    const year = product.form_data?.Year || product.form_data?.year;
    const kmDriven = product.form_data?.km_driven || product.form_data?.KMDriven || product.form_data?.['KM Driven'];
    const fuel = product.form_data?.fuel || product.form_data?.Fuel;

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price).replace('₹', '₹ ');
    };

    const handleShare = (e) => {
        e.stopPropagation();
        setShowShare(!showShare);
        setCopied(false);
    };

    const copyLink = (e) => {
        e.stopPropagation();
        const link = `${window.location.origin}/product/${product._id}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => {
            setShowShare(false);
            setCopied(false);
        }, 2000);
    };

    // Close modal when clicking outside
    useEffect(() => {
        const close = () => setShowShare(false);
        if (showShare) window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, [showShare]);


    return (
        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row group h-auto sm:h-[180px] relative">

            {/* Image Section */}
            <div
                className="w-full sm:w-[260px] h-[200px] sm:h-full relative flex-shrink-0 cursor-pointer overflow-hidden"
                onClick={() => navigate(`/product/${product._id}`)}
            >
                <img
                    src={product.images && product.images[0]?.url ? `${import.meta.env.VITE_BACKEND_URL}${product.images[0].url}` : 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={product.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />

                {/* Updated Image Count Badge - Bottom Left */}
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-[2px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                    <span className="font-medium">{product.images?.length || 0}</span>
                </div>

                <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-colors z-10" onClick={(e) => { e.stopPropagation(); /* Add to fav logic */ }}>
                    <Heart size={16} />
                </button>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4 flex flex-col justify-between relative">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{formatPrice(product.price)}</h3>
                        <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">
                            {(() => {
                                const catTitle = product.category?.title || '';
                                const brand = product.form_data?.Brand || product.form_data?.brand;
                                const model = product.form_data?.Model || product.form_data?.model;

                                const isVehicle = ['car', 'vehicle', 'motor', 'bike', 'scooter'].some(k => catTitle.toLowerCase().includes(k));

                                if (isVehicle) {
                                    if (brand && model) return `${brand} • ${model}`;
                                    if (brand) return `${brand}`;
                                    return catTitle;
                                }

                                const secondary = model || brand;
                                if (secondary) return `${catTitle} • ${secondary}`;
                                return catTitle;
                            })()}
                        </p>
                        <h4
                            className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors"
                            onClick={() => navigate(`/product/${product._id}`)}
                        >
                            {product.title}
                        </h4>
                    </div>

                    {/* Share Button & Modal */}
                    <div className="relative">
                        <button
                            className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                            onClick={handleShare}
                        >
                            <Share2 size={18} />
                        </button>

                        {showShare && (
                            <div
                                className="absolute right-0 top-8 bg-white shadow-xl border border-gray-100 rounded-lg p-3 w-64 z-50 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <p className="text-xs font-semibold text-gray-700">Share this product</p>
                                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded px-2 py-1.5">
                                    <input
                                        readOnly
                                        value={`${window.location.origin}/product/${product._id}`}
                                        className="text-xs text-gray-500 bg-transparent flex-1 outline-none truncate"
                                    />
                                    <button
                                        onClick={copyLink}
                                        className="text-indigo-600 hover:text-indigo-800"
                                        title="Copy Link"
                                    >
                                        {copied ? <span className="text-green-600 text-[10px] font-bold">Copied!</span> : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 mt-3">
                    {year && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Calendar size={13} className="text-gray-400" />
                            <span>{year}</span>
                        </div>
                    )}
                    {kmDriven && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Gauge size={13} className="text-gray-400" />
                            <span>{kmDriven} km</span>
                        </div>
                    )}
                    {fuel && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <span className="text-gray-400 text-[10px]">⛽</span>
                            <span>{fuel}</span>
                        </div>
                    )}
                    {product.location?.place && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 col-span-2 sm:col-span-1">
                            <MapPin size={13} className="text-gray-400" />
                            <span className="truncate">{product.location.place}</span>
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-3 flex justify-end">
                </div>

            </div>
        </div>
    );
};

export default CatalogueProductCard;

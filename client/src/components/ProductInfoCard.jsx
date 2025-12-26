// src/components/ProductInfoCard.jsx
import React from 'react';
import { MessageCircle, CreditCard } from 'lucide-react';

const ProductInfoCard = ({ product, onChatClick, onMakeOfferClick, isOwner, currentUserId }) => {
    const seller = product.user || {};
    const price = product.price;

    return (
        <div className="space-y-6">

            {/* Price Card */}
            <div className="bg-[#F0E9FF] p-6 rounded-xl shadow-sm border border-[#E0D4FC]">
                <div className="flex flex-col items-center text-center">
                    <p className="text-sm text-gray-500 font-medium mb-1">Price</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#7C5CB9] mb-6">
                        ₹{price?.toLocaleString('en-IN') || 'N/A'}
                    </h1>

                    {!isOwner && (
                        <div className="w-full space-y-3">
                            <button
                                onClick={onMakeOfferClick}
                                className="w-full bg-[#8069AE] hover:bg-[#6e579b] text-white font-semibold py-3.5 px-6 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                <CreditCard size={18} />
                                Make offer
                            </button>
                        </div>
                    )}

                    <div className="mt-4 text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                        Posted: {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                </div>
            </div>

            {/* Seller Profile Card */}
            {!isOwner ? (
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-5 relative z-10">
                        <div className="relative">
                            <img
                                src={
                                    seller.avatar ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.full_name || 'Seller')}&background=8069AE&color=fff`
                                }
                                alt={seller.full_name || 'Seller'}
                                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-lg leading-tight">{seller.full_name || 'Seller Name'}</h4>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Verified Seller • {product.location?.place || 'Kerala'}</p>
                        </div>
                    </div>

                    <button
                        onClick={onChatClick}
                        className="w-full bg-[#8069AE] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#6e579b] transition-colors flex items-center justify-center gap-2 relative z-10"
                    >
                        <MessageCircle size={18} />
                        Chat with seller
                    </button>

                    {/* Background decoration */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-50 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Manage Product</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center bg-blue-50 text-blue-600 font-medium py-2.5 px-4 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100">
                            Edit
                        </button>
                        <button className="flex items-center justify-center bg-red-50 text-red-600 font-medium py-2.5 px-4 rounded-lg hover:bg-red-100 transition-colors border border-red-100">
                            Delete
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProductInfoCard;
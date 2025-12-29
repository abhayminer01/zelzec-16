import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductScrollSection = ({ title, products, categoryId, viewAllLink }) => {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 300; // Adjust scroll amount as needed
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 px-6 md:px-8 py-8 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
                    <p className="text-sm text-gray-500 mt-1">Found {products.length} latest items</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Scroll Buttons */}
                    <div className="hidden md:flex items-center gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <button
                        onClick={() => navigate(viewAllLink)}
                        className="text-primary hover:text-primary-dark font-medium hover:underline text-sm md:text-base whitespace-nowrap"
                    >
                        View all
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((p) => {
                    // Determine icon based on category type if available, else generic package
                    // Note: p.category might not be populated in sections array as per controller logic (just ID refs or basic fields)
                    // But we are passing title from parent.

                    return (
                        <div
                            key={p._id}
                            onClick={() => navigate(`/product/${p._id}`)}
                            className="flex-none w-[200px] sm:w-[240px] snap-start group cursor-pointer"
                        >
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300">
                                <div className="relative h-32 sm:h-40 bg-gray-100 overflow-hidden">
                                    <img
                                        src={p.images?.[0]?.url ? `${import.meta.env.VITE_BACKEND_URL}${p.images[0].url}` : '/placeholder.png'}
                                        alt={p.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {p.location?.place && (
                                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <Icons.MapPin size={10} />
                                            <span className="truncate max-w-[100px]">{p.location.place}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <p className="text-lg font-bold text-primary">₹{p.price?.toLocaleString()}</p>
                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mt-1 group-hover:text-primary transition-colors">
                                        {p.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 line-clamp-1 mt-1">{p.description}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductScrollSection;

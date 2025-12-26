import React, { useEffect, useState } from 'react';
import { getRelatedProducts } from '../services/product-api';
import { useNavigate } from 'react-router-dom';

const RelatedProducts = ({ productId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Static data for testing/demo
        const staticData = [
            {
                "location": {
                    "lat": 8.5294885,
                    "lng": 77.0926011,
                    "place": "Poovachal"
                },
                "_id": "6922821005d669d5d51829bc",
                "title": "Rolls Royce urgent sale !!",
                "description": "only genuine contact",
                "images": [
                    {
                        "url": "/uploads/1763869200103-827178320",
                        "filename": "1763869200103-827178320",
                        "_id": "6922821005d669d5d51829bd"
                    }
                ],
                "price": 25000000
            },
            {
                "location": {
                    "lat": 8.52606,
                    "lng": 76.94438,
                    "place": "Thiruvananthapuram"
                },
                "_id": "690390e9c8d95444262ad03a",
                "title": "Location Test",
                "description": "aaaa",
                "images": [
                    {
                        "url": "/uploads/1761841385837-217973775",
                        "filename": "1761841385837-217973775",
                        "_id": "690390e9c8d95444262ad03b"
                    }
                ],
                "price": 1222222
            },
            {
                "location": {
                    "lat": 8.5294885,
                    "lng": 77.0926011,
                    "place": "Poovachal"
                },
                "_id": "68fd98915acec05be711bc67",
                "title": "aaaa",
                "description": "aaa",
                "images": [
                    {
                        "url": "/uploads/1761450128936-737494228",
                        "filename": "1761450128936-737494228",
                        "_id": "68fd98915acec05be711bc68"
                    }
                ],
                "price": 12000
            },
            {
                "location": {
                    "lat": 8.50756,
                    "lng": 76.93992,
                    "place": "Thiruvananthapuram"
                },
                "_id": "68fd97015acec05be711bc20",
                "title": "aaa",
                "description": "aaa",
                "images": [
                    {
                        "url": "/uploads/1761449729416-337212880",
                        "filename": "1761449729416-337212880",
                        "_id": "68fd97015acec05be711bc21"
                    }
                ],
                "price": 12000
            }
        ];

        setProducts(staticData);
        setLoading(false);
    }, [productId]);

    if (loading) return <div className="text-gray-500 text-sm">Loading related products...</div>;

    if (products.length === 0) {
        return <div className="text-gray-500 text-sm">No related products found.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(item => (
                <div
                    key={item._id}
                    className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/product/${item._id}`)}
                >
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                            src={item.images?.[0]?.url ? `${import.meta.env.VITE_BACKEND_URL}${item.images[0].url}` : '/placeholder.png'}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content Container */}
                    <div className="p-4 space-y-2">
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-[#8069AE] transition-colors">
                                {item.title}
                            </h3>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 border border-gray-100 whitespace-nowrap">
                                Used
                            </span>
                        </div>

                        <p className="text-xl font-bold text-[#8069AE]">
                            ₹{item.price?.toLocaleString()}
                        </p>

                        <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin">
                                <path d="M20 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span className="truncate">{item.location?.place || 'Kerala'}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RelatedProducts;

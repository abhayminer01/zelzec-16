import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import MobileBottomNav from '../components/MobileBottomNav'
import { getListedProducts, deleteProduct } from '../services/product-api';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { Trash2, Edit2 } from 'lucide-react';
import EditProductModal from '../components/EditProductModal';

export default function MyAdsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const res = await getListedProducts();
            if (res?.success) {
                setProducts(res.data);
            } else {
                console.error("Failed to fetch products", res);
            }
        } catch (error) {
            console.error("Error loading ads:", error);
            toast.error('Failed to load your ads');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevent navigation
        const confirm = window.confirm("Are you sure you want to delete this ad? This action cannot be undone.");
        if (!confirm) return;

        const loader = toast.loading("Deleting ad...");
        const res = await deleteProduct(id);
        toast.dismiss(loader);

        if (res.success) {
            toast.success("Ad deleted successfully");
            setProducts(prev => prev.filter(p => p._id !== id));
        } else {
            toast.error(res.message || "Failed to delete ad");
        }
    };

    const handleEdit = (e, product) => {
        e.stopPropagation();
        setEditingProduct(product);
    };

    const handleUpdateSuccess = () => {
        fetchProducts(); // Refresh list to get updated details
        setEditingProduct(null);
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Toaster position="top-right" />
                <NavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                </div>
                <MobileBottomNav />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Toaster position="top-right" />
            <NavBar />

            <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">My Ads ({products.length})</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {products.map((p) => (
                            <div
                                key={p._id}
                                onClick={() => navigate(`/product/${p._id}`)}
                                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden group relative"
                            >
                                <div className="w-full h-40 overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        src={`${import.meta.env.VITE_BACKEND_URL}${p.images?.[0]?.url}`}
                                        alt={p.title}
                                    />
                                </div>
                                <div className="p-3">
                                    <h3 className="font-semibold text-gray-900 line-clamp-1">{p.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{p.description}</p>
                                    <p className="text-lg font-bold text-primary mt-2">₹{p.price?.toLocaleString('en-IN')}</p>
                                </div>

                                {/* Action Buttons Overlay */}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => handleEdit(e, p)}
                                        className="p-2 bg-white/90 backdrop-blur rounded-full shadow hover:bg-white text-gray-700 hover:text-primary transition-colors"
                                        title="Edit Ad"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, p._id)}
                                        className="p-2 bg-white/90 backdrop-blur rounded-full shadow hover:bg-white text-gray-700 hover:text-red-500 transition-colors"
                                        title="Delete Ad"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                            <div className="bg-gray-100 p-4 rounded-full mb-4">
                                <span className="text-4xl">📢</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No ads yet</h3>
                            <p className="mb-6">Start selling your items today!</p>
                            <button
                                onClick={() => navigate('/sell')} // Assuming /sell or using context to open sell modal
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Post an Ad
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onUpdate={handleUpdateSuccess}
                />
            )}

            <MobileBottomNav />
            <Footer />
        </div>
    )
}

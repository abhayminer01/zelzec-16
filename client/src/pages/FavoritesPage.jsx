import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import MobileBottomNav from '../components/MobileBottomNav';
import CatalogueProductCard from '../components/CatalogueProductCard';
import { getFavorites } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Footer from '../components/Footer';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const res = await getFavorites();
            if (res.success) {
                setFavorites(res.data);
            }
        } catch (error) {
            console.error("Error fetching favorites", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <NavBar />
            <MobileBottomNav />

            <div className="flex-1 max-w-[1280px] mx-auto px-4 py-8 w-full">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-red-50 p-3 rounded-full">
                        <Heart className="text-red-500 fill-red-500" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
                        <p className="text-sm text-gray-500">Manage your saved listings</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 w-full">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-gray-500 text-sm">Loading your favorites...</p>
                    </div>
                ) : favorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((product) => (
                            <CatalogueProductCard
                                key={product._id}
                                product={product}
                                navigate={navigate}
                                onFavoriteChange={() => {
                                    setFavorites(prev => prev.filter(p => p._id !== product._id));
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <Heart className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">Start browsing and save items you love to find them easily here later.</p>
                        <button
                            onClick={() => navigate('/catalogue')}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            Browse Catalogue
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

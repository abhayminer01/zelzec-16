import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import MobileBottomNav from '../components/MobileBottomNav'
import { getProductForProfile } from '../services/product-api';
import { getUser, updateUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';

export default function ProfilePage() {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        mobile: '',
        address: '',
        location: { lat: '', lng: '' }
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, userData] = await Promise.all([
                    getProductForProfile(),
                    getUser()
                ]);
                setProducts(productsRes.data);
                setUser(userData);
                setFormData({
                    full_name: userData?.full_name || '',
                    email: userData?.email || '',
                    mobile: userData?.mobile || '',
                    address: userData?.address || '',
                    location: userData?.location || { lat: '', lng: '' }
                });
            } catch (error) {
                toast.error('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'lat' || name === 'lng') {
            setFormData(prev => ({
                ...prev,
                location: { ...prev.location, [name]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        try {
            const res = await updateUser({
                full_name: formData.full_name,
                mobile: formData.mobile,
                address: formData.address,
                location: formData.location
            });

            if (res.success) {
                setUser(res.data);
                setIsEditing(false);
                toast.success('Profile updated successfully!');
            } else {
                toast.error(res.message || 'Failed to update profile');
            }
        } catch (error) {
            toast.error('An error occurred while updating profile');
        }
    };

    const handleCancel = () => {
        setFormData({
            full_name: user?.full_name || '',
            email: user?.email || '',
            mobile: user?.mobile || '',
            address: user?.address || '',
            location: user?.location || { lat: '', lng: '' }
        });
        setIsEditing(false);
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
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" />
            <NavBar />
            <MobileBottomNav />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user?.full_name || 'User'}</h1>
                                <p className="text-sm text-gray-500">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Edit2 size={16} />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Save size={16} />
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* User Details Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <User size={16} className="inline mr-2" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 ${isEditing ? 'bg-white border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-50 border-gray-200'} transition-colors outline-none`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Mail size={16} className="inline mr-2" />
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled={true}
                                className="w-full px-4 py-2.5 border rounded-lg text-gray-900 bg-gray-100 border-gray-200 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Phone size={16} className="inline mr-2" />
                                Mobile Number
                            </label>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 ${isEditing ? 'bg-white border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-50 border-gray-200'} transition-colors outline-none`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <MapPin size={16} className="inline mr-2" />
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 ${isEditing ? 'bg-white border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-50 border-gray-200'} transition-colors outline-none`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Latitude</label>
                            <input
                                type="text"
                                name="lat"
                                value={formData.location?.lat || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 ${isEditing ? 'bg-white border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-50 border-gray-200'} transition-colors outline-none`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Longitude</label>
                            <input
                                type="text"
                                name="lng"
                                value={formData.location?.lng || ''}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 ${isEditing ? 'bg-white border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' : 'bg-gray-50 border-gray-200'} transition-colors outline-none`}
                            />
                        </div>
                    </div>
                </div>

                {/* My Products Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">My Products ({products.length})</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {products.map((p) => (
                            <div
                                key={p._id}
                                onClick={() => navigate(`/product/${p._id}`)}
                                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden group"
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
                                    <p className="text-lg font-bold text-indigo-600 mt-2">₹{p.price?.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {products.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <p>No products listed yet</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}

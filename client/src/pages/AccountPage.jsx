import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import MobileBottomNav from '../components/MobileBottomNav';
import Footer from '../components/Footer';
import { getUser, updateUser } from '../services/auth';
import { toast, Toaster } from 'sonner';
import { User, Mail, Phone, MapPin, Save, Edit2, X, Shield, Camera, Bell } from 'lucide-react';

export default function AccountPage() {
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
    const [activeTab, setActiveTab] = useState('personal'); // personal, security, notifications

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUser();
                setUser(userData);
                setFormData({
                    full_name: userData?.full_name || '',
                    email: userData?.email || '',
                    mobile: userData?.mobile || '',
                    address: userData?.address || '',
                    location: userData?.location || { lat: '', lng: '' }
                });
            } catch (error) {
                toast.error('Failed to load account data');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
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
            <div className="flex flex-col min-h-screen bg-gray-50">
                <NavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8069AE] border-t-transparent"></div>
                </div>
                <MobileBottomNav />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Toaster position="top-right" richColors />
            <NavBar />

            <main className="flex-1 pb-20 md:pb-8">
                {/* Banner Section */}
                <div className="h-48 bg-gradient-to-r from-[#604D85] to-[#8069AE] w-full relative">
                    <div className="absolute inset-0 bg-black/5"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
                    <div className="flex flex-col md:flex-row gap-8">

                        {/* Left Sidebar: Profile Card & Navigation */}
                        <div className="w-full md:w-80 flex flex-col gap-6">
                            {/* Profile Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                                <div className="relative inline-block mx-auto mb-4">
                                    <div className="w-28 h-28 rounded-full bg-[#8069AE]/10 flex items-center justify-center text-primary text-4xl font-bold border-4 border-white shadow-md">
                                        {user?.full_name?.charAt(0)?.toUpperCase() || <User size={40} />}
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 bg-[#8069AE] text-white rounded-full hover:bg-[#6A5299] transition-colors shadow-sm">
                                        <Camera size={16} />
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{user?.full_name || 'User'}</h2>
                                <p className="text-sm text-gray-500 mb-4">{user?.email || 'No email'}</p>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#8069AE]/10 text-primary text-xs font-semibold">
                                    Member since {new Date(user?.createdAt || Date.now()).getFullYear()}
                                </div>
                            </div>

                            {/* Navigation Menu */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hidden md:block">
                                <nav className="flex flex-col">
                                    <button
                                        onClick={() => setActiveTab('personal')}
                                        className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'personal' ? 'bg-[#8069AE]/10 text-primary border-l-4 border-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'}`}
                                    >
                                        <User size={18} />
                                        Personal Information
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('security')}
                                        className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-[#8069AE]/10 text-primary border-l-4 border-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'}`}
                                    >
                                        <Shield size={18} />
                                        Login & Security
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('notifications')}
                                        className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-[#8069AE]/10 text-primary border-l-4 border-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'}`}
                                    >
                                        <Bell size={18} />
                                        Notifications
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Right Content Area */}
                        <div className="flex-1">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                {/* Header */}
                                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white">
                                    <div>
                                        <h1 className="text-xl font-bold text-gray-900">
                                            {activeTab === 'personal' && 'Personal Information'}
                                            {activeTab === 'security' && 'Login & Security'}
                                            {activeTab === 'notifications' && 'Notifications'}
                                        </h1>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {activeTab === 'personal' && 'Manage your personal details and public profile.'}
                                            {activeTab === 'security' && 'Manage your password and account security settings.'}
                                            {activeTab === 'notifications' && 'Choose what notifications you want to receive.'}
                                        </p>
                                    </div>
                                    {activeTab === 'personal' && (
                                        !isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center gap-2 px-4 py-2 bg-[#8069AE] text-white text-sm font-medium rounded-lg hover:bg-[#6A5299] transition-all shadow-sm active:scale-95"
                                            >
                                                <Edit2 size={16} />
                                                Edit
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleCancel}
                                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSave}
                                                    className="flex items-center gap-2 px-4 py-2 bg-[#8069AE] text-white text-sm font-medium rounded-lg hover:bg-[#6A5299] transition-colors shadow-sm"
                                                >
                                                    <Save size={16} />
                                                    Save Changes
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>

                                {/* Content Body */}
                                <div className="p-8">
                                    {activeTab === 'personal' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <User className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="full_name"
                                                            value={formData.full_name}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-lg border ${isEditing ? 'border-gray-300 focus:ring-primary focus:border-primary bg-white' : 'border-transparent bg-gray-50 text-gray-500 cursor-not-allowed'} transition-colors`}
                                                            placeholder="John Doe"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <Mail className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="email"
                                                            value={formData.email}
                                                            disabled={true}
                                                            className="block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-lg border border-transparent bg-gray-100 text-gray-500 cursor-not-allowed opacity-75"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <Phone className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="tel"
                                                            name="mobile"
                                                            value={formData.mobile}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-lg border ${isEditing ? 'border-gray-300 focus:ring-primary focus:border-primary bg-white' : 'border-transparent bg-gray-50 text-gray-500 cursor-not-allowed'} transition-colors`}
                                                            placeholder="+1 (555) 000-0000"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <MapPin className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="address"
                                                            value={formData.address}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-lg border ${isEditing ? 'border-gray-300 focus:ring-primary focus:border-primary bg-white' : 'border-transparent bg-gray-50 text-gray-500 cursor-not-allowed'} transition-colors`}
                                                            placeholder="123 Main St, City, Country"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'security' && (
                                        <div className="text-center py-12">
                                            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Shield className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900">No Security Options Yet</h3>
                                            <p className="text-gray-500 mt-1">Password change and 2FA features coming soon.</p>
                                            <button className="mt-6 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                                Update Password
                                            </button>
                                        </div>
                                    )}

                                    {activeTab === 'notifications' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                                                    <p className="text-sm text-gray-500">Receive emails about your account activity</p>
                                                </div>
                                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                                    <input type="checkbox" name="toggle" id="toggle-email" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-[#8069AE] toggle-checkbox:right-0" defaultChecked />
                                                    <label htmlFor="toggle-email" className="toggle-label block overflow-hidden h-6 rounded-full bg-[#8069AE] cursor-pointer"></label>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Push Notifications</h4>
                                                    <p className="text-sm text-gray-500">Receive push notifications on your devices</p>
                                                </div>
                                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                                    <input type="checkbox" name="toggle" id="toggle-push" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300" />
                                                    <label htmlFor="toggle-push" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            <MobileBottomNav />
        </div>
    );
}

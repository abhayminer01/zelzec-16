import React, { useState, useEffect } from "react";
import { useModal } from "../contexts/ModalContext";
import { updateUser, getUser } from "../services/auth";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export default function CompleteProfileModal() {
    const { closeCompleteProfile } = useModal();
    const { login, userData } = useAuth();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        mobile: "",
        address: "",
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                email: userData.email || "",
                fullName: userData.full_name || "",
                mobile: userData.mobile ? userData.mobile.toString() : "",
                address: userData.address || "",
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Validations
        if (!/^\d{10}$/.test(formData.mobile)) {
            return toast.error("Mobile number must be 10 digits");
        }

        if (formData.address.trim() === "") {
            return toast.error("Address is required");
        }

        setLoading(true);

        let location = null;
        if (navigator.geolocation) {
            try {
                location = await new Promise((resolve) => {
                    navigator.geolocation.getCurrentPosition(
                        (position) =>
                            resolve({
                                lat: parseFloat(position.coords.latitude.toFixed(6)),
                                lng: parseFloat(position.coords.longitude.toFixed(6)),
                            }),
                        () => resolve(null) // fallback if user denies
                    );
                });
            } catch (err) {
                location = null;
            }
        }

        if (!location) {
            // Optional: Could choose to block compliance if location is strict requirement
            // For now, mirroring RegisterComponent logic which mandates location
            setLoading(false);
            return toast.error("Please allow location access to complete registration");
        }

        // Payload
        const payload = {
            full_name: formData.fullName, // included but typically unchanged
            mobile: formData.mobile,
            address: formData.address,
            location,
        };

        try {
            const res = await updateUser(payload);
            if (res?.success) {
                toast.success("Profile Updated", { description: "You are all set!" });
                const user = await getUser();
                login(user); // Update context with new data
                closeCompleteProfile();
            } else {
                toast.error("Update Failed", {
                    description: `${res?.message || res?.err}`,
                });
            }
        } catch (err) {
            toast.error("Something went wrong", { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        // Prevent closing by clicking outside to force completion
        >
            <div
                className="bg-white md:rounded-2xl shadow-xl w-full h-full md:h-auto md:w-[450px] p-6 md:p-8 flex flex-col items-center relative overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="text-2xl font-bold mb-1">Complete Profile</h1>
                <p className="text-gray-700 text-sm">
                    Welcome to <span className="font-semibold">ZelZec</span>
                </p>
                <p className="text-gray-500 text-[12px] mb-6">
                    Please provide your details to continue.
                </p>

                <form className="w-full flex flex-col gap-4" onSubmit={handleFormSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full border border-gray-300 rounded-lg h-10 px-3 bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Full Name <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.fullName}
                            disabled
                            className="w-full border border-gray-300 rounded-lg h-10 px-3 bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Mobile Number <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="Enter your mobile number"
                            required
                            className="w-full border border-gray-300 rounded-lg h-10 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Current Address <span className="text-red-500 ml-1">*</span>
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your address"
                            required
                            className="border border-gray-300 w-full rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-white rounded-lg h-10 mt-1 font-medium transition disabled:opacity-70"
                    >
                        {loading ? "Saving..." : "Save & Continue"}
                    </button>
                </form>
            </div>
        </div>
    );
}

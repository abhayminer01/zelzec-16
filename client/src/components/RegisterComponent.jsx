import React, { useState } from "react";
import { useModal } from "../contexts/ModalContext";
import { registerUser, getUser } from "../services/auth";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterComponent() {
  const { closeRegister, openLogin } = useModal();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
    full_name: "",
    mobile: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.email.includes("@")) {
      return toast.error("Please enter a valid email");
    }

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (formData.password !== formData.repeatPassword) {
      return toast.error("Passwords do not match");
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      return toast.error("Mobile number must be 10 digits");
    }

    if (formData.fullName.trim() === "") {
      return toast.error("Full name is required");
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
      setLoading(false);
      return toast.error("Please allow location access to register");
    }

    // Payload
    const payload = {
      email: formData.email,
      password: formData.password,
      full_name: formData.fullName,
      mobile: formData.mobile,
      address: formData.address,
      location,
    };

    try {
      const res = await registerUser(payload);
      if (res?.success) {
        toast.success("User Registration", { description: "Successfully Registered User" });
        const user = await getUser();
        login(user);
        closeRegister();
      } else {
        toast.error("Something Occurred while Registering", {
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
      onClick={closeRegister}
    >
      <div
        className="bg-white md:rounded-2xl shadow-xl w-full h-full md:h-auto md:w-[450px] p-6 md:p-8 flex flex-col items-center relative overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeRegister}
          className="absolute right-5 top-5 text-gray-500 hover:text-gray-700 md:hidden p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <h1 className="text-2xl font-bold mb-1">Sign Up</h1>
        <p className="text-gray-700 text-sm">
          Welcome to <span className="font-semibold">ZelZec</span>
        </p>
        <p className="text-gray-500 text-[12px] mb-6">
          Create an account to Buy and Sell your Stuff!
        </p>

        <form className="w-full flex flex-col gap-4" onSubmit={handleFormSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">
              Email <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              className="w-full border border-gray-300 rounded-lg h-10 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              className="w-full border border-gray-300 rounded-lg h-10 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Repeat Password <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="password"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
              className="w-full border border-gray-300 rounded-lg h-10 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full border border-gray-300 rounded-lg h-10 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="bg-primary hover:bg-primary/90 text-white rounded-lg h-10 mt-1 font-medium transition"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => {
                closeRegister();
                openLogin();
              }}
              className="text-primary font-medium cursor-pointer hover:underline"
            >
              {loading ? "Registering..." : "Sign Up"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

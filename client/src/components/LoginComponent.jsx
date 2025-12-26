import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useModal } from "../contexts/ModalContext";
import { userLogin } from "../services/auth";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { X } from "lucide-react";

export default function LoginComponent() {
  const { isLoginOpen, openLogin, closeLogin, openRegister } = useModal();
  const { login } = useAuth();
  
  const handleBackdropClick = (e) => {
    closeLogin();
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await userLogin({ email, password });

    if (res?.success) {
      toast.success("User Login", {
        description: "Successfully Logged in",
      });
      login();
      closeLogin();
    } else {
      toast.error("Login Failed", {
        description: res?.message || "Invalid credentials or server error",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white md:rounded-2xl shadow-xl md:w-[350px] h-full md:h-auto p-8 flex flex-col items-center relative" onClick={e => e.stopPropagation()}>
        {/* Heading */}
        <span className="text-2xl absolute right-0 pr-5 top-0 pt-5 text-primary md:hidden" onClick={handleBackdropClick}><X /></span>
        <h1 className="text-2xl font-bold mb-1">Sign in</h1>
        <p className="text-gray-700 text-sm">Welcome to <span className="font-semibold">ZelZec</span></p>
        <p className="text-gray-500 text-sm mb-6">Sign in to Buy and Sell your Stuff!</p>

        {/* Form */}
        <form className="w-full flex flex-col gap-4" onSubmit={handleFormSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email address"
              name="email"
              className="w-full border border-gray-300 rounded-lg h-10 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg h-10 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <p className="text-right text-sm text-primary cursor-pointer hover:underline">
            Forgot password?
          </p>

          <button
            type="submit"
            className="bg-primary hover:bg-primary text-white rounded-lg h-10 mt-1 font-medium transition"
          >
            Sign In
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 my-2">
            <hr className="flex-grow border-gray-300" />
            <span className="text-sm text-gray-500">Or continue with</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google button */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary text-white rounded-lg h-10 transition font-medium"
          >
            <FcGoogle />
            Continue with Google
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <span onClick={() => { closeLogin(); openRegister(); }} className="text-primary font-medium cursor-pointer hover:underline">
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

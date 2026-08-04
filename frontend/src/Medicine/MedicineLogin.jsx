import React, { useState } from "react";
import Logo from "../assets/Logo.png";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import {
  RxEyeOpen,
  RxEyeClosed,
  RxLockClosed,
  RxEnvelopeClosed,
} from "react-icons/rx";

const MedicineLogin = () => {
  const api = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Form State
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Form Validation Logic
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!gmail.trim()) {
      newErrors.gmail = "Email address is required.";
    } else if (!emailRegex.test(gmail)) {
      newErrors.gmail = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function credentialsChecking(e) {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${api}/api/medicine/medicineLogin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gmail,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Login successful!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      } else {
        toast.error(data.message || "Invalid email or password.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Network error. Please check your connection.");
      console.error("Medicine Login error:", error);
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col lg:flex-row antialiased">
      <Toaster position="top-right" />

      {/* Hero Visual Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=80"
          alt="Medicine Ordering"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        <div className="relative z-10 px-12 text-white max-w-lg space-y-4">
          <span className="bg-white/10 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border border-white/20">
            Medicine Seller Portal
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
            Streamline Practice. Empower Patient Care.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Manage your orders, patient requirements, and clinical earnings securely in one unified dashboard.
          </p>
        </div>
      </div>

      {/* Interactive Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
          
          {/* Logo Heading */}
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center justify-center gap-2">
              <img
                height={42}
                width={42}
                src={Logo}
                alt="MEDSEWA Logo"
                className="object-contain"
              />
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                MED<span className="text-[#058b7c]">SEWA</span>
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Medicine Seller Sign In
            </h1>
            <p className="text-xs text-slate-500">
              Welcome back, Medicine. Please enter your credentials.
            </p>
          </div>

          <form onSubmit={credentialsChecking} noValidate className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Email Address
              </label>
              <div className="relative">
                <RxEnvelopeClosed className="absolute left-3.5 top-3.5 text-slate-400 text-base" />
                <input
                  value={gmail}
                  onChange={(e) => {
                    setGmail(e.target.value);
                    if (errors.gmail) setErrors({ ...errors, gmail: null });
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                    errors.gmail
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#058b7c]/20 focus:border-[#058b7c]"
                  }`}
                  type="email"
                  placeholder="medicine@example.com"
                />
              </div>
              {errors.gmail && (
                <p className="text-red-500 text-xs mt-1">{errors.gmail}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password-medicine"
                  className="text-xs text-[#058b7c] hover:underline font-semibold"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <RxLockClosed className="absolute left-3.5 top-3.5 text-slate-400 text-base" />
                <input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors({ ...errors, password: null });
                  }}
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                    errors.password
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#058b7c]/20 focus:border-[#058b7c]"
                  }`}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <RxEyeClosed /> : <RxEyeOpen />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#058b7c] hover:bg-[#047266] text-white font-semibold py-3 rounded-xl transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          {/* Footer Registration Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/medicine/signup"
                className="text-[#058b7c] font-bold hover:underline"
              >
                Register as Medicine Seller
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineLogin;
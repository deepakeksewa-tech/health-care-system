import React, { useState } from 'react';
import Header from '../component/Header';
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { 
  User, 
  Hash, 
  Calendar, 
  Upload, 
  Mail, 
  Building2, 
  Lock, 
  CheckCircle2, 
  FileText,
  Loader2,
  ArrowRight
} from 'lucide-react';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL;

  // Form states
  const [name, setName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [date, setDate] = useState("");
  const [gmail, setGmail] = useState("");
  const [stateCouncilMedical, setStateCouncilMedical] = useState("");
  const [password, setPassword] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);

  // Dynamic error reporting state
  const [errors, setErrors] = useState({});

  // Central validation checker
  const validate = () => {
    let localErrors = {};

    if (name.trim() === "") {
      localErrors.name = "Name is required";
    } else if (name.trim().length < 3) {
      localErrors.name = "Name must be at least 3 characters long";
    }

    if (!registrationNumber || registrationNumber.trim() === "") {
      localErrors.registrationNumber = "Registration number is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (gmail.trim() === "") {
      localErrors.gmail = "Email address is required";
    } else if (!emailRegex.test(gmail)) {
      localErrors.gmail = "Please enter a valid email address";
    }

    if (stateCouncilMedical.trim() === "") {
      localErrors.stateCouncilMedical = "State Medical Council field is required";
    }

    if (password === "") {
      localErrors.password = "Password is required";
    } else if (password.length < 6) {
      localErrors.password = "Password must be at least 6 characters";
    }

    if (!certificate) {
      localErrors.certificate = "Please upload your registration certificate";
    }

    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  async function handlePage(e) {
    e.preventDefault();

    if (validate()) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("registrationNo", registrationNumber);
      formData.append("registrationDate", date);
      formData.append("password", password);
      formData.append("stateMedicalCouncil", stateCouncilMedical);
      formData.append("gmail", gmail);
      formData.append("certificate", certificate);

      try {
        setLoading(true);
        const response = await fetch(`${api}/api/doctors/createRegistration`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log(data);
        
        if (data.success) {
          toast.success(data.message || "Registration Successful!");
          navigate('/AfterRegistration');
        } else {
          toast.error(data.message || "Registration failed. Please check your details.");
        }
      } catch (error) {
        toast.error("An error occurred during registration.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCertificate(e.target.files[0]);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <Toaster position="top-right" />
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100 flex flex-col lg:flex-row">
          
          {/* Form Side */}
          <div className="w-full lg:w-7/12 p-6 sm:p-10">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#078475] bg-[#078475]/10 px-3 py-1 rounded-full">
                Doctor Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                Create Your Account
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Please enter your professional medical verification details.
              </p>
            </div>

            <form onSubmit={handlePage} className="space-y-5">
              
              {/* Row 1: Name & Reg No */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="grid-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="grid-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. John Doe"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 border ${
                        errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                      } text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#078475]/30 focus:border-[#078475] transition-all`}
                    />
                  </div>
                  {errors.name && <p className="text-rose-500 text-xs mt-1.5">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="grid-reg-no" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Registration No. <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="grid-reg-no"
                      type="text"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      placeholder="12345678"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 border ${
                        errors.registrationNumber ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                      } text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#078475]/30 focus:border-[#078475] transition-all`}
                    />
                  </div>
                  {errors.registrationNumber && <p className="text-rose-500 text-xs mt-1.5">{errors.registrationNumber}</p>}
                </div>
              </div>

              {/* Row 2: Reg Date & State Council */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="grid-date" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Registration Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="grid-date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#078475]/30 focus:border-[#078475] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="grid-council" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    State Council <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="grid-council"
                      type="text"
                      value={stateCouncilMedical}
                      onChange={(e) => setStateCouncilMedical(e.target.value)}
                      placeholder="e.g., Maharashtra Medical Council"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 border ${
                        errors.stateCouncilMedical ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                      } text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#078475]/30 focus:border-[#078475] transition-all`}
                    />
                  </div>
                  {errors.stateCouncilMedical && <p className="text-rose-500 text-xs mt-1.5">{errors.stateCouncilMedical}</p>}
                </div>
              </div>

              {/* Row 3: Email & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="grid-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="grid-email"
                      type="email"
                      value={gmail}
                      onChange={(e) => setGmail(e.target.value)}
                      placeholder="doctor@example.com"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 border ${
                        errors.gmail ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                      } text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#078475]/30 focus:border-[#078475] transition-all`}
                    />
                  </div>
                  {errors.gmail && <p className="text-rose-500 text-xs mt-1.5">{errors.gmail}</p>}
                </div>

                <div>
                  <label htmlFor="grid-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="grid-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 border ${
                        errors.password ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                      } text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#078475]/30 focus:border-[#078475] transition-all`}
                    />
                  </div>
                  {errors.password && <p className="text-rose-500 text-xs mt-1.5">{errors.password}</p>}
                </div>
              </div>

              {/* Certificate Upload Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Registration Certificate (PDF/JPG) <span className="text-rose-500">*</span>
                </label>
                
                <div className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                  errors.certificate 
                    ? 'border-rose-300 bg-rose-50/30' 
                    : certificate 
                    ? 'border-[#078475] bg-[#078475]/5' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {certificate ? (
                    <div className="flex items-center justify-center gap-2 text-[#078475]">
                      <FileText className="w-5 h-5" />
                      <span className="text-sm font-medium truncate max-w-xs">{certificate.name}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-1">
                      <Upload className="w-6 h-6 text-slate-400 mb-1" />
                      <p className="text-xs text-slate-600 font-medium">
                        Click or drag to upload your registration document
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">PDF, PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
                {errors.certificate && <p className="text-rose-500 text-xs mt-1.5">{errors.certificate}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#078475] hover:bg-[#05685c] text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-[#078475]/20 hover:shadow-xl hover:shadow-[#078475]/30 focus:outline-none focus:ring-2 focus:ring-[#078475] focus:ring-offset-2 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-[#078475] hover:underline">
                Sign in to your account
              </Link>
            </p>
          </div>

          {/* Graphic Side */}
          <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-[#078475] to-[#044c43] p-10 flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-2">
                Join our Verified Network
              </h2>
              <p className="text-emerald-100/80 text-sm leading-relaxed">
                Connect with thousands of healthcare professionals and manage your medical practice efficiently.
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-center my-6">
              <img 
                className="w-full max-w-sm object-contain drop-shadow-2xl rounded-lg" 
                src="https://files.catbox.moe/5qx18f.png" 
                alt="Medical registration illustration" 
              />
            </div>

            <div className="relative z-10 text-xs text-emerald-100/60 flex items-center justify-between border-t border-white/10 pt-4">
              <span>Encrypted & Secure</span>
              <span>Healthcare Portal</span>
            </div>

            {/* Background decoration circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />
          </div>

        </div>
      </main>
    </div>
  );
};

export default RegistrationForm;
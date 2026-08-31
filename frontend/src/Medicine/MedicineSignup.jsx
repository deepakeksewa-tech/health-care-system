import React, { useState } from 'react'
import Logo from '../assets/Logo.png'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Phone, Lock, Eye, EyeOff, Store, CheckCircle2 } from 'lucide-react'

const MedicineSignup = () => {
  const api = import.meta.env.VITE_API_URL
  const navigate = useNavigate()

  // Form State
  const [gmail, setGmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [shopName, setShopName] = useState('')
  const [contact, setContact] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Verification States (Reset to initial default states)
  const [emailOtpSent, setEmailOtpSent] = useState(false)
  const [emailOtp, setEmailOtp] = useState('')
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  const [phoneOtpSent, setPhoneOtpSent] = useState(false)
  const [phoneOtp, setPhoneOtp] = useState('')
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)
  const [phoneLoading, setPhoneLoading] = useState(false)

  // Validation Error State
  const [errors, setErrors] = useState({})

  // Field-level Validation Function
  const validate = () => {
    const newErrors = {}

    if (!name.trim()) {
      newErrors.name = 'Full name is required.'
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters long.'
    }

    if (!shopName.trim()) {
      newErrors.shopName = 'Shop name is required.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!gmail.trim()) {
      newErrors.gmail = 'Email address is required.'
    } else if (!emailRegex.test(gmail)) {
      newErrors.gmail = 'Please enter a valid email address.'
    } else if (!isEmailVerified) {
      newErrors.gmail = 'Please verify your email address.'
    }

    const phoneRegex = /^[0-9]{10}$/
    if (!contact.trim()) {
      newErrors.contact = 'Phone number is required.'
    } else if (!phoneRegex.test(contact.replace(/\s+/g, ''))) {
      newErrors.contact = 'Please enter a valid 10-digit phone number.'
    } else if (!isPhoneVerified) {
      newErrors.contact = 'Please verify your phone number.'
    }

    if (!password) {
      newErrors.password = 'Password is required.'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle Static Send Email OTP
  const handleSendEmailOtp = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!gmail.trim() || !emailRegex.test(gmail)) {
      setErrors(prev => ({ ...prev, gmail: 'Enter a valid email first.' }))
      return
    }

    setEmailLoading(true)
    setTimeout(() => {
      setEmailOtpSent(true)
      setEmailLoading(false)
      toast.success('Static OTP sent to email! (Use: 123456)')
    }, 600)
  }

  // Handle Static Verify Email OTP
  const handleVerifyEmailOtp = () => {
    if (!emailOtp) {
      toast.error('Enter the email verification code.')
      return
    }

    if (emailOtp === '123456') {
      setIsEmailVerified(true)
      toast.success('Email verified successfully!')
    } else {
      toast.error('Invalid OTP. Use static code: 123456')
    }
  }

  // Handle Static Send Phone OTP
  const handleSendPhoneOtp = () => {
    const phoneRegex = /^[0-9]{10}$/
    if (!contact.trim() || !phoneRegex.test(contact)) {
      setErrors(prev => ({ ...prev, contact: 'Enter a valid 10-digit number first.' }))
      return
    }

    setPhoneLoading(true)
    setTimeout(() => {
      setPhoneOtpSent(true)
      setPhoneLoading(false)
      toast.success('Static OTP sent to phone! (Use: 123456)')
    }, 600)
  }

  // Handle Static Verify Phone OTP
  const handleVerifyPhoneOtp = () => {
    if (!phoneOtp) {
      toast.error('Enter the phone verification code.')
      return
    }

    if (phoneOtp === '123456') {
      setIsPhoneVerified(true)
      toast.success('Phone number verified successfully!')
    } else {
      toast.error('Invalid OTP. Use static code: 123456')
    }
  }

  async function handleSignup(e) {
    e.preventDefault()

    if (!validate()) {
      toast.error('Please fix the errors and complete verifications.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${api}/api/Patient/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gmail,
          name,
          shopName,
          contact,
          password,
        }),
      })

      const data = await response.json()

      if (data.success || data.succes) {
        toast.success(data.message || 'Signup successful!')
        setTimeout(() => {
          navigate('/patient/login')
        }, 1200)
      } else {
        toast.error(data.message || 'Signup failed. Please try again.')
        setLoading(false)
      }
    } catch (error) {
      toast.error('Network error. Please check your connection.')
      console.error('Signup error:', error)
      setLoading(false)
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
          alt="Medicine Ordering for patient"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        <div className="relative z-10 px-12 text-white max-w-lg space-y-4">
          <span className="bg-white/10 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border border-white/20">
            Medicine Seller Registration
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
            Begin Your Journey to Better Health.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Create an account to get orders, store digital health records, and connect directly with certified users.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
          
          {/* Logo Heading */}
          <div className="space-y-2 text-center">
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
              Create a Medicine Seller Account
            </h1>
            <p className="text-xs text-slate-500">
              Enter your personal details and verify to register.
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} noValidate className="space-y-4">
            
            {/* Full Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) setErrors({ ...errors, name: null })
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                    errors.name ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#058b7c]/20 focus:border-[#058b7c]'
                  }`}
                  type="text"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Shop Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Shop Name</label>
              <div className="relative">
                <Store className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  value={shopName}
                  onChange={(e) => {
                    setShopName(e.target.value)
                    if (errors.shopName) setErrors({ ...errors, shopName: null })
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                    errors.shopName ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#058b7c]/20 focus:border-[#058b7c]'
                  }`}
                  type="text"
                  placeholder="Apothecary Pharmacy"
                />
              </div>
              {errors.shopName && <p className="text-red-500 text-xs mt-1">{errors.shopName}</p>}
            </div>

            {/* Email Input with Verification */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Email Address</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                  <input
                    value={gmail}
                    disabled={isEmailVerified}
                    onChange={(e) => {
                      setGmail(e.target.value)
                      if (errors.gmail) setErrors({ ...errors, gmail: null })
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                      errors.gmail ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#058b7c]/20 focus:border-[#058b7c]'
                    } ${isEmailVerified ? 'bg-emerald-50/50 border-emerald-300 text-emerald-800' : ''}`}
                    type="email"
                    placeholder="name@example.com"
                  />
                </div>
                {!isEmailVerified ? (
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    disabled={emailLoading}
                    className="px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-all shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {emailLoading ? 'Sending...' : emailOtpSent ? 'Resend' : 'Verify'}
                  </button>
                ) : (
                  <div className="flex items-center px-3 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold gap-1">
                    <CheckCircle2 size={14} /> Verified
                  </div>
                )}
              </div>
              {errors.gmail && <p className="text-red-500 text-xs mt-1">{errors.gmail}</p>}

              {/* Email OTP Input Box */}
              {emailOtpSent && !isEmailVerified && (
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      placeholder="Enter static OTP: 123456"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-[#058b7c]"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyEmailOtp}
                      className="px-4 bg-[#058b7c] hover:bg-[#047266] text-white text-xs font-medium rounded-xl transition-all shrink-0 cursor-pointer"
                    >
                      Confirm
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400">Hint: Use code 123456</span>
                </div>
              )}
            </div>

            {/* Contact Input with Verification */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Phone Number</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                  <input
                    value={contact}
                    disabled={isPhoneVerified}
                    onChange={(e) => {
                      setContact(e.target.value)
                      if (errors.contact) setErrors({ ...errors, contact: null })
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                      errors.contact ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#058b7c]/20 focus:border-[#058b7c]'
                    } ${isPhoneVerified ? 'bg-emerald-50/50 border-emerald-300 text-emerald-800' : ''}`}
                    type="tel"
                    placeholder="9876543210"
                  />
                </div>
                {!isPhoneVerified ? (
                  <button
                    type="button"
                    onClick={handleSendPhoneOtp}
                    disabled={phoneLoading}
                    className="px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-all shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {phoneLoading ? 'Sending...' : phoneOtpSent ? 'Resend' : 'Verify'}
                  </button>
                ) : (
                  <div className="flex items-center px-3 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold gap-1">
                    <CheckCircle2 size={14} /> Verified
                  </div>
                )}
              </div>
              {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}

              {/* Phone OTP Input Box */}
              {phoneOtpSent && !isPhoneVerified && (
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value)}
                      placeholder="Enter static OTP: 123456"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-[#058b7c]"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyPhoneOtp}
                      className="px-4 bg-[#058b7c] hover:bg-[#047266] text-white text-xs font-medium rounded-xl transition-all shrink-0 cursor-pointer"
                    >
                      Confirm
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400">Hint: Use code 123456</span>
                </div>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: null })
                  }}
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                    errors.password ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#058b7c]/20 focus:border-[#058b7c]'
                  }`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#058b7c] hover:bg-[#047266] text-white font-semibold py-3 rounded-xl transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/medicine/login" className="text-[#058b7c] font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicineSignup
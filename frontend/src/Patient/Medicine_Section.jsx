import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Settings, 
  Upload, 
  FileText, 
  Pill, 
  Stethoscope, 
  Baby, 
  Leaf, 
  Trash2, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  User, 
  SlidersHorizontal,
  PackageCheck,
  MapPin,
  PhoneCall,
  Check
} from 'lucide-react';

export default function Medicine_Section() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Prescription Flow States
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [patientDetails, setPatientDetails] = useState({ name: '', phone: '', address: '' });
  const [prescriptionSubmitted, setPrescriptionSubmitted] = useState(false);
  // Checkout Success State
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    expressDelivery: true,
    currency: 'INR (₹)'
  });
  const logoUrl = "https://files.catbox.moe/mijo7f.png";
  const products = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      category: 'Prescription Rx',
      salt: 'Panadol / Crocin',
      price: 35,
      mrp: 45,
      discount: '22% OFF',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
      tag: 'Best Seller'
    },
    {
      id: 2,
      name: 'Azithromycin 500mg',
      category: 'Prescription Rx',
      salt: 'Zithromax (3 Tablets)',
      price: 120,
      mrp: 140,
      discount: '15% OFF',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80',
      tag: 'Doctor Recommended'
    },
    {
      id: 3,
      name: 'Digital Blood Pressure Monitor',
      category: 'Healthcare Devices',
      salt: 'Omron Automatic Upper Arm',
      price: 1499,
      mrp: 1999,
      discount: '25% OFF',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=80',
      tag: '2 Year Warranty'
    },
    {
      id: 4,
      name: 'Multivitamin Immunity Capsules',
      category: 'OTC & Wellness',
      salt: 'Zinc, Ginseng & Vitamin C (60 Caps)',
      price: 450,
      mrp: 599,
      discount: '25% OFF',
      image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&auto=format&fit=crop&q=80',
      tag: 'Popular'
    },
    {
      id: 5,
      name: 'Baby Gentle Soft Bath Soap',
      category: 'Baby Care',
      salt: 'Hypoallergenic Organic Formula',
      price: 180,
      mrp: 200,
      discount: '10% OFF',
      image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80',
      tag: 'Organic'
    },
    {
      id: 6,
      name: 'Ayurvedic Chyawanprash',
      category: 'Ayurvedic',
      salt: 'Amla & Herbal Immunity Booster (500g)',
      price: 350,
      mrp: 400,
      discount: '12% OFF',
      image: 'https://images.unsplash.com/photo-1608248597359-f55c8227b3ac?w=500&auto=format&fit=crop&q=80',
      tag: 'Pure Herbs'
    }
  ];
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.salt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  // Handle Prescription Upload Trigger
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPrescriptionFile(e.target.files[0]);
      setIsPrescriptionModalOpen(true);
    }
  };
  // Submit Prescription to Pharmacist
  const handlePrescriptionSubmit = (e) => {
    e.preventDefault();
    setPrescriptionSubmitted(true);
    // Automatically add a consultation or prescription fulfillment item to cart
    const rxItem = {
      id: 999,
      name: 'Prescription Based Medicines (Reviewing)',
      category: 'Prescription Rx',
      salt: 'Doctor Verified Order',
      price: 0,
      mrp: 0,
      discount: 'FREE REVIEW',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
      tag: 'Rx Verified'
    };
    if (!cart.some(item => item.id === 999)) {
      setCart([...cart, { ...rxItem, qty: 1 }]);
    }
  };
  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen font-sans selection:bg-teal-600 selection:text-white relative">
        {/* 1. PROFESSIONAL TOP NAVBAR */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setSelectedCategory('All')}>
            <img src={logoUrl} alt="MED SEWA Logo" className="h-10 w-auto object-contain hover:opacity-90 transition-opacity" />
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-xl mx-8 relative">
            <Search className="absolute left-4 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search medicines, salt compositions, or health devices..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white py-2.5 pl-11 pr-4 rounded-full text-sm border border-transparent focus:border-teal-500 focus:outline-none transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors relative group"
              title="Preferences & Settings"
            >
              <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            </button>

            <button className="hidden sm:flex items-center space-x-2 p-1.5 pr-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700">
              <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold">Account</span>
            </button>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg relative"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wide">Cart</span>
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-md border-2 border-white animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>
      {/* 2. HERO BANNER & INTERACTIVE PRESCRIPTION UPLOAD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-gradient-to-br from-teal-800 via-teal-700 to-teal-600 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
          <div className="absolute right-32 -bottom-20 w-80 h-80 rounded-full bg-teal-500/20 pointer-events-none"></div>
          <div className="max-w-xl mb-8 md:mb-0 relative z-10">
            <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md text-white text-xs font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Express Delivery in 30 Mins</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              Genuine Medicines & Healthcare Delivered Fast.
            </h1>
            <p className="text-teal-100 text-sm md:text-base leading-relaxed mb-6">
              Upload your doctor's prescription and let our licensed pharmacists handle everything securely, or browse verified pharmacy stocks instantly.
            </p>
            <div className="flex items-center space-x-6 text-xs text-teal-200 font-medium">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>100% Verified Drugs</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-amber-300" />
                <span>24/7 Pharmacist Support</span>
              </span>
            </div>
          </div>
          <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-2xl w-full md:w-96 border border-slate-100 text-center relative z-10">
            <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-xs">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg mb-1 text-slate-800">Order via Prescription</h3>
            <p className="text-xs text-slate-500 mb-6">Snap a photo of your prescription and let us arrange medicines.</p>
            
            <label className="block w-full font-semibold py-3.5 px-4 rounded-xl cursor-pointer shadow-md bg-teal-600 hover:bg-teal-700 text-white shadow-teal-200 transition-all text-sm">
              <div className="flex items-center justify-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload Prescription</span>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*,application/pdf"
                onChange={handleFileChange} 
              />
            </label>
          </div>
        </div>
      </section>
      {/* 3. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Browse by Category</h2>
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Select to filter</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { name: 'All', icon: SlidersHorizontal },
            { name: 'Prescription Rx', icon: Pill },
            { name: 'OTC & Wellness', icon: PackageCheck },
            { name: 'Baby Care', icon: Baby },
            { name: 'Healthcare Devices', icon: Stethoscope },
            { name: 'Ayurvedic', icon: Leaf },
          ].map((cat, index) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.name;
            return (
              <div 
                key={index} 
                onClick={() => setSelectedCategory(cat.name)}
                className={`p-5 rounded-2xl border transition-all text-center cursor-pointer group flex flex-col items-center justify-center ${isSelected ? 'bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-600/20 scale-[1.02]' : 'bg-white border-slate-200/70 hover:border-teal-400 shadow-xs hover:shadow-md'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${isSelected ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white'}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-xs md:text-sm tracking-tight">{cat.name}</h4>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PRODUCT LISTING SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 mb-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            {selectedCategory === 'All' ? 'Popular Medicines & Health Supplies' : selectedCategory}
          </h2>
          <span className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-bold">
            {filteredProducts.length} items available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="relative h-48 rounded-xl overflow-hidden bg-slate-100 mb-4">
                  <span className="absolute top-3 left-3 z-10 text-[10px] font-black bg-rose-500 text-white px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {product.discount}
                  </span>
                  <span className="absolute top-3 right-3 z-10 text-[10px] font-bold bg-white/95 backdrop-blur-sm text-slate-700 px-2.5 py-1 rounded-md shadow-xs">
                    {product.tag}
                  </span>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-base mb-1 text-slate-800 tracking-tight">{product.name}</h3>
                <p className="text-xs text-slate-400 mb-4 font-medium">Composition: <span className="text-slate-600 font-semibold">{product.salt}</span></p>
              </div>

              <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-teal-700 text-lg">₹{product.price}</span>
                    <span className="text-xs text-slate-400 line-through font-medium">₹{product.mrp}</span>
                  </div>
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shadow-xs"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PRESCRIPTION VERIFICATION & PATIENT DETAILS MODAL (NEXT STEP AFTER UPLOAD) */}
      {isPrescriptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsPrescriptionModalOpen(false)}></div>
          
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative z-10 border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-800">Prescription Verification</h3>
                  <p className="text-xs text-slate-400">Step 2 of Order Placement</p>
                </div>
              </div>
              <button onClick={() => setIsPrescriptionModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {prescriptionSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-xl text-slate-800">Prescription Sent for Pharmacist Review!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Our licensed pharmacist is reviewing your prescription. We have added the consultation request to your cart.
                </p>
                <button 
                  onClick={() => { setIsPrescriptionModalOpen(false); setIsCartOpen(true); }}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl text-sm shadow-md transition-all inline-flex items-center space-x-2"
                >
                  <span>View Cart & Proceed</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handlePrescriptionSubmit} className="py-6 space-y-4">
                <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-xs font-bold text-xs uppercase">
                    File
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs text-slate-800 truncate">{prescriptionFile?.name || 'prescription.pdf'}</p>
                    <p className="text-[11px] text-teal-700 font-medium">Ready for doctor review</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={patientDetails.name}
                    onChange={(e) => setPatientDetails({...patientDetails, name: e.target.value})}
                    className="w-full bg-slate-100 border border-slate-200 py-2.5 px-4 rounded-xl text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number</label>
                  <div className="relative">
                    <PhoneCall className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 98765 43210"
                      value={patientDetails.phone}
                      onChange={(e) => setPatientDetails({...patientDetails, phone: e.target.value})}
                      className="w-full bg-slate-100 border border-slate-200 py-2.5 pl-10 pr-4 rounded-xl text-sm focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <textarea 
                      required
                      rows="2"
                      placeholder="House No, Street, Landmark, Pincode"
                      value={patientDetails.address}
                      onChange={(e) => setPatientDetails({...patientDetails, address: e.target.value})}
                      className="w-full bg-slate-100 border border-slate-200 py-2.5 pl-10 pr-4 rounded-xl text-sm focus:outline-none focus:border-teal-500 resize-none"
                    ></textarea>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                  <button 
                    type="button"
                    onClick={() => setIsPrescriptionModalOpen(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-5 rounded-xl text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md transition-all flex items-center space-x-1.5"
                  >
                    <span>Send to Pharmacist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* 6. SLIDE-OVER CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={() => setIsCartOpen(false)}></div>   
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">              
             <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Your Cart ({totalItemsCount})</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 flex-grow overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-24 text-slate-400">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-3 text-slate-200" />
                    <p className="font-bold text-base text-slate-700">Your cart is empty</p>
                    <p className="text-xs text-slate-400 mt-1">Add medicines or upload prescription</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 shadow-xs">
                        <div className="flex items-center space-x-3">
                          <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-slate-200" />
                          <div>
                            <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">Qty: {item.qty}</p>
                            <p className="text-xs text-teal-700 font-extrabold mt-1">₹{item.price * item.qty}</p>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50">
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Subtotal</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Express Delivery</span>
                      <span className="text-emerald-600 font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-base font-extrabold text-slate-900">
                      <span>Total Amount:</span>
                      <span className="text-teal-700 text-xl">₹{totalPrice}</span>
                    </div>
                  </div>
                  {checkoutSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center text-xs font-bold space-y-1">
                      <div className="flex items-center justify-center space-x-1 text-emerald-700 font-extrabold text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Order Placed Successfully!</span>
                      </div>
                      <p className="text-[11px] text-emerald-600 font-normal">Our delivery partner is dispatching your order (ETA: 30 mins).</p>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setCheckoutSuccess(true)}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-600/30 transition-all text-sm flex items-center justify-center space-x-2"
                    >
                      <span>Proceed to Secure Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* 7. SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsSettingsOpen(false)}></div>      
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative z-10 border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-800">Preferences & Settings</h3>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Push Notifications</h4>
                  <p className="text-xs text-slate-400">Receive order updates & refill reminders</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.notifications} 
                  onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                  className="w-5 h-5 accent-teal-600 rounded cursor-pointer" 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Express 30-Min Delivery Priority</h4>
                  <p className="text-xs text-slate-400">Prioritize dispatch for emergency medicines</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.expressDelivery} 
                  onChange={(e) => setSettings({...settings, expressDelivery: e.target.checked})}
                  className="w-5 h-5 accent-teal-600 rounded cursor-pointer" 
                />
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Preferred Currency</h4>
                  <p className="text-xs text-slate-400">Default store pricing format</p>
                </div>
                <select 
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold py-2 px-3 rounded-xl focus:outline-none focus:border-teal-500"
                >
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md transition-all"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
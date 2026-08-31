import React, { useState } from 'react';
import Logo from '../assets/Logo.png'
import { 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  UploadCloud, 
  X, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Truck, 
  PackageCheck, 
  Plus, 
  Search, 
  FileText,
  MapPin,
  ShieldCheck
} from 'lucide-react';

const Medicine_Section = () => {
  // Indian Medicine Catalog (INR Prices)
  const catalog = [
    { id: 1, name: 'Dolo 650mg Tablet', type: 'Strip of 15 tablets (Paracetamol)', price: 34.00 },
    { id: 2, name: 'Augmentin 625 Duo Tablet', type: 'Strip of 10 tablets (Amoxycillin + Clavulanic)', price: 205.00 },
    { id: 3, name: 'Pan-D Capsule', type: 'Strip of 15 capsules (Pantoprazole + Domperidone)', price: 198.00 },
    { id: 4, name: 'Allegra 120mg Tablet', type: 'Strip of 10 tablets (Fexofenadine)', price: 145.00 },
    { id: 5, name: 'Benadryl Cough Syrup (100ml)', type: 'Bottle (Diphenhydramine)', price: 125.00 },
    { id: 6, name: 'Combiflam Tablet', type: 'Strip of 20 tablets (Ibuprofen + Paracetamol)', price: 42.00 },
  ];

  // Carousel State
  const slides = [
    {
      title: 'Doorstep Medicine Delivery Across India',
      subtitle: 'Upload valid prescriptions from verified MBBS doctors or select standard OTC medicines.',
      bg: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80',
    },
    {
      title: '100% Genuine & Discounted Medicines',
      subtitle: 'Verified by registered pharmacists under D&C Act guidelines within 15 minutes.',
      bg: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1600&q=80',
    },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  // Form & Cart States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [patientDetails, setPatientDetails] = useState({
    fullName: '',
    address: '',
    phone: '',
    pincode: '',
    customNotes: '',
    prescriptionImage: null,
    previewUrl: null,
  });

  // Recent Orders State
  const [recentOrders, setRecentOrders] = useState([
    {
      id: 'MS-IN-9042',
      items: 'Dolo 650mg Tablet, Benadryl Cough Syrup (100ml)',
      date: '24 Aug, 2026',
      total: '₹159.00',
      status: 'Dispatched',
    },
    {
      id: 'MS-IN-8831',
      items: 'Prescription Order (Verified by Pharmacist)',
      date: '18 Aug, 2026',
      total: '₹480.00',
      status: 'Delivered',
    },
  ]);

  // Handlers
  const handleAddItem = (item) => {
    if (!selectedItems.find((i) => i.id === item.id)) {
      setSelectedItems([...selectedItems, { ...item, qty: 1 }]);
    }
  };

  const handleRemoveItem = (id) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPatientDetails({
        ...patientDetails,
        prescriptionImage: file,
        previewUrl: URL.createObjectURL(file),
      });
    }
  };

  const handleRemoveImage = () => {
    setPatientDetails({
      ...patientDetails,
      prescriptionImage: null,
      previewUrl: null,
    });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!patientDetails.fullName || !patientDetails.phone || !patientDetails.address || !patientDetails.pincode) {
      alert('Please fill in your name, 10-digit mobile number, full address, and PIN code.');
      return;
    }

    if (patientDetails.phone.length < 10) {
      alert('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (selectedItems.length === 0 && !patientDetails.customNotes && !patientDetails.prescriptionImage) {
      alert('Please select medicines, attach a prescription photo, or mention required medicines in the text area.');
      return;
    }

    const calculatedTotal = selectedItems.reduce((acc, curr) => acc + curr.price, 0);

    const newOrder = {
      id: `MS-IN-${Math.floor(1000 + Math.random() * 9000)}`,
      items: selectedItems.length > 0 
        ? selectedItems.map((i) => i.name).join(', ') 
        : patientDetails.customNotes 
        ? patientDetails.customNotes.slice(0, 35) + '...'
        : 'Uploaded Prescription Order',
      date: 'Today',
      total: calculatedTotal > 0 ? `₹${calculatedTotal.toFixed(2)}` : 'Bill Pending Verification',
      status: 'Processing',
    };

    setRecentOrders([newOrder, ...recentOrders]);
    setSelectedItems([]);
    setPatientDetails({
      fullName: '',
      address: '',
      phone: '',
      pincode: '',
      customNotes: '',
      prescriptionImage: null,
      previewUrl: null,
    });

    alert(`Order ${newOrder.id} successfully placed! A registered pharmacist will contact you shortly.`);
  };

  const filteredCatalog = catalog.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-16">
      {/* Top Navbar */}
        {/* Updated Inline Header */}
         <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex items-center justify-between h-16">
           
           {/* Left Side: Clickable Logo & MED SEWA Brand */}
           <div 
             className="flex items-center cursor-pointer select-none group"
           >
             <img className="h-10 w-10 sm:h-12 sm:w-12 object-contain transition-transform group-hover:scale-105" src={Logo} alt="logo" />
             <span className="font-bold text-xl sm:text-2xl ml-2 sm:ml-3">
               <span className="text-[#058b7c]">MED</span> SEWA
             </span>
           </div>
     
           {/* Right Side: Back to Dashboard + Logout Button */}
           <div className="flex items-center gap-2 sm:gap-3">
             
             {/* Back to Dashboard Button */}
        
     
             {/* Direct Logout Button */}
             <button
               className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
               title="Log out of your account"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
               </svg>
               <span>Logout</span>
             </button>
     
           </div>
     
         </div>
       </div>
     </header>

      {/* Hero Banner Carousel */}
      <section className="max-w-7xl mx-auto px-6 pt-6">
        <div className="relative rounded-2xl overflow-hidden shadow-lg h-64 md:h-72 group">
          <img
            src={slides[currentSlide].bg}
            alt="Medical Services"
            className="w-full h-full object-cover object-center transition-all duration-700 brightness-[0.4]"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14 text-white max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-[#007E60]/80 text-[11px] font-semibold px-2.5 py-1 rounded-md w-fit mb-2 backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Indian Pharmacy Network</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
              {slides[currentSlide].title}
            </h2>
            <p className="text-xs md:text-sm text-slate-200 font-normal">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          {/* Carousel Arrows */}
          <button
            onClick={() => setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === i ? 'w-6 bg-[#007E60]' : 'w-2 bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3-Step Indian Medicine Order Section */}
      <section id="order" className="max-w-7xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Step 1: Search & Pick Common Medicines */}
            <div className="lg:col-span-4 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 pb-6 lg:pb-0 lg:pr-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-[#007E60] text-white text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="font-bold text-slate-900 text-sm tracking-wide uppercase">Select Generic / OTC Medicines</h3>
              </div>

              {/* Search Bar */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Dolo, Pan-D, Allegra, etc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#007E60] focus:ring-1 focus:ring-[#007E60] transition"
                />
              </div>

              {/* Catalog List */}
              <div className="space-y-2 overflow-y-auto max-h-80 pr-1">
                {filteredCatalog.map((med) => (
                  <div
                    key={med.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{med.name}</h4>
                      <p className="text-[11px] text-slate-500">{med.type}</p>
                      <span className="text-xs font-bold text-[#007E60]">₹{med.price.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => handleAddItem(med)}
                      className="flex items-center gap-1 bg-[#007E60] hover:bg-[#00664e] text-white text-xs font-semibold px-2.5 py-1.5 rounded-md transition shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Patient Info & Prescription Upload */}
            <div className="lg:col-span-5 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 pb-6 lg:pb-0 lg:pr-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-[#007E60] text-white text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="font-bold text-slate-900 text-sm tracking-wide uppercase">Patient Info & Doctor Prescription</h3>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Patient Full Name *"
                  value={patientDetails.fullName}
                  onChange={(e) => setPatientDetails({ ...patientDetails, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#007E60] focus:ring-1 focus:ring-[#007E60]"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-slate-400 font-medium">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit Phone *"
                      value={patientDetails.phone}
                      onChange={(e) => setPatientDetails({ ...patientDetails, phone: e.target.value.replace(/\D/g, '') })}
                      className="w-full pl-11 pr-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#007E60] focus:ring-1 focus:ring-[#007E60]"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="6-digit PIN Code *"
                      value={patientDetails.pincode}
                      onChange={(e) => setPatientDetails({ ...patientDetails, pincode: e.target.value.replace(/\D/g, '') })}
                      className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#007E60] focus:ring-1 focus:ring-[#007E60]"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Flat / House No, Street, City, State *"
                  value={patientDetails.address}
                  onChange={(e) => setPatientDetails({ ...patientDetails, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#007E60] focus:ring-1 focus:ring-[#007E60]"
                />

                {/* Prescription Box & Manual Notes */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {/* Upload Image */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Upload Rx (Prescription)</label>
                    {!patientDetails.previewUrl ? (
                      <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-300 rounded-lg p-3 cursor-pointer hover:border-[#007E60] hover:bg-[#007E60]/5 transition text-center">
                        <UploadCloud className="w-6 h-6 text-[#007E60] mb-1" />
                        <span className="text-[11px] font-semibold text-slate-700">Attach Photo</span>
                        <span className="text-[9px] text-slate-400">JPG, PNG (Max 5MB)</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    ) : (
                      <div className="relative h-28 border border-slate-200 rounded-lg overflow-hidden bg-slate-100">
                        <img
                          src={patientDetails.previewUrl}
                          alt="Prescription Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full hover:bg-rose-700 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Specify Medicines / Doctor Notes */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Custom Notes / Dosages</label>
                    <textarea
                      rows={4}
                      placeholder="Type medicine names or dosage notes..."
                      value={patientDetails.customNotes}
                      onChange={(e) => setPatientDetails({ ...patientDetails, customNotes: e.target.value })}
                      className="w-full h-28 p-2.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#007E60] focus:ring-1 focus:ring-[#007E60] resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Order Summary & Placement */}
            <div className="lg:col-span-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[#007E60] text-white text-xs font-bold flex items-center justify-center">3</span>
                  <h3 className="font-bold text-slate-900 text-sm tracking-wide uppercase">Order Summary</h3>
                </div>

                {/* Selected Item List */}
                <div className="space-y-2 mb-4 max-h-44 overflow-y-auto pr-1">
                  {selectedItems.length === 0 && !patientDetails.prescriptionImage && !patientDetails.customNotes && (
                    <p className="text-xs text-slate-400 italic">No medicines added to cart yet.</p>
                  )}

                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs bg-slate-50 p-2 rounded-md border border-slate-100">
                      <div>
                        <p className="font-semibold text-slate-800">{item.name}</p>
                        <p className="text-[10px] text-[#007E60] font-medium">₹{item.price.toFixed(2)}</p>
                      </div>
                      <button onClick={() => handleRemoveItem(item.id)} className="text-slate-400 hover:text-rose-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {patientDetails.prescriptionImage && (
                    <div className="flex items-center gap-2 text-xs bg-emerald-50 text-[#007E60] p-2 rounded-md border border-emerald-100">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="font-medium">Prescription Photo Attached</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Calculation & Action */}
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>Estimated Total:</span>
                  <span className="text-[#007E60] text-base">
                    ₹{selectedItems.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  * Final pricing of prescription items will be sent via SMS/WhatsApp after verification.
                </p>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="w-full bg-[#007E60] hover:bg-[#00664e] text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wider transition shadow-md shadow-[#007E60]/20 flex items-center justify-center gap-2"
                >
                  <PackageCheck className="w-4 h-4" />
                  Place Order Now
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Indian Delivery Tracker */}
      <section id="history" className="max-w-7xl mx-auto px-6 mt-10">
        <h3 className="text-base font-bold text-slate-900 mb-4">Track Recent Orders</h3>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-200">
            {recentOrders.map((ord) => (
              <div key={ord.id} className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-sm text-slate-900">{ord.id}</span>
                    <span className="text-xs text-slate-400">• {ord.date}</span>
                  </div>
                  <p className="text-xs text-slate-600">{ord.items}</p>
                  <p className="text-xs font-bold text-[#007E60] mt-1">Amount: {ord.total}</p>
                </div>

                {/* Progress Status */}
                <div className="flex items-center gap-2 sm:gap-4 text-xs font-medium">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                    ord.status === 'Processing' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>Rx Verification</span>
                  </div>

                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                    ord.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Truck className="w-3.5 h-3.5" />
                    <span>Out for Delivery</span>
                  </div>

                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                    ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Delivered</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Medicine_Section;
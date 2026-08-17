import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/Logo.png'

const PatientDashboard = () => {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [bookingDetails, setBookingDetails] = useState([])

  // Helper function: Time string (e.g. "09:30 AM - 10:00 AM") to start time in minutes
  const parseSlotToMinutes = (slotTime) => {
    if (!slotTime) return 0;
    const startTimeStr = slotTime.split('-')[0]?.trim();
    if (!startTimeStr) return 0;

    const cleanStr = startTimeStr.toUpperCase();
    const isPM = cleanStr.includes('PM');
    const isAM = cleanStr.includes('AM');
    const formatted = cleanStr.replace(/(AM|PM)/g, '').trim();
    let [hours, minutes] = formatted.split(':').map(Number);
    
    if (isNaN(hours)) hours = 0;
    if (isNaN(minutes)) minutes = 0;
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  async function getDetails() {
    try {
      const response = await fetch(`http://localhost:8000/api/patient/get/bookingDetails`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json"
        }
      })
      const data = await response.json()

      if (data.success && Array.isArray(data.data)) {
        // Sort appointments by Date & Time ascending
        const sortedBookings = [...data.data].sort((a, b) => {
          const dateA = new Date(a.bookingDate).setHours(0, 0, 0, 0);
          const dateB = new Date(b.bookingDate).setHours(0, 0, 0, 0);

          if (dateA !== dateB) {
            return dateA - dateB;
          }

          return parseSlotToMinutes(a.slotTime) - parseSlotToMinutes(b.slotTime);
        });

        setBookingDetails(sortedBookings);
      }
    } catch (error) {
      console.log("Error fetching booking details:", error)
    }
  }

  useEffect(() => {
    getDetails()
  }, [])

  // Direct Logout Handler (No alert confirmation)
  const handleLogout = () => {
    localStorage.clear();
    navigate('/Patient/Login');
  };

  // Click on MED SEWA logo to go back to dashboard
  const handleHomeRedirect = () => {
    navigate('/Patient/dashboard'); // Apne exact dashboard path ke according change kar sakte ho
  };

 

  // Healthcare-themed carousel slides
  const slides = [
    {
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      title: 'Advanced Medical Technology',
    },
    {
      url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
      title: 'Expert Doctor Consultation',
    },
    {
      url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      title: 'Patient-Centered Healthcare',
    },
    {
      url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
      title: 'Comprehensive Lab Testing',
    },
    {
      url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
      title: 'Doorstep Pharmacy Delivery',
    },
  ]

  const gotoDoctorSearch = () => {
    navigate('/Patient/DoctorList')
  }

  // Auto-advance carousel every 3 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === slides.length - 1 ? 0 : prevSlide + 1
      )
    }, 3000)

    return () => clearInterval(slideInterval)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

 const handleGoToDashboard = () => {
  navigate('/Patient/Dashboard');
};
  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      
      {/* Updated Inline Header */}
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      
      {/* Left Side: Clickable Logo & MED SEWA Brand */}
      <div 
        onClick={handleHomeRedirect} 
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
          onClick={handleLogout}
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
      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 space-y-8">
        
        {/* Healthcare Carousel */}
        <div id="default-carousel" className="relative w-full overflow-hidden rounded-2xl shadow-lg bg-gray-900 h-60 md:h-96">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.url}
                className="absolute block w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                alt={slide.title}
              />
              <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                <p className="text-white text-lg md:text-2xl font-bold drop-shadow">
                  {slide.title}
                </p>
              </div>
            </div>
          ))}

          {/* Previous & Next Controls */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition cursor-pointer"
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition cursor-pointer"
          >
            &#10095;
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white w-6' : 'bg-white/50 w-3'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Booking Details Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Your Appointments</h2>
            {bookingDetails.length > 3 && (
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Scroll right →
              </span>
            )}
          </div>

          {bookingDetails.length > 0 ? (
            <div className="flex space-x-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300">
              {bookingDetails.map((item) => {
                const isPending = item.status?.toLowerCase() === 'pending';

                return (
                  <div
                    key={item._id}
                    className="w-80 md:w-96 flex-shrink-0 snap-start bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                  >
                    {/* Top Bar: Patient & Status */}
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{item.patientName}</h3>
                        <p className="text-xs text-gray-500">{item.gender}, {item.age} yrs • {item.contactNumber}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          isPending
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Booking Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs font-medium uppercase">Date</p>
                        <p className="font-semibold text-gray-700">
                          {new Date(item.bookingDate).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs font-medium uppercase">Slot Time</p>
                        <p className="font-semibold text-gray-700">{item.slotTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs font-medium uppercase">Mode</p>
                        <span className="inline-block mt-1 text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md">
                          {item.consultation}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs font-medium uppercase">Fee</p>
                        <p className="font-semibold text-gray-800">₹{item.amount}</p>
                      </div>
                    </div>

                    {/* Symptoms */}
                    {item.symptoms ? (
                      <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-xs">
                        <span className="font-semibold text-gray-600">Symptoms: </span>
                        <span className="text-gray-500">{item.symptoms}</span>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-xs italic text-gray-400">
                        No symptoms specified
                      </div>
                    )}
                    {/* Join Meeting Button (Shows only if status is Pending) */}
                 {isPending && (
                  
  <a
    href={item.meetingLink}
    target="_blank"
    className="w-full bg-[#058b7c] hover:bg-[#047266] text-white font-semibold py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 text-center no-underline"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
    Join Meeting
  </a>
)}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-2xl border border-gray-200">
              <p className="text-gray-500 font-medium">No appointment bookings found.</p>
            </div>
          )}
        </section>

        {/* Navigation Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Doctor Card */}
          <div
            onClick={gotoDoctorSearch}
            className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                Doctor Appointment
              </p>
              <h2 className="text-2xl font-bold text-gray-800 mt-2">
                Consult a Doctor
              </h2>
              <p className="text-gray-500 mt-3 leading-relaxed">
                Find the right specialist and book instantly.
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                gotoDoctorSearch()
              }}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
            >
              Book Now
            </button>
          </div>

          {/* Medicine Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                Medicine
              </p>
              <h2 className="text-2xl font-bold text-gray-800 mt-2">
                Order Medicines
              </h2>
              <p className="text-gray-500 mt-3 leading-relaxed">
                Get genuine medicines delivered to your doorstep.
              </p>
            </div>
            <div>
              <span className="inline-block mt-5 bg-yellow-100 text-yellow-700 text-sm font-semibold px-4 py-2 rounded-full">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Laboratory Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                Laboratory
              </p>
              <h2 className="text-2xl font-bold text-gray-800 mt-2">
                Book Lab Tests
              </h2>
              <p className="text-gray-500 mt-3 leading-relaxed">
                Schedule diagnostic tests with convenient home sample collection.
              </p>
            </div>
            <div>
              <span className="inline-block mt-5 bg-yellow-100 text-yellow-700 text-sm font-semibold px-4 py-2 rounded-full">
                Coming Soon
              </span>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}

export default PatientDashboard
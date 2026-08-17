import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Logo from '../assets/Logo.png';

// -------------------------------------------------------------
// UPDATED HEADER COMPONENT
// -------------------------------------------------------------
const Header = () => {
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL;

  const handleLogout = async () => {
    try {
      const response = await fetch(`${api}/api/patient/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Logged out successfully!');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      navigate('/Patient/Login');
    }
  };

  const handleHomeRedirect = () => {
    navigate('/Patient/Dashboard');
  };
  
 const handleGoToDashboard = () => {
  navigate('/Patient/Dashboard');
};

  return (
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
           <button
             onClick={handleGoToDashboard}
             className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer"
             title="Go to Dashboard"
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
             </svg>
             <span>Dashboard</span>
           </button>
   
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
   
  );
};

// Helper function to dynamically load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PatientDoctorSlots = () => {
  const api = import.meta.env.VITE_API_URL;
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const { id } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const dateFromQuery = searchParams.get('date');

  const getTodayString = () => new Date().toISOString().split('T')[0];

  // Doctor Info & Schedule State
  const [doctorInfo, setDoctorInfo] = useState({
    _id: '',
    name: '',
    image: '',
    experience: '',
    language: [],
    specification: '',
    fee: 0,
  });

  const [schedule, setSchedule] = useState({
    startTime: '',
    endTime: '',
    slotDuration: 30,
  });

  const [bookedSlots, setBookedSlots] = useState([]);
  const [generatedSlots, setGeneratedSlots] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);

  // Selected Date state
  const [selectedDate, setSelectedDate] = useState(dateFromQuery || getTodayString());

  const [patientName, setPatientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [consultationMode, setConsultationMode] = useState('Online');
  const [reportFile, setReportFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (dateFromQuery) {
      setSelectedDate(dateFromQuery);
    }
  }, [dateFromQuery]);

  // -------------------------------------------------------------
  // TIME CONVERSION HELPERS
  // -------------------------------------------------------------
  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const cleanStr = timeStr.trim().toUpperCase();
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

  const minutesTo12HourFormat = (totalMinutes) => {
    let hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    return `${formattedHours}:${formattedMins} ${period}`;
  };

  const generateTimeSlots = (startTime, endTime, durationInMinutes = 30, targetDate = selectedDate) => {
    if (!startTime || !endTime) return [];

    const now = new Date();
    const todayStr = getTodayString();
    const isToday = targetDate === todayStr;
    const currentMinutesNow = now.getHours() * 60 + now.getMinutes();

    let startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);
    const slots = [];

    while (startMinutes + durationInMinutes <= endMinutes) {
      const slotStart = minutesTo12HourFormat(startMinutes);
      const slotEnd = minutesTo12HourFormat(startMinutes + durationInMinutes);
      const slotString = `${slotStart} - ${slotEnd}`;

      let isPast = false;
      if (targetDate < todayStr) {
        isPast = true;
      } else if (isToday) {
        isPast = startMinutes < currentMinutesNow;
      }

      const isAlreadyBooked = bookedSlots.includes(slotString);

      slots.push({
        slot: slotString,
        isPast: isPast,
        isBooked: isAlreadyBooked,
        disabled: isPast || isAlreadyBooked,
      });

      startMinutes += durationInMinutes;
    }
    return slots;
  };

  // -------------------------------------------------------------
  // API CALLS
  // -------------------------------------------------------------
  const fetchDoctorDetails = async () => {
    try {
      const response = await fetch(`${api}/api/patient/GetSingleDoctor/${id}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setDoctorInfo(data.data);
      }
    } catch (error) {
      console.error('Error fetching doctor info:', error);
    }
  };

  const fetchDoctorSchedule = async (date) => {
    if (!date) return;
    setLoadingSchedule(true);
    setSelectedSlot('');

    try {
      const response = await fetch(`${api}/api/patient/GetScheduleDoctor/${id}?date=${date}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success && data.schedule) {
        setSchedule({
          startTime: data.schedule.start,
          endTime: data.schedule.end,
          slotDuration: 30,
        });
        setBookedSlots(data.bookedSlots || []);
      } else {
        setSchedule({ startTime: '', endTime: '', slotDuration: 30 });
        setBookedSlots([]);
        if (data.message) toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setSchedule({ startTime: '', endTime: '', slotDuration: 30 });
      setBookedSlots([]);
      toast.error('Failed to load doctor schedule.');
    } finally {
      setLoadingSchedule(false);
    }
  };

  useEffect(() => {
    if (id && id.length === 24) {
      fetchDoctorDetails();
    } else {
      toast.error('Invalid Doctor ID parameter');
    }
  }, [id]);

  useEffect(() => {
    if (id && id.length === 24 && selectedDate) {
      fetchDoctorSchedule(selectedDate);
    }
  }, [id, selectedDate]);

  useEffect(() => {
    if (schedule.startTime && schedule.endTime) {
      setGeneratedSlots(
        generateTimeSlots(schedule.startTime, schedule.endTime, schedule.slotDuration, selectedDate)
      );
    } else {
      setGeneratedSlots([]);
    }
  }, [selectedDate, schedule, bookedSlots]);

  const validateForm = () => {
    if (!selectedDate) {
      toast.error('Please select an appointment date.');
      return false;
    }
    if (!patientName.trim() || patientName.trim().length < 3) {
      toast.error('Please enter a valid patient name.');
      return false;
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!contactNumber || !phoneRegex.test(contactNumber)) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (!age || Number(age) < 1 || Number(age) > 120) {
      toast.error('Please enter a valid age.');
      return false;
    }
    if (!gender) {
      toast.error('Please select gender.');
      return false;
    }
    if (!selectedSlot) {
      toast.error('Please select an available time slot.');
      return false;
    }
    return true;
  };

  // -------------------------------------------------------------
  // PAYMENT & BOOKING LOGIC
  // -------------------------------------------------------------
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setSubmitting(false);
        return;
      }

      const bookingFee = doctorInfo.fee || 500;

      const orderRes = await fetch(`${api}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: bookingFee }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        toast.error(orderData.message || 'Failed to initialize payment.');
        setSubmitting(false);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Doctor Appointment',
        description: `Consultation with Dr. ${doctorInfo.name}`,
        order_id: orderData.order.id,
        prefill: {
          name: patientName,
          contact: contactNumber,
        },
        theme: {
          color: '#078475',
        },
        handler: async (response) => {
          await finalizeAppointment(response);
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            toast.error('Payment cancelled by user.');
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error?.message || 'Error processing request.');
      setSubmitting(false);
    }
  };

  const finalizeAppointment = async (paymentResponse) => {
    try {
      const formData = new FormData();
      formData.append('patientName', patientName);
      formData.append('contactNumber', contactNumber);
      formData.append('age', age);
      formData.append('gender', gender);
      formData.append('bookingDate', selectedDate);
      formData.append('slotTime', selectedSlot);
      formData.append('symptoms', symptoms || '');
      formData.append('consultation', consultationMode);
      formData.append('paymentMode', 'Online');
      formData.append('amount', doctorInfo.fee || 500);

      formData.append('razorpayOrderId', paymentResponse.razorpay_order_id);
      formData.append('razorpayPaymentId', paymentResponse.razorpay_payment_id);
      formData.append('razorpaySignature', paymentResponse.razorpay_signature);

      if (reportFile) {
        formData.append('uploadReports', reportFile);
      }

      const response = await fetch(`${api}/api/patient/PatientAppointment/${id}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Appointment booked successfully!');
        navigate('/Patient/Dashboard');
      } else {
        toast.error(typeof data.message === 'string' ? data.message : 'Failed to book appointment.');
      }
    } catch (error) {
      console.error('Finalization error:', error);
      toast.error('Payment succeeded, but appointment verification failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Toaster />
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Doctor Info Card */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
            <img
              className="w-full h-full object-top rounded-xl border border-gray-200"
              src={doctorInfo.image?.trim() ? doctorInfo.image : 'https://via.placeholder.com/160'}
              alt={doctorInfo.name || 'Doctor'}
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <span className="text-[#078475] font-semibold text-sm">Verified Doctor</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Dr. {doctorInfo.name || 'Loading...'}
            </h1>
            <p className="text-gray-600 text-sm font-medium">
              {doctorInfo.experience ? `${doctorInfo.experience}+ years experience` : 'Experience not specified'}
            </p>

            <div className="pt-1">
              <span className="text-sm font-semibold text-gray-700 mr-2">Speaks:</span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1 sm:mt-0">
                {doctorInfo.language?.length > 0 ? (
                  doctorInfo.language.map((lang, index) => (
                    <span key={index} className="bg-[#078475]/10 text-[#078475] px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium">
                      {lang}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">N/A</span>
                )}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              {doctorInfo.specification && (
                <span className="bg-[#078475]/10 text-[#078475] px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {doctorInfo.specification}
                </span>
              )}
              {doctorInfo.fee > 0 && (
                <span className="text-gray-700 font-bold text-sm">
                  Consultation Fee: ₹{doctorInfo.fee}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Date Display & Available Slots Section */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100 mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#078475]">Appointment Date</h2>
              {schedule.startTime && schedule.endTime && (
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Doctor Timing: {schedule.startTime} - {schedule.endTime}
                </p>
              )}
            </div>

            {/* Static Date Display Badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">Date:</span>
              <div className="bg-[#078475]/10 border border-[#078475]/30 text-[#078475] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {selectedDate}
              </div>
            </div>
          </div>

          <h3 className="text-base font-semibold text-gray-800 mb-3">Available Time Slots</h3>

          {loadingSchedule ? (
            <div className="py-4 text-center text-gray-500 text-sm">
              Loading schedule & available slots for {selectedDate}...
            </div>
          ) : generatedSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {generatedSlots.map((item, index) => {
                const isSelected = selectedSlot === item.slot;

                let buttonStyle = 'bg-white text-gray-700 border-gray-300 hover:border-[#078475] hover:text-[#078475] cursor-pointer';
                let labelExtra = '';

                if (item.isBooked) {
                  buttonStyle = 'bg-red-50 text-red-400 border-red-200 cursor-not-allowed line-through';
                  labelExtra = ' (Booked)';
                } else if (item.isPast) {
                  buttonStyle = 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed line-through';
                } else if (isSelected) {
                  buttonStyle = 'bg-[#078475] text-white border-[#078475] shadow-md scale-105 font-bold cursor-pointer';
                }

                return (
                  <button
                    key={index}
                    type="button"
                    disabled={item.disabled}
                    onClick={() => setSelectedSlot(item.slot)}
                    className={`py-2.5 px-3 text-xs sm:text-sm font-medium rounded-xl border transition-all ${buttonStyle}`}
                  >
                    {item.slot}
                    {labelExtra}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No schedule or time slots set for this doctor on this date.</p>
          )}

          {selectedSlot && (
            <div className="mt-4 p-3 bg-[#078475]/10 rounded-xl text-sm font-semibold text-[#078475]">
              Selected Slot: <span className="underline">{selectedDate}</span> at <span className="underline">{selectedSlot}</span>
            </div>
          )}
        </div>

        {/* Patient Form */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#078475]">Patient Details</h2>
          </div>

          <form onSubmit={handleBooking} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#078475] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#078475] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter age"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#078475] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#078475] text-sm bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Reports (Optional)</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setReportFile(e.target.files[0])}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#078475]/10 file:text-[#078475] hover:file:bg-[#078475]/20 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms (Optional)</label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe symptoms..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#078475] text-sm"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Consultation Type</label>
              <div className="flex gap-6 items-center">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="consultationMode"
                    value="Online"
                    checked={consultationMode === 'Online'}
                    onChange={(e) => setConsultationMode(e.target.value)}
                    className="accent-[#078475] w-4 h-4"
                  />
                  Online Consultation
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="consultationMode"
                    value="Offline"
                    checked={consultationMode === 'Offline'}
                    onChange={(e) => setConsultationMode(e.target.value)}
                    className="accent-[#078475] w-4 h-4"
                  />
                  In-Clinic (Offline)
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className={`w-full bg-[#078475] text-white font-semibold py-3 px-6 rounded-xl transition duration-200 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#078475] ${
                  submitting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#046156] cursor-pointer'
                }`}
              >
                {submitting ? 'Processing Payment...' : `Pay ₹${doctorInfo.fee || 500} & Confirm for ${selectedDate}`}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PatientDoctorSlots;
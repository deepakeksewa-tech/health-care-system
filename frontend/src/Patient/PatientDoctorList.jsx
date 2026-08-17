import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';

const PatientDoctorList = () => {
  const api = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Today's date in YYYY-MM-DD format as default
  const todayDateStr = new Date().toISOString().split('T')[0];

  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(todayDateStr);

  // Fetch Available Doctors List from Backend API based on Selected Date
  async function getList(dateToFetch) {
    setLoading(true);
    setError(null);
    try {
      // Send selectedDate in query parameter
      const queryDate = dateToFetch || selectedDate || todayDateStr;
      const response = await fetch(`${api}/api/patient/alldetails?date=${queryDate}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const doctorData = data.data || [];
        setDoctors(doctorData);
        setFilteredDoctors(doctorData);
      } else {
        setError(data.message || "Failed to fetch doctors list.");
        setDoctors([]);
        setFilteredDoctors([]);
      }
    } catch (err) {
      console.error("Error fetching doctor details:", err);
      setError("Network error while loading doctors.");
    } finally {
      setLoading(false);
    }
  }

  // 1. Re-fetch doctors whenever selectedDate changes
  useEffect(() => {
    getList(selectedDate);
  }, [selectedDate]);

  // 2. Filter local list by Search Term (Name / Specialty)
  useEffect(() => {
    let temp = [...doctors];

    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      temp = temp.filter((item) => {
        const docName = item.doctor?.name?.toLowerCase() || '';
        const spec = item.doctor?.specification?.toLowerCase() || '';
        return docName.includes(query) || spec.includes(query);
      });
    }

    setFilteredDoctors(temp);
  }, [searchTerm, doctors]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/Patient/Login');
  };

  const handleHomeRedirect = () => {
    navigate('/Patient/dashboard');
  };

  function GoToDoctorSlot(id) {
    // Pass selected date in navigation if needed
    navigate(`/Patient/doctorSlot/${id}?date=${selectedDate}`);
  }

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDate(todayDateStr);
  };

 const handleGoToDashboard = () => {
  navigate('/Patient/Dashboard');
};
  return (
    <div className='bg-gray-100 min-h-screen pb-10'>
      
      {/* Header */}
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

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Find Doctor & Book Slot
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name or spec..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#078475]"
              />
            </div>

            {/* Date Filter Input */}
            <div className="relative w-full sm:w-auto">
              <input
                type="date"
                value={selectedDate}
                min={todayDateStr} // Prevent past dates
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#078475]"
              />
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || selectedDate !== todayDateStr) && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 font-semibold hover:underline px-2 py-1 cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#078475] border-t-transparent mb-3"></div>
            <p className="text-gray-600 font-medium text-sm">Fetching available doctors for {selectedDate}...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-12 bg-white rounded-2xl border border-red-200 p-6">
            <p className="text-red-500 font-medium">{error}</p>
            <button 
              onClick={() => getList(selectedDate)} 
              className="mt-4 bg-[#078475] text-white text-xs px-4 py-2 rounded-xl font-semibold hover:bg-[#046156]"
            >
              Try Again
            </button>
          </div>
        ) : filteredDoctors.length > 0 ? (
          /* Doctor Cards Grid */
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {filteredDoctors.map((item, index) => {
              const doc = item.doctor || {};
              const docId = doc._id || index;
              const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${doc.name || index}`;

              return (
                <div 
                  key={docId} 
                  className='bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden flex flex-col justify-between p-4 sm:p-5 border border-gray-100'
                >
                  {/* Doctor Details */}
                  <div className='flex flex-col sm:flex-row gap-4 items-start'>
                    <div className="w-32 h-36 flex-shrink-0 mx-auto sm:mx-0">
                      <img
                        className="w-full h-full object-cover object-top rounded-xl border border-gray-200"
                        src={doc.image || defaultAvatar}
                        alt={doc.name || "Doctor"}
                        onError={(e) => { e.target.src = defaultAvatar; }}
                      />
                    </div>

                    <div className='flex-1 space-y-1 text-center sm:text-left w-full'>
                      <div className='text-[#078475] text-xs font-semibold uppercase tracking-wider'>Verified Doctor</div>
                      <div className='text-xl font-bold text-gray-800'>Dr. {doc.name || "N/A"}</div>
                      <div className='text-sm text-gray-600 font-medium'>{doc.experience || 0}+ years experience</div>
                      
                      {/* Available Time Slot for Selected Day */}
                      {item.schedule && (
                        <div className="text-xs text-gray-500 pt-1">
                          <span className="font-semibold text-gray-700">Schedule ({item.schedule.day}): </span>
                          <span className="text-[#078475] font-medium">{item.schedule.start} - {item.schedule.end}</span>
                        </div>
                      )}

                      {/* Languages Spoken */}
                      {doc.language && doc.language.length > 0 && (
                        <div className='pt-1 text-sm'>
                          <span className="text-xs text-gray-400 font-semibold block mb-1">Speaks:</span>
                          {doc.language.map((lang, ind) => (
                            <span className="bg-[#078475]/10 text-[#078475] mr-1 mb-1 inline-block px-2.5 py-0.5 rounded-full text-xs font-medium" key={ind}>
                              {lang}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Specialization */}
                      {doc.specification && (
                        <div className="pt-1">
                          <span className="bg-[#078475]/10 text-[#078475] px-3 py-1 rounded-full text-xs font-semibold inline-block">
                            {doc.specification}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Slot Button */}
                  <div className='mt-4 pt-3 border-t border-gray-100 w-full'>
                    <button 
                      onClick={() => GoToDoctorSlot(doc._id)} 
                      className='w-full bg-[#078475] cursor-pointer text-white font-semibold py-2.5 text-center rounded-xl hover:bg-[#046156] transition active:scale-98 shadow-xs'
                    >
                      Book Slot
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search Result */
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 font-medium text-lg">No doctors available on {selectedDate}.</p>
            <button 
              onClick={clearFilters}
              className="mt-3 text-sm font-semibold text-[#078475] hover:underline cursor-pointer"
            >
              Reset to Today
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PatientDoctorList;
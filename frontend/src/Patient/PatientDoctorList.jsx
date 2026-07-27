import React, { useState, useEffect } from 'react';
import Header from '../component/Header';
import { useNavigate } from 'react-router-dom';

const PatientDoctorList = () => {
  const api = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [Doctors, setdoctor] = useState([]);

  async function getList() {
    try {
      const response = await fetch(`${api}/api/patient/alldetails`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json"
        },
      });
      const data = await response.json();
      setdoctor(data.data || []);
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
  }

  useEffect(() => {
    getList();
  }, []);

  function GoToDoctorSlot(id) {
    navigate(`/Patient/doctorSlot/${id}`);
  }

  return (
    <div className='bg-gray-100 min-h-screen pb-10'>
      <Header />

      <div className="max-w-7xl mx-auto px-4 mt-6">
        {/* Search Bar Header */}
        <div className="bg-white p-4 rounded-2xl shadow-sm md:flex md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold mb-3 md:mb-0 text-gray-800">
            Find Doctor & Book Slot
          </h2>

          {/* <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by doctor name or category"
              className="border border-gray-300 rounded-xl px-4 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-[#078475]"
            />
            <button className="bg-[#078475] text-white px-6 py-2 rounded-xl hover:bg-[#046156] transition cursor-pointer">
              Search
            </button>
          </div> */}
        </div>

        {/* Doctor Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {Doctors.map((item, index) => (
            <div 
              key={index} 
              className='bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden flex flex-col justify-between p-4 sm:p-5'
            >
              {/* Doctor Details Row */}
              <div className='flex flex-col sm:flex-row gap-4 items-start'>
                <div className="w-32 h-36 flex-shrink-0">
                  <img
                    className="w-full h-full object-top rounded-xl border border-gray-200"
                    src={item.doctor?.image || "https://via.placeholder.com/150"}
                    alt="doctorImg"
                  />
                </div>

                <div className='flex-1 space-y-1'>
                  <div className='text-[#078475] text-xs font-semibold uppercase'>Verified Doctor</div>
                  <div className='text-xl font-bold text-gray-800'>Dr. {item.doctor?.name}</div>
                  <div className='text-sm text-gray-600 font-medium'>{item.doctor?.experience} +years experience</div>
                  
                  <div className='pt-1 text-sm'>
                    <span className="text-xs text-gray-500 font-semibold block mb-1">Speaks:</span>
                    {item.doctor?.language?.map((i, ind) => (
                      <span className="bg-[#078475]/10 text-[#078475] mr-1 mb-1 inline-block px-2.5 py-0.5 rounded-full text-xs font-medium" key={ind}>
                        {i}
                      </span>
                    ))}
                  </div>

                  {item.doctor?.specification && (
                    <div className="pt-1">
                      <span className="bg-[#078475]/10 text-[#078475] px-3 py-1 rounded-full text-xs font-semibold">
                        {item.doctor.specification}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Fixed Button Area */}
              <div className='mt-4 pt-3 border-t border-gray-100 w-full'>
                <button 
                  onClick={() => { GoToDoctorSlot(item.doctor?._id); }} 
                  className='w-full bg-[#078475] cursor-pointer text-white font-semibold py-2.5 text-center rounded-xl hover:bg-[#046156] transition shadow-sm'
                >
                  Book Slot
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDoctorList;
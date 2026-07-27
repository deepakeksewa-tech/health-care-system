import React, { useState, useEffect } from 'react';
import Header from '../component/Header';
import toast, { Toaster } from 'react-hot-toast';

const TotalDoctor = () => {
  const api = import.meta.env.VITE_API_URL;

  // States
  const [doctorVerification, setdoctorVerification] = useState([]);
  const [loading, setloading] = useState(false);
  const [History, setHistory] = useState(false);
  const [Doctor, setDoctor] = useState([]);
  const [TotalPatient, setTotalPatient] = useState([]); // Added missing state
  const [selectedUser, setSelectedUser] = useState(null); // Added missing state

  async function handleHistory(id) {
    try {
      console.log(id);
      setloading(true);
      const response = await fetch(`${api}/api/admin/get/AllDoctor/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json"
        }
      });
      const data = await response.json();
      if (data.success) {
        setTotalPatient(data.data || []);
        console.log(data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch medical history");
    } finally {
      setTimeout(() => {
        setloading(false);
      }, 500); // 3 seconds spinner delay reduced for better UX
    }
  }

  async function handling() {
    try {
      setloading(true);
      const response = await fetch(`${api}/api/admin/get/AllDoctor/BasicDetails`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json" // Fixed typo: applicaiton -> application
        }
      });
      const data = await response.json();
      if (data.data) {
        setdoctorVerification(data.data);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load doctors");
    } finally {
      setTimeout(() => {
        setloading(false);
      }, 500);
    }
  }

  async function deleting(id) {
    try {
      const response = await fetch(`${api}/api/admin/delete/doctor/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json"
        }
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        handling();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Delete operation failed");
    }
  }

  useEffect(() => {
    handling();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50">
          <div className="w-12 h-12 border-4 border-[#078475] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Patient History Modal */}
      {History && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col border border-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Patient Medical History</h2>
                {selectedUser && (
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <p>
                      Patient: <span className="font-semibold text-slate-800">{selectedUser.name || selectedUser.patientName}</span>
                    </p>
                    {selectedUser.gmail && (
                      <p>
                        Email: <span className="font-semibold text-slate-800">{selectedUser.gmail}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setHistory(false);
                  setSelectedUser(null);
                }}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* History Details List */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] space-y-4">
              {TotalPatient.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 font-medium">Is patient ke liye koi medical record nahi mila.</p>
                </div>
              ) : (
                TotalPatient.map((item, idx) => (
                  <div key={item._id || idx} className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm hover:border-emerald-300 transition">
                    {/* Header: Visit Index & Date */}
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700">
                        Visit #{TotalPatient.length - idx}
                      </span>
                      <div className="flex items-center text-xs text-slate-500 gap-1">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                          {item.bookingDate
                            ? new Date(item.bookingDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                            : (item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date N/A')}
                        </span>
                      </div>
                    </div>

                    {/* Patient Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-slate-400 block font-medium">Patient Name</span>
                        <span className="font-semibold text-slate-800 text-sm">{item.patientName || item.userId?.name || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Age / Gender</span>
                        <span className="font-semibold text-slate-800 text-sm">{item.age ? `${item.age} yrs` : 'N/A'} ({item.gender || 'N/A'})</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Contact</span>
                        <span className="font-semibold text-slate-800 text-sm">{item.contactNumber || item.userId?.contact || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Slot Time</span>
                        <span className="font-semibold text-slate-800 text-sm">{item.slotTime || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Consultation & Booking Extra Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-2 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium mb-1">Symptoms / Issues</span>
                        {item.symptoms ? (
                          <span className="inline-block bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md font-medium">
                            {item.symptoms}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No symptoms mentioned</span>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-slate-400 block font-medium">Type</span>
                          <span className={`font-semibold ${item.consultation === 'Online' ? 'text-blue-600' : 'text-emerald-600'}`}>
                            {item.consultation || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Amount</span>
                          <span className="font-semibold text-slate-800">₹{item.amount || 0}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Status</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.status || 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <Toaster />

      <main className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Total Doctor</h1>
          </div>

          {/* Main Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4">Sr No.</th>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Specification</th>
                    <th className="px-6 py-4">Language</th>
                    <th className="px-6 py-4">Contact No</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {doctorVerification.map((item, index) => (
                    <tr key={item._id || index} className="transition duration-200 hover:bg-slate-50">
                      <td className="px-6 py-5">{index + 1}</td>

                      {/* Doctor Image */}
                      <td>
                        <div className="m-2">
                          <img src={item.image} alt={item.name} className="h-20 rounded-xl object-cover" />
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-slate-800">{item.name}</p>
                          <p className="mt-1 text-sm text-slate-500">Experience: {item.experience}</p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                          {item.specification}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {Array.isArray(item.language) ? (
                          item.language.map((i, idx) => <span key={idx}>{i} </span>)
                        ) : (
                          <span>{item.language}</span>
                        )}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">{item.contactNo}</td>

                      <td className="px-6 py-5">{item.category}</td>

                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              handleHistory(item._id);
                              setSelectedUser(item);
                              setHistory(true);
                            }}
                            className="rounded-lg cursor-pointer bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600 active:scale-95"
                          >
                            History
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 p-4 lg:hidden">
              {doctorVerification.map((item, index) => (
                <div key={item._id || index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  {/* Doctor Header */}
                  <div className="flex items-start gap-4">
                    <div className="flex justify-around gap-10 w-full">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900">{item.name}</h3>
                        <p className="mt-1 truncate text-sm text-slate-500">Experience : {item.experience}</p>
                      </div>
                      <div>
                        <img src={item.image} alt={item.name} className="rounded-xl h-24 w-24 object-cover" />
                      </div>
                    </div>
                  </div>

                  {/* Doctor Details */}
                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                    <div className="flex justify-between gap-4">
                      <span className="text-sm text-slate-500">Specification</span>
                      <span className="text-right text-sm font-medium text-slate-800">{item.specification}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-sm text-slate-500">Language</span>
                      <span className="text-right text-sm font-medium text-slate-800">
                        {Array.isArray(item.language) ? (
                          item.language.map((i, idx) => <span key={idx}>{i} </span>)
                        ) : (
                          <span>{item.language}</span>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-sm text-slate-500">Contact No.</span>
                      <span className="max-w-[60%] text-right text-sm font-medium text-slate-800">{item.contactNo}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-sm text-slate-500">Category</span>
                      <span className="max-w-[60%] text-right text-sm font-medium text-slate-800">{item.category}</span>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="mt-5">
                    <button
                      onClick={() => {
                        handleHistory(item._id);
                        setSelectedUser(item);
                        setHistory(true);
                      }}
                      className="mb-4 rounded-xl w-full bg-blue-500 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 active:scale-95"
                    >
                      History
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TotalDoctor;
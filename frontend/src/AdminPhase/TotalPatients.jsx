import React, { useState, useEffect } from 'react';
import Header from '../component/Header';
import toast, { Toaster } from 'react-hot-toast';

const TotalPatient = () => {
  const api = import.meta.env.VITE_API_URL;
  const [TotalUsers, setTotalUsers] = useState([]);
  const [loading, setloading] = useState(false);
  const [TotalPatient, setTotalPatient] = useState([]);
  const [History, setHistory] = useState(false);
  const [selectedUser, setselectedUser] = useState(null); // Fixed initial state to null

  async function findHistory(user) {
    try {
      setselectedUser(user); // Fix 1: Store selected user object for Modal header
      setloading(true);

      const response = await fetch(`${api}/api/admin/get/AllPatients/${user._id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      if (data.success) {
        setTotalPatient(data.data);
      } else {
        toast.error(data.message || "Failed to fetch medical records.");
        setTotalPatient([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching history");
    } finally {
      setloading(false); // Fix 2: Direct loading state update without unnecessary delay
    }
  }

  async function handling() {
    try {
      setloading(true);
      const response = await fetch(`${api}/api/admin/get/AllUsers`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json", // Fix 3: Fixed typo ('applicaiton/json')
        },
      });
      const data = await response.json();
      if (data.success) {
        setTotalUsers(data.data);
      }
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setloading(false);
    }
  }

  async function deleting(id) {
    try {
      const response = await fetch(`${api}/api/admin/delete/doctor/${id}`, {
        method: "DELETE", // Changed GET to DELETE standard method
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        handling();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete record");
    }
  }

  useEffect(() => {
    handling();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Patient History Modal */}
      {History && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col border border-slate-100">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Medical History</h2>
                {selectedUser && (
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <p>Patient: <span className="font-semibold text-slate-800">{selectedUser.name}</span></p>
                    {selectedUser.age && (
                      <p>Age: <span className="font-semibold text-slate-800">{selectedUser.age} yrs</span></p>
                    )}
                    <p>Email: <span className="font-semibold text-slate-800">{selectedUser.gmail}</span></p>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setHistory(false);
                  setselectedUser(null);
                }}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* History Details Stream */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] space-y-5">
              {TotalPatient.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 font-medium">No History</p>
                </div>
              ) : (
                TotalPatient.map((item, idx) => (
                  <div key={item._id || idx} className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm hover:border-emerald-300 transition">

                    {/* Top Row: Date & Visit Counter */}
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700">
                        Visit #{TotalPatient.length - idx}
                      </span>
                      <div className="flex items-center text-xs text-slate-500 gap-1">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                          {item.date
                            ? new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                            : (item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date N/A')}
                        </span>
                      </div>
                    </div>

                    {/* Main Content Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      {/* Doctor Details & Image */}
                      <div className="md:col-span-1 bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
                        {item.doctorImage || item.doctorId?.image ? (
                          <img
                            src={item.doctorImage || item.doctorId?.image}
                            alt={item.doctorName || "Doctor"}
                            className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                            {item.doctorName ? item.doctorName.charAt(0) : 'D'}
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Doctor</span>
                          <h4 className="text-sm font-bold text-slate-800">{item.doctorName || item.doctorId?.name || 'Dr. Not Assigned'}</h4>
                          <p className="text-xs text-slate-500">{item.doctorSpecialty || item.doctorId?.specialization || 'General Physician'}</p>
                        </div>
                      </div>

                      {/* Patient Info & Symptoms */}
                      <div className="md:col-span-2 space-y-3">
                        <div className="flex gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 block font-medium">Patient Name</span>
                            <span className="font-semibold text-slate-700">{item.patientName || selectedUser?.name || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Age</span>
                            <span className="font-semibold text-slate-700">{item.age || selectedUser?.age || 'N/A'} yrs</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Symptoms / Issues</span>
                          {Array.isArray(item.symptoms) ? (
                            <div className="flex flex-wrap gap-1.5">
                              {item.symptoms.map((symptom, sIdx) => (
                                <span key={sIdx} className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
                                  {symptom}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs bg-slate-50 p-2 rounded border border-slate-100 text-slate-700">
                              {item.symptoms || item.details || item.description || 'No symptoms specified.'}
                            </p>
                          )}
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

      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50">
          <div className="w-12 h-12 border-4 border-[#078475] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <Toaster />

      <main className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Total Patient</h1>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4">Sr No.</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Gmail</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {TotalUsers.map((item, index) => (
                    <tr key={item._id || index}>
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                      <td className="px-6 py-4 text-slate-600">{item.gmail}</td>
                      <td className="px-6 py-4 text-slate-600">{item.contact}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {item.status ? 'Active' : 'Deactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            findHistory(item); // Fix 4: Pass entire item to populate modal header details
                            setHistory(true);
                          }}
                          className="cursor-pointer bg-green-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-700 transition"
                        >
                          History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View Cards */}
            <div className="space-y-4 p-4 lg:hidden">
              {TotalUsers.map((item, index) => (
                <div key={item._id || index} className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="font-semibold text-lg text-slate-800">{item.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {item.status ? "Active" : "Deactive"}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p><span className="font-medium text-slate-900">#</span> {index + 1}</p>
                    <p><span className="font-medium text-slate-900">Email:</span> {item.gmail}</p>
                    <p><span className="font-medium text-slate-900">Contact:</span> {item.contact}</p>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => {
                        findHistory(item); // Fix 5: Changed item.id to pass full item object
                        setHistory(true);
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition w-full"
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

export default TotalPatient;
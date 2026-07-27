import React, { useState, useEffect } from "react";
import { 
  RxCross2, 
  RxCalendar, 
  RxClock, 
  RxPerson, 
  RxActivityLog, 
  RxLockClosed,
  RxCheck,
  RxCardStack,
  RxMobile
} from "react-icons/rx";
import { IoWalletOutline } from "react-icons/io5";

// Header Component
const Header = ({ doctorInfo }) => (
  <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-xs">
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-[#058b7c] rounded-lg flex items-center justify-center text-white font-bold text-lg">
        M
      </div>
      <span className="font-bold text-xl tracking-tight text-gray-900">
        MED<span className="text-[#058b7c]">SEWA</span>
      </span>
    </div>
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-gray-600">
        {doctorInfo?.name ? `Dr. ${doctorInfo.name}` : "Doctor Dashboard"}
      </span>
      <div className="w-9 h-9 rounded-full bg-[#058b7c]/10 text-[#058b7c] font-semibold flex items-center justify-center border border-[#058b7c]/20">
        {doctorInfo?.name ? doctorInfo.name.split(" ").map(n => n[0]).join("") : "DR"}
      </div>
    </div>
  </header>
);

const Dashboard = () => {
  // State management
  const [checkMoney, setCheckMoney] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Dynamic Data States
  const [appointments, setAppointments] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL ;

  // Fetch Appointments
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/doctors/get/all/appointments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const resData = await response.json();

      if (resData.success && Array.isArray(resData.data)) {
        setAppointments(resData.data);
      } else if (Array.isArray(resData)) {
        setAppointments(resData);
      } else {
        setAppointments([]);
      }

      if (resData.doctor) {
        setDoctorInfo(resData.doctor);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setAppointments([]);
    }  finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Verify Password Endpoint
  const handleVerifyPassword = async () => {
    if (!password) {
      alert("Please enter security password");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/doctors/verify/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success || response.ok) {
        setCheckMoney(true);
        setShowPassword(false);
        setPassword("");
      } else {
        alert(data.message || "Invalid Security Password");
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("Error connecting to server while verifying password.");
    } finally {
      setLoading(false);
    }
  };

  // Safe Calculations for Metrics
  const safeAppointmentsList = Array.isArray(appointments) ? appointments : [];
  const totalEarnings = safeAppointmentsList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalPatients = safeAppointmentsList.length;

  const closeWalletModal = () => {
    setWalletModalOpen(false);
    setCheckMoney(false);
    setShowPassword(false);
    setPassword("");
  };

  // Helper function to format date cleanly
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? dateStr : parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 antialiased font-sans">
      {/* Header */}
      <Header doctorInfo={doctorInfo} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Title Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Consultant Overview
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your clinical appointments, earnings, and consultations.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 font-medium shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Updates Active
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wallet Card */}
          <div
            onClick={() => setWalletModalOpen(true)}
            className="group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Wallet Balance
              </span>
              <div className="p-2.5 bg-teal-50 text-[#058b7c] rounded-xl group-hover:scale-105 transition-transform">
                <IoWalletOutline className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {checkMoney ? "₹2,500.00" : "••••••••"}
              </span>
              <span className="text-xs font-semibold text-[#058b7c] group-hover:underline">
                Tap to View →
              </span>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Revenue
              </span>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <RxActivityLog className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                ₹{totalEarnings.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Patients Count Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Patients
              </span>
              <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
                <RxPerson className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {totalPatients}
              </span>
            </div>
          </div>
        </div>

        {/* Appointments Table Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">
              Upcoming & Past Appointments
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Showing {safeAppointmentsList.length} entries
            </span>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold tracking-wider">
                  <th className="py-4 px-6">Date & Time</th>
                  <th className="py-4 px-6">Patient</th>
                  <th className="py-4 px-6">Symptoms</th>
                  <th className="py-4 px-6">Fee</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-slate-500">
                      Loading appointments...
                    </td>
                  </tr>
                ) : safeAppointmentsList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-slate-500">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  safeAppointmentsList.map((item, index) => {
                    const displayDate = formatDate(item.bookingDate || item.date);
                    const displayTime = item.slotTime || item.time || "N/A";
                    const displayPatient = item.patientName || item.name || item.patient?.name || "N/A";
                    const displayPaymentMode = item.paymentMode || "Offline";
                    const displayPaymentStatus = item.paymentStatus || "Pending";

                    return (
                      <tr
                        key={item._id || item.id || index}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="font-semibold text-slate-800">{displayDate}</div>
                          <div className="text-xs text-slate-500">{displayTime}</div>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-900">
                          {displayPatient}
                        </td>
                        <td className="py-4 px-6 text-slate-600 max-w-xs truncate">
                          {item.symptoms || "N/A"}
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-900">
                          ₹{item.amount || 0}
                        </td>
                        {/* New Payment Mode Column */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-slate-800 text-xs flex items-center gap-1">
                              <RxCardStack className="text-slate-400" /> {displayPaymentMode}
                            </span>
                            <span className={`text-[11px] font-medium ${
                              displayPaymentStatus === "Paid" || displayPaymentStatus === "Completed"
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}>
                              {displayPaymentStatus}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              item.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                : "bg-amber-50 text-amber-700 border border-amber-200/60"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.status === "Completed"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              }`}
                            />
                            {item.status || "Scheduled"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedAppointment(item)}
                            className="bg-slate-100 hover:bg-[#058b7c] hover:text-white text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden divide-y divide-slate-100">
            {loading ? (
              <p className="text-center py-6 text-slate-500 text-sm">Loading...</p>
            ) : safeAppointmentsList.length === 0 ? (
              <p className="text-center py-6 text-slate-500 text-sm">No appointments found.</p>
            ) : (
              safeAppointmentsList.map((item, index) => {
                const displayDate = formatDate(item.bookingDate || item.date);
                const displayTime = item.slotTime || item.time || "N/A";
                const displayPatient = item.patientName || item.name || item.patient?.name || "N/A";
                const displayPaymentMode = item.paymentMode || "Offline";
                const displayPaymentStatus = item.paymentStatus || "Pending";

                return (
                  <div key={item._id || item.id || index} className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">
                          {displayPatient}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1"><RxCalendar /> {displayDate}</span>
                          <span className="flex items-center gap-1"><RxClock /> {displayTime}</span>
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {item.status || "Scheduled"}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                      <p><span className="font-semibold text-slate-700">Symptoms:</span> {item.symptoms || "N/A"}</p>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                        <p><span className="font-semibold text-slate-700">Fee:</span> ₹{item.amount || 0}</p>
                        <p className="flex items-center gap-1 text-slate-700 font-medium">
                          <span>Mode:</span>
                          <span className="font-semibold text-slate-900">{displayPaymentMode}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                            displayPaymentStatus === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {displayPaymentStatus}
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedAppointment(item)}
                      className="w-full bg-[#058b7c] text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-[#047266] transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Wallet Modal */}
      {walletModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 text-[#058b7c] rounded-xl">
                  <IoWalletOutline className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Wallet Details</h3>
              </div>
              <button
                onClick={closeWalletModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <RxCross2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Credited Earnings
              </span>

              {checkMoney ? (
                <div className="py-2">
                  <span className="text-4xl font-extrabold text-[#058b7c]">
                    ₹2,500.00
                  </span>
                  <p className="text-xs text-slate-500 mt-2">
                    Available for direct bank withdrawal.
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  <span className="text-3xl font-extrabold text-slate-300">
                    ₹ ••••••••
                  </span>
                </div>
              )}

              {showPassword && (
                <div className="space-y-2 text-left">
                  <label className="text-xs font-semibold text-slate-700">
                    Security Verification
                  </label>
                  <div className="relative">
                    <RxLockClosed className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#058b7c]/20 focus:border-[#058b7c]"
                      type="password"
                      placeholder="Enter security password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {!checkMoney ? (
                <button
                  disabled={loading}
                  className="w-full bg-[#058b7c] hover:bg-[#047266] disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-xs"
                  onClick={() => {
                    if (showPassword) handleVerifyPassword();
                    else setShowPassword(true);
                  }}
                >
                  {loading
                    ? "Verifying..."
                    : showPassword
                    ? "Verify & Reveal"
                    : "Check Available Balance"}
                </button>
              ) : (
                <button
                  className="w-full bg-[#058b7c] hover:bg-[#047266] text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-xs"
                  onClick={() => {
                    alert("Funds settlement initiated. Direct deposit takes 24 hours.");
                    closeWalletModal();
                  }}
                >
                  Withdraw to Bank
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedAppointment.patientName || selectedAppointment.name || selectedAppointment.patient?.name || "Patient Details"}
                </h3>
                <p className="text-xs text-slate-500">
                  ID: #{selectedAppointment._id || selectedAppointment.id || "N/A"}
                </p>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <RxCross2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">
                    Date
                  </span>
                  <span className="font-semibold text-slate-800">
                    {formatDate(selectedAppointment.bookingDate || selectedAppointment.date)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">
                    Time Slot
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedAppointment.slotTime || selectedAppointment.time || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">
                    Age / Gender
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedAppointment.age ? `${selectedAppointment.age} Yrs` : "N/A"}
                    {selectedAppointment.gender ? ` • ${selectedAppointment.gender}` : ""}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">
                    Type
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedAppointment.consultation || selectedAppointment.type || selectedAppointment.appointment || "General"}
                  </span>
                </div>
              </div>

              {/* Payment Section in Modal */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">
                    Payment Mode
                  </span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <RxCardStack className="text-[#058b7c]" />
                    {selectedAppointment.paymentMode || "Offline"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">
                    Payment Status
                  </span>
                  <span className={`inline-block font-semibold text-xs px-2 py-0.5 rounded-full mt-0.5 ${
                    selectedAppointment.paymentStatus === "Paid" 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {selectedAppointment.paymentStatus || "Pending"}
                  </span>
                </div>
              </div>

              {selectedAppointment.contactNumber && (
                <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <RxMobile className="text-slate-400 w-4 h-4" />
                  <span className="text-xs text-slate-500 font-medium">Contact:</span>
                  <span className="text-xs font-semibold text-slate-800">{selectedAppointment.contactNumber}</span>
                </div>
              )}

              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">
                  Reported Symptoms
                </span>
                <p className="text-slate-700 bg-white border border-slate-200 p-3 rounded-xl font-normal">
                  {selectedAppointment.symptoms || "No symptoms listed."}
                </p>
              </div>

              {selectedAppointment.status !== "Completed" && (
                <div className="pt-2">
                  <button className="w-full bg-[#058b7c] hover:bg-[#047266] text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-xs flex items-center justify-center gap-2">
                    <RxCheck className="w-4 h-4" /> Join Telehealth Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
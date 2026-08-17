import React, { useState, useEffect } from "react";
import { RxGear } from 'react-icons/rx';
import { FiSettings } from 'react-icons/fi';
import Logo from '../assets/Logo.png';
import { 
  RxCross2, 
  RxCalendar, 
  RxClock, 
  RxPerson, 
  RxActivityLog, 
  RxLockClosed,
  RxCardStack,
  RxExit,
  RxChevronLeft,
  RxChevronRight
} from "react-icons/rx";
import { IoWalletOutline, IoFilterOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

// Header Component with Logout Button
const Header = ({ onLogout, onSettingsClick }) => (
  <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-xs">
    {/* Logo Section */}
    <div className="flex items-center space-x-3">
      <img 
        src={Logo} 
        alt="MEDSEWA Logo" 
        className="w-10 h-10 object-contain" 
      />
      <span className="font-bold text-xl tracking-tight text-gray-900">
        MED<span className="text-[#058b7c]">SEWA</span>
      </span>
    </div>

    {/* Right Section: Doctor Info, Settings & Logout */}
    <div className="flex items-center space-x-3">
      {/* Settings Button */}
      <button
        onClick={onSettingsClick}
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 px-3 py-2 rounded-xl transition-colors cursor-pointer"
        title="Settings"
      >
        <FiSettings className="w-4 h-4 text-gray-600" />
        <span className="hidden md:inline">Settings</span>
      </button>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 px-3 py-2 rounded-xl transition-colors cursor-pointer"
        title="Logout"
      >
        <RxExit className="w-4 h-4" />
        <span className="hidden md:inline">Logout</span>
      </button>
    </div>
  </header>
);

const Dashboard = () => {
  const navigate = useNavigate();
  
  // State management
  const [checkMoney, setCheckMoney] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [walletMoney, setwalletMoney] = useState(0);

  // Dynamic Data States
  const [appointments, setAppointments] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState({ name: "", image: "" });
  const [loading, setLoading] = useState(false);

  // Filter & Pagination States
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSettings = () => {
    navigate('/Doctor/Settings');
  };
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/doctors/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      window.location.href = "/login";
    }
  };

  // Status Change Handler
  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setAppointments((prev) =>
        prev.map((item) =>
          (item._id || item.id) === appointmentId ? { ...item, status: newStatus } : item
        )
      );

      await fetch(`${API_BASE_URL}/api/doctors/update/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: appointmentId, status: newStatus }),
      });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  async function getName() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/doctors/get/name/image`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();
      if (data.success) {
        setDoctorInfo({ name: data.name, image: data.image });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handlewithdraw() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/doctors/widthraw/money`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();
      if (data.success) {
        setwalletMoney(0);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/doctors/get/all/appointments`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    getName();
  }, []);

  const handleVerifyPassword = async () => {
    if (!password) {
      alert("Please enter security password");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/doctors/verify/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success || response.ok) {
        setCheckMoney(true);
        setShowPassword(false);
        setPassword("");
        setwalletMoney(data.data);
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

  const safeAppointmentsList = Array.isArray(appointments) ? appointments : [];
  const totalEarnings = safeAppointmentsList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalPatients = safeAppointmentsList.length;

  const filteredAppointments = safeAppointmentsList.filter((item) => {
    if (statusFilter === "All") return true;
    const itemStatus = (item.status || "Pending").toLowerCase();
    return itemStatus === statusFilter.toLowerCase();
  });

  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const closeWalletModal = () => {
    setWalletModalOpen(false);
    setCheckMoney(false);
    setShowPassword(false);
    setPassword("");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? dateStr : parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 antialiased font-sans">
      <Header 
        onLogout={handleLogout} 
        onSettingsClick={handleSettings} 
      />
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
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                {checkMoney ? `₹${walletMoney}` : "••••••••"}
              </span>
              <span className="text-xs font-semibold text-[#058b7c] group-hover:underline">
                Tap to View →
              </span>
            </div>
          </div>

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
          <div className="px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Appointments Overview
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Showing {filteredAppointments.length} entries ({statusFilter} Filter)
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <IoFilterOutline className="text-slate-400 w-4 h-4 hidden sm:block" />
              {["All", "Pending", "Ongoing", "Completed", "Cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    statusFilter === status
                      ? "bg-[#058b7c] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
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
                  <th className="py-4 px-6">Status (Select)</th>
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
                ) : paginatedAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-slate-500">
                      No {statusFilter.toLowerCase()} appointments found.
                    </td>
                  </tr>
                ) : (
                  paginatedAppointments.map((item, index) => {
                    const id = item._id || item.id || index;
                    const displayDate = formatDate(item.bookingDate || item.date);
                    const displayTime = item.slotTime || item.time || "N/A";
                    const displayPatient = item.patientName || item.name || item.patient?.name || "N/A";
                    const displayPaymentMode = item.paymentMode || "Offline";
                    const displayPaymentStatus = item.paymentStatus || "Pending";
                    const currentStatus = item.status || "Pending";
                    const isStatusLocked = currentStatus === "Completed" || currentStatus === "Cancelled";

                    return (
                      <tr key={id} className="hover:bg-slate-50/60 transition-colors">
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
                          <select
                            value={currentStatus}
                            disabled={isStatusLocked}
                            onChange={(e) => handleStatusChange(id, e.target.value)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-xl border outline-none transition-colors ${
                              isStatusLocked ? "opacity-60 cursor-not-allowed bg-slate-100 text-slate-500 border-slate-200" : "cursor-pointer"
                            } ${
                              currentStatus === "Completed"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : currentStatus === "Ongoing"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : currentStatus === "Cancelled"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            <option value="Pending" className="bg-white text-slate-800">Pending</option>
                            <option value="Ongoing" className="bg-white text-slate-800">Ongoing</option>
                            <option value="Completed" className="bg-white text-slate-800">Completed</option>
                            <option value="Cancelled" className="bg-white text-slate-800">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedAppointment(item)}
                            className="bg-slate-100 hover:bg-[#058b7c] hover:text-white text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
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
            ) : paginatedAppointments.length === 0 ? (
              <p className="text-center py-6 text-slate-500 text-sm">No {statusFilter.toLowerCase()} appointments found.</p>
            ) : (
              paginatedAppointments.map((item, index) => {
                const id = item._id || item.id || index;
                const displayDate = formatDate(item.bookingDate || item.date);
                const displayTime = item.slotTime || item.time || "N/A";
                const displayPatient = item.patientName || item.name || item.patient?.name || "N/A";
                const displayPaymentMode = item.paymentMode || "Offline";
                const displayPaymentStatus = item.paymentStatus || "Pending";
                const currentStatus = item.status || "Pending";
                const isStatusLocked = currentStatus === "Completed" || currentStatus === "Cancelled";
                
                return (
                  <div key={id} className="p-5 space-y-3">
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

                      <select
                        value={currentStatus}
                        disabled={isStatusLocked}
                        onChange={(e) => handleStatusChange(id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-xl border outline-none ${
                          isStatusLocked ? "opacity-60 cursor-not-allowed bg-slate-100 text-slate-500 border-slate-200" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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
                      className="w-full bg-[#058b7c] text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-[#047266] transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* PAGINATION CONTROLS */}
          {filteredAppointments.length > 0 && (
            <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Page <span className="font-bold text-slate-800">{currentPage}</span> of{" "}
                <span className="font-bold text-slate-800">{totalPages}</span>
              </span>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Previous Page"
                >
                  <RxChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-[#058b7c] text-white shadow-2xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Next Page"
                >
                  <RxChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
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
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
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
                    ₹{walletMoney}
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
                  className="w-full bg-[#058b7c] hover:bg-[#047266] disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-xs cursor-pointer"
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
                  className="w-full bg-[#058b7c] hover:bg-[#047266] text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-xs cursor-pointer"
                  onClick={() => {
                    handlewithdraw();
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
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <RxCross2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Date</span>
                  <span className="font-semibold text-slate-800">
                    {formatDate(selectedAppointment.bookingDate || selectedAppointment.date)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Time Slot</span>
                  <span className="font-semibold text-slate-800">
                    {selectedAppointment.slotTime || selectedAppointment.time || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Age / Gender</span>
                  <span className="font-semibold text-slate-800">
                    {selectedAppointment.age ? `${selectedAppointment.age} Yrs` : "N/A"}
                    {selectedAppointment.gender ? ` • ${selectedAppointment.gender}` : ""}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Consultation Fee</span>
                  <span className="font-semibold text-slate-800">
                    ₹{selectedAppointment.amount || 0}
                  </span>
                </div>
                {/* Contact Number Field */}
                <div className="col-span-2 pt-2 border-t border-slate-200/60">
                  <span className="text-xs text-slate-400 font-medium block">Contact Number</span>
                  <span className="font-semibold text-slate-800">
                    {selectedAppointment.contactNumber || selectedAppointment.phone || selectedAppointment.patient?.contactNumber || selectedAppointment.patient?.phone || "N/A"}
                  </span>
                </div>
              </div>

              {/* Symptoms */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-xs text-slate-400 font-medium block">Symptoms / Description</span>
                <p className="text-slate-700 font-medium text-xs leading-relaxed">
                  {selectedAppointment.symptoms || "No symptoms provided."}
                </p>
              </div>

              {/* Meeting Link Section - Visible ONLY if status is Pending or Ongoing */}
              {selectedAppointment.meetingLink && 
               (selectedAppointment.status === "Pending" || selectedAppointment.status === "Ongoing" || !selectedAppointment.status) && (
                <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-100 space-y-2">
                  <span className="text-xs text-[#058b7c] font-bold uppercase tracking-wider block">Video Consultation</span>
                  <a 
                    href={selectedAppointment.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#058b7c] hover:bg-[#047266] px-4 py-2 rounded-xl transition-colors shadow-xs"
                  >
                    Join Video Call ↗
                  </a>
                </div>
              )}

              {/* Status & Quick Action Note */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Current Status</span>
                  <span className={`text-xs font-bold inline-block mt-0.5 ${
                    selectedAppointment.status === "Completed" ? "text-emerald-600" :
                    selectedAppointment.status === "Ongoing" ? "text-blue-600" :
                    selectedAppointment.status === "Cancelled" ? "text-rose-600" : "text-amber-600"
                  }`}>
                    {selectedAppointment.status || "Pending"}
                  </span>
                </div>

                {(!selectedAppointment.status || selectedAppointment.status === "Pending") && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedAppointment._id || selectedAppointment.id, "Ongoing");
                      setSelectedAppointment(prev => ({ ...prev, status: "Ongoing" }));
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Mark Ongoing
                  </button>
                )}

                {selectedAppointment.status === "Ongoing" && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedAppointment._id || selectedAppointment.id, "Completed");
                      setSelectedAppointment(prev => ({ ...prev, status: "Completed" }));
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
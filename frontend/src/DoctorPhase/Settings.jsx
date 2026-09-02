import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiSave, 
  FiUser, 
  FiHome, 
  FiCalendar, 
  FiCamera,
  FiCheckCircle,
  FiLock,
  FiLoader,
  FiClock
} from 'react-icons/fi';

// ⚙️ Backend API URL
const API_BASE_URL = "https://health-care-system-2-bo26.onrender.com/api/doctors";

const Settings = ({ userRole = "doctor" }) => {
  const navigate = useNavigate();

  // 1. Loading & State Management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    email: "",
    phone: "",
    experience: "",
    profileImage: "",
    clinicName: "MedSewa Care Center",
    clinicAddress: "",
    consultationFee: "",
    // Default Schedule Array
    weeklySchedule: daysOfWeek.map((day) => ({
      day,
      start: "10:00 AM",
      end: "06:00 PM",
      status: true // true = Working Day, false = Off Day
    }))
  });

  // ----------------------------------------------------
  // 📥 2. FETCH SETTINGS ON MOUNT (Using fetch)
  // ----------------------------------------------------
  useEffect(() => {
    if (userRole === "doctor") {
      fetchDoctorSettings();
    }
  }, [userRole]);

  const fetchDoctorSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Cookie send karne ke liye
      });

      const result = await res.json();
      console.log("📥 Full Backend Response:", result);

      if (res.ok && result.success) {
        const { name, gmail, contactNo, specification, experience, fee, image, weekly } = result.data;

        // Merge fetched weekly data with default schedule structure
        let updatedSchedule = daysOfWeek.map((day) => {
          const match = weekly && Array.isArray(weekly) ? weekly.find((item) => item.day === day) : null;
          return {
            day: day,
            start: match?.start || "10:00 AM",
            end: match?.end || "06:00 PM",
            status: match ? match.status : true,
          };
        });

        setFormData((prev) => ({
          ...prev,
          name: name || "",
          email: gmail || "",
          phone: contactNo || "",
          specialization: specification || "",
          experience: experience || "",
          consultationFee: fee || "",
          profileImage: image || "",
          weeklySchedule: updatedSchedule,
        }));
      } else {
        setErrorMsg(result.message || "Failed to load settings.");
      }
    } catch (err) {
      console.error("❌ Error fetching settings:", err);
      setErrorMsg("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // 🔐 3. ROLE ACCESS RESTRICTION
  // ----------------------------------------------------
  if (userRole !== "doctor") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center max-w-md shadow-xs">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiLock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-xs text-gray-500 mb-6">
            Only verified Doctors have permission to modify clinic settings and holiday schedules.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-[#058b7c] text-white text-xs font-semibold py-3 rounded-xl hover:bg-[#047266] transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ✏️ HANDLERS & API CALLS
  // ----------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
    }
  };

  // Status (On/Off) toggle karne ka handler
  const handleDayStatusToggle = (dayName) => {
    const updatedSchedule = formData.weeklySchedule.map((item) => {
      if (item.day === dayName) {
        return { ...item, status: !item.status };
      }
      return item;
    });

    setFormData((prev) => ({ ...prev, weeklySchedule: updatedSchedule }));
    syncWeeklyOffToBackend(updatedSchedule);
  };

  // Start/End Time Change karne ka handler
  const handleTimeChange = (dayName, field, value) => {
    const updatedSchedule = formData.weeklySchedule.map((item) => {
      if (item.day === dayName) {
        return { ...item, [field]: value };
      }
      return item;
    });

    setFormData((prev) => ({ ...prev, weeklySchedule: updatedSchedule }));
  };

  // Schedule Sync with Backend API using Fetch
  const syncWeeklyOffToBackend = async (scheduleToSync) => {
    try {
      const res = await fetch(`${API_BASE_URL}/weekly-off`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ weekly: scheduleToSync }),
      });

      const result = await res.json();
      console.log("🔄 Weekly Schedule Updated Response:", result);
    } catch (err) {
      console.error("❌ Failed to update weekly schedule:", err);
      alert("Failed to update schedule on server");
    }
  };

  // Save General Profile Settings using Fetch
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    try {
      const payload = {
        name: formData.name,
        experience: formData.experience,
        fee: formData.consultationFee,
        contactNo: formData.phone,
        specification: formData.specialization,
      };

      console.log("📤 Sending Settings Payload:", payload);

      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // Schedule time updates bhi sath me save karein
        await syncWeeklyOffToBackend(formData.weeklySchedule);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        setErrorMsg(result.message || "Failed to save settings.");
      }
    } catch (err) {
      console.error("❌ Error saving settings:", err);
      setErrorMsg("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------------------
  // ⏳ LOADING SCREEN
  // ----------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <FiLoader className="w-8 h-8 text-[#058b7c] animate-spin mb-3" />
        <p className="text-sm font-semibold text-gray-600">Loading Doctor Settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              title="Go Back"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Doctor Settings & Schedule</h1>
              <p className="text-xs text-gray-500">Manage profile, clinic fees, and weekly timings</p>
            </div>
          </div>
          
          {isSaved && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3.5 py-2 rounded-xl transition-all">
              <FiCheckCircle className="w-4 h-4 text-emerald-600" />
              Settings Saved!
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* Main Settings Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-10">
          
          {/* Section 1: Doctor Profile */}
          <div>
            <div className="flex items-center space-x-2 text-[#058b7c] font-bold text-base mb-6">
              <span className="p-2 bg-[#058b7c]/10 rounded-lg"><FiUser className="w-5 h-5" /></span>
              <h2>Doctor Personal Details</h2>
            </div>
            
            <div className="flex items-center space-x-5 mb-6">
              <div className="relative w-20 h-20 rounded-2xl bg-[#058b7c]/10 border-2 border-dashed border-[#058b7c]/30 flex items-center justify-center overflow-hidden">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#058b7c] font-bold text-2xl">DR</span>
                )}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <FiCamera className="w-5 h-5" />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Profile Picture</p>
                <p className="text-xs text-gray-500 mt-0.5">Click photo to upload new avatar</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Doctor Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#058b7c] text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#058b7c] text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#058b7c] text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#058b7c] text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section 2: Clinic & Fees */}
          <div>
            <div className="flex items-center space-x-2 text-[#058b7c] font-bold text-base mb-6">
              <span className="p-2 bg-[#058b7c]/10 rounded-lg"><FiHome className="w-5 h-5" /></span>
              <h2>Clinic Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Consultation Fee (₹)</label>
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#058b7c] text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section 3: Weekly Timings & Schedule Setup */}
          <div>
            <div className="flex items-center space-x-2 text-[#058b7c] font-bold text-base mb-6">
              <span className="p-2 bg-[#058b7c]/10 rounded-lg"><FiCalendar className="w-5 h-5" /></span>
              <h2>Weekly Timings & Off Days</h2>
            </div>

            <div className="space-y-3">
              {formData.weeklySchedule.map((item) => (
                <div 
                  key={item.day}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    item.status 
                      ? "bg-white border-gray-200" 
                      : "bg-rose-50/40 border-rose-100"
                  }`}
                >
                  {/* Day Toggle Button */}
                  <div className="flex items-center justify-between md:w-48">
                    <span className="text-sm font-bold text-gray-800">{item.day}</span>
                    <button
                      type="button"
                      onClick={() => handleDayStatusToggle(item.day)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        item.status
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-rose-500 text-white"
                      }`}
                    >
                      {item.status ? "Working" : "Day Off"}
                    </button>
                  </div>

                  {/* Time Inputs (Shown only if Working) */}
                  {item.status ? (
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={item.start}
                        onChange={(e) => handleTimeChange(item.day, 'start', e.target.value)}
                        placeholder="Start Time (e.g. 10:00 AM)"
                        className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium w-32 focus:bg-white focus:border-[#058b7c] outline-none"
                      />
                      <span className="text-gray-400 text-xs">to</span>
                      <input
                        type="text"
                        value={item.end}
                        onChange={(e) => handleTimeChange(item.day, 'end', e.target.value)}
                        placeholder="End Time (e.g. 06:00 PM)"
                        className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium w-32 focus:bg-white focus:border-[#058b7c] outline-none"
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-rose-500 italic">Clinic Closed on {item.day}s</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#058b7c] hover:bg-[#047266] text-white px-8 py-3 rounded-2xl font-semibold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" /> Save Settings
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Settings;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FiArrowLeft, 
  FiSave, 
  FiUser, 
  FiHome, 
  FiCalendar, 
  FiCamera,
  FiCheckCircle,
  FiLock,
  FiLoader
} from 'react-icons/fi';

// ⚙️ Backend API URL (Port 8000)
const API_BASE_URL = "http://localhost:8000/api/doctors";

const Settings = ({ userRole = "doctor" }) => {
  const navigate = useNavigate();

  // 1. Loading & State Management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
    timings: "10:00 AM - 06:00 PM",
    weeklyOff: [],
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // axios config with credentials to pass cookies automatically
  const axiosConfig = {
    withCredentials: true,
  };

  // ----------------------------------------------------
  // 📥 2. FETCH SETTINGS ON MOUNT
  // ----------------------------------------------------
  useEffect(() => {
    if (userRole === "doctor") {
      fetchDoctorSettings();
    }
  }, [userRole]);

  const fetchDoctorSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/settings`, axiosConfig);

      // 🔍 PRINT FULL BACKEND RESPONSE ON CONSOLE
      console.log("📥 Full Backend Response:", res.data);
      console.log("📦 Response Data Object:", res.data.data);

      if (res.data.success) {
        const { name, gmail, contactNo, specification, experience, fee, image, weekly } = res.data.data;

        // Database ke { day, start, end, status } array se off days nikalna (jiska status false ho)
        const weeklyOffDays = weekly && Array.isArray(weekly)
          ? weekly.filter(item => item.status === false).map(item => item.day)
          : [];

        console.log("📅 Computed Weekly Off Days:", weeklyOffDays);

        setFormData((prev) => ({
          ...prev,
          name: name || "",
          email: gmail || "",
          phone: contactNo || "",
          specialization: specification || "",
          experience: experience || "",
          consultationFee: fee || "",
          profileImage: image || "",
          weeklyOff: weeklyOffDays,
        }));
      }
    } catch (err) {
      console.error("❌ Error fetching settings:", err);
      setErrorMsg(err.response?.data?.message || "Failed to load settings.");
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

  // General Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Profile Image Handling (Preview)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
    }
  };

  // Toggle Weekly Off Days & Sync to Backend
  const toggleWeeklyOff = async (day) => {
    const updatedWeeklyOff = formData.weeklyOff.includes(day)
      ? formData.weeklyOff.filter((d) => d !== day)
      : [...formData.weeklyOff, day];

    setFormData((prev) => ({ ...prev, weeklyOff: updatedWeeklyOff }));

    // Database ke exact schema (`day, start, end, status`) ke mutabiq payload banana
    const fullWeeklySchedule = daysOfWeek.map((d) => {
      const isOff = updatedWeeklyOff.includes(d);
      return {
        day: d,
        start: "10:00 AM",
        end: "06:00 PM",
        status: !isOff // Agar off list me hai toh false, warna true
      };
    });

    try {
      const res = await axios.put(`${API_BASE_URL}/weekly-off`, { weekly: fullWeeklySchedule }, axiosConfig);
      console.log("🔄 Weekly Off Updated Response:", res.data);
    } catch (err) {
      console.error("❌ Failed to update weekly off:", err);
      alert("Failed to update weekly off on server");
    }
  };

  // Save Settings Submit
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
      const res = await axios.put(`${API_BASE_URL}/settings`, payload, axiosConfig);
      console.log("📥 Settings Update Response:", res.data);

      if (res.data.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      console.error("❌ Error saving settings:", err);
      setErrorMsg(err.response?.data?.message || "Failed to save settings.");
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
              <p className="text-xs text-gray-500">Manage profile, clinic fees, and weekly off schedule</p>
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

          {/* Section 3: Weekly Off Schedule */}
          <div>
            <div className="flex items-center space-x-2 text-[#058b7c] font-bold text-base mb-6">
              <span className="p-2 bg-[#058b7c]/10 rounded-lg"><FiCalendar className="w-5 h-5" /></span>
              <h2>Weekly Schedule Setup</h2>
            </div>

            {/* Weekly Off Days */}
            <div className="bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-3">
                Weekly Fixed Off Days
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => {
                  const isOff = formData.weeklyOff.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleWeeklyOff(day)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isOff
                          ? "bg-rose-500 text-white shadow-xs"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {day} {isOff && "✓"}
                    </button>
                  );
                })}
              </div>
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
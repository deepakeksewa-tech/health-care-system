import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiSave, 
  FiUser, 
  FiCalendar, 
  FiCheckCircle,
  FiLoader,
  FiClock
} from 'react-icons/fi';

const API_BASE_URL = "https://health-care-system-vv00.onrender.com";

const Settings = ({ userRole = "doctor" }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    phone: "",
    experience: "",
    profileImage: "",
    consultationFee: "",
    weeklySchedule: daysOfWeek.map((day) => ({
      day,
      start: "10:00 AM",
      end: "06:00 PM",
      status: true
    }))
  });

  // ----------------------------------------------------
  // 📥 FETCH SETTINGS ON MOUNT
  // ----------------------------------------------------
  useEffect(() => {
    if (userRole === "doctor") {
      fetchDoctorSettings();
    }
  }, [userRole]);

  const fetchDoctorSettings = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/doctors/settings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include"
      });

      const result = await res.json();

      if (res.ok && result.success) {
        const { name, contactNo, specification, experience, fee, image, weekly } = result.data || {};

        let updatedSchedule = daysOfWeek.map((day) => {
          const match = weekly && Array.isArray(weekly) ? weekly.find((item) => item.day === day) : null;
          const isWorking = match ? (match.status === true || match.status === "true" || match.status === 1) : false;

          return {
            day: day,
            start: match?.start || (isWorking ? "10:00 AM" : ""),
            end: match?.end || (isWorking ? "06:00 PM" : ""),
            status: isWorking,
          };
        });

        setFormData({
          name: name || "",
          phone: contactNo || "",
          specialization: specification || "",
          experience: experience || "",
          consultationFee: fee || "",
          profileImage: image || "",
          weeklySchedule: updatedSchedule,
        });
      } else {
        setErrorMsg(result.message || "Failed to fetch details.");
      }
    } catch (err) {
      console.error("❌ Error fetching settings:", err);
      setErrorMsg("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // ✏️ HANDLERS
  // ----------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayStatusToggle = (dayName) => {
    const updatedSchedule = formData.weeklySchedule.map((item) => {
      if (item.day === dayName) {
        const newStatus = !item.status;
        return { 
          ...item, 
          status: newStatus,
          start: newStatus ? (item.start && item.start.trim() ? item.start : "10:00 AM") : item.start,
          end: newStatus ? (item.end && item.end.trim() ? item.end : "06:00 PM") : item.end
        };
      }
      return item;
    });
    setFormData((prev) => ({ ...prev, weeklySchedule: updatedSchedule }));
  };

  const handleTimeChange = (dayName, field, value) => {
    const updatedSchedule = formData.weeklySchedule.map((item) => {
      if (item.day === dayName) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setFormData((prev) => ({ ...prev, weeklySchedule: updatedSchedule }));
  };

  // ----------------------------------------------------
  // 💾 SAVE SETTINGS (CALLING 2 SEPARATE APIs)
  // ----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      // 1️⃣ Payload for Doctor Profile Info
      const profilePayload = {
        name: formData.name,
        experience: formData.experience,
        fee: formData.consultationFee,
        contactNo: formData.phone,
        specification: formData.specialization
      };

      // 2️⃣ Payload for Weekly Off Schedule
      const formattedWeekly = formData.weeklySchedule.map(item => ({
        day: String(item.day),
        start: String(item.start || (item.status ? "10:00 AM" : "")),
        end: String(item.end || (item.status ? "06:00 PM" : "")),
        status: Boolean(item.status)
      }));

      const weeklyPayload = {
        weekly: formattedWeekly
      };

      // 🚀 Both APIs calling in Parallel via Promise.all
      // Note: Endpoint URLs apne backend routes ke hisab se confirm kar lena
      const [profileRes, weeklyRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/doctors/profile`, {
          method: "PUT",
          headers,
          credentials: "include",
          body: JSON.stringify(profilePayload)
        }),
        fetch(`${API_BASE_URL}/api/doctors/weekly-off`, {
          method: "PUT",
          headers,
          credentials: "include",
          body: JSON.stringify(weeklyPayload)
        })
      ]);

      const profileData = await profileRes.json();
      const weeklyData = await weeklyRes.json();

      if (profileRes.ok && weeklyRes.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        setErrorMsg(profileData.message || weeklyData.message || "Something went wrong while saving.");
      }

    } catch (err) {
      console.error("❌ Error updating settings:", err);
      setErrorMsg("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <FiLoader className="w-8 h-8 text-[#058b7c] animate-spin mb-3" />
        <p className="text-sm font-semibold text-gray-600">Loading Doctor Profile...</p>
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
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Doctor Profile Settings</h1>
              <p className="text-xs text-gray-500">Manage profile and schedule details</p>
            </div>
          </div>
          
          {isSaved && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl">
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

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          {/* Section 1: Profile Info */}
          <div>
            <div className="flex items-center space-x-2 text-[#058b7c] font-bold text-base mb-6">
              <span className="p-2 bg-[#058b7c]/10 rounded-lg"><FiUser className="w-5 h-5" /></span>
              <h2>Personal Information</h2>
            </div>
            
            <div className="flex items-center space-x-5 mb-6">
              <div className="relative w-20 h-20 rounded-2xl bg-[#058b7c]/10 border-2 border-dashed border-[#058b7c]/30 flex items-center justify-center overflow-hidden">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#058b7c] font-bold text-2xl">DR</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{formData.name || "Doctor"}</p>
                <p className="text-xs text-gray-500 capitalize">{formData.specialization || "Specialist"}</p>
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
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Experience (Years)</label>
                <input
                  type="number"
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

          {/* Section 2: Timings */}
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
                    item.status ? "bg-white border-gray-200" : "bg-rose-50/40 border-rose-100"
                  }`}
                >
                  <div className="flex items-center justify-between md:w-48">
                    <span className="text-sm font-bold text-gray-800">{item.day}</span>
                    <button
                      type="button"
                      onClick={() => handleDayStatusToggle(item.day)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer ${
                        item.status 
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                          : "bg-rose-500 text-white"
                      }`}
                    >
                      {item.status ? "Working" : "Day Off"}
                    </button>
                  </div>

                  {item.status ? (
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={item.start}
                        onChange={(e) => handleTimeChange(item.day, 'start', e.target.value)}
                        placeholder="e.g. 10:00 AM"
                        className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium w-32 focus:bg-white focus:border-[#058b7c] outline-none"
                      />
                      <span className="text-gray-400 text-xs">to</span>
                      <input
                        type="text"
                        value={item.end}
                        onChange={(e) => handleTimeChange(item.day, 'end', e.target.value)}
                        placeholder="e.g. 06:00 PM"
                        className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium w-32 focus:bg-white focus:border-[#058b7c] outline-none"
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-rose-500 italic">Closed on {item.day}s</span>
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
              className="flex items-center gap-2 bg-[#058b7c] hover:bg-[#047266] text-white px-8 py-3 rounded-2xl font-semibold text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />} Save Settings
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Settings;
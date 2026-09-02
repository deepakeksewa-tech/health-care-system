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

// ⚙️ Base URL Fix (Endpoint prefix remove kar diya hai)
const API_BASE_URL = "https://health-care-system-2-bo26.onrender.com";

const Settings = ({ userRole = "doctor" }) => {
  const navigate = useNavigate();

  // 1. State Management
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

      // LocalStorage se token retrieve karein
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/doctors/settings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Token header mandatory hai
        },
        credentials: "include"
      });

      const result = await res.json();
      console.log("📥 Backend Fetch Result:", result);

      if (res.ok && result.success) {
        const { name, gmail, contactNo, specification, experience, fee, image, weekly } = result.data || {};

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
        setErrorMsg(result.message || "Failed to load doctor settings.");
      }
    } catch (err) {
      console.error("❌ Error fetching settings:", err);
      setErrorMsg("Server se connect nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // ✏️ HANDLERS & SAVE FUNCTION
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

  const handleDayStatusToggle = (dayName) => {
    const updatedSchedule = formData.weeklySchedule.map((item) => {
      if (item.day === dayName) {
        return { ...item, status: !item.status };
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: formData.name,
        experience: formData.experience,
        fee: formData.consultationFee,
        contactNo: formData.phone,
        specification: formData.specialization,
      };

      const res = await fetch(`${API_BASE_URL}/api/doctors/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        setErrorMsg(result.message || "Settings save nahi ho payi.");
      }
    } catch (err) {
      console.error("❌ Error saving settings:", err);
      setErrorMsg("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <FiLoader className="w-8 h-8 text-[#058b7c] animate-spin mb-3" />
        <p className="text-sm font-semibold text-gray-600">Doctor details load ho rahi hain...</p>
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
              <p className="text-xs text-gray-500">Manage personal and clinic details</p>
            </div>
          </div>
          
          {isSaved && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3.5 py-2 rounded-xl">
              <FiCheckCircle className="w-4 h-4 text-emerald-600" />
              Saved Successfully!
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          {/* Profile Details */}
          <div>
            <div className="flex items-center space-x-2 text-[#058b7c] font-bold text-base mb-6">
              <span className="p-2 bg-[#058b7c]/10 rounded-lg"><FiUser className="w-5 h-5" /></span>
              <h2>Personal Information</h2>
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

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#058b7c] hover:bg-[#047266] text-white px-8 py-3 rounded-2xl font-semibold text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />} Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Settings;
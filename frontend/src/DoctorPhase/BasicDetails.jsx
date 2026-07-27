import React, { useState, useEffect } from 'react';
import Header from '../component/Header';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const BasicDetails = () => {
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_URL;
  const { token } = useParams();

  // Form Field States
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [specialization, setSpecialization] = useState("");
  const [otherSpecialization, setOtherSpecialization] = useState("");
  const [loading, setLoading] = useState(false);

  // Multi-language States
  const [languageInput, setLanguageInput] = useState("");
  const [languages, setLanguages] = useState([]);

  const [contactNo, setContactNo] = useState("");
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [fee, setFee] = useState("");

  // Fetched Dropdown Data
  const [specializationList, setSpecializationList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  // Errors
  const [errors, setErrors] = useState({});

  // File Change & Preview Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  const handleTextOnlyChange = (e, setter) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s,]*$/.test(value)) {
      setter(value);
    }
  };

  // Language Tag Handlers
  const handleLanguageKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = languageInput.trim().replace(/,/g, '');

      if (trimmed) {
        const exists = languages.some((lang) => lang.toLowerCase() === trimmed.toLowerCase());
        if (!exists) {
          setLanguages([...languages, trimmed]);
        }
        setLanguageInput("");
      }
    }
  };

  const removeLanguage = (indexToRemove) => {
    setLanguages(languages.filter((_, index) => index !== indexToRemove));
  };

  const handleExperienceChange = (e) => {
    let val = e.target.value;
    if (val === "") {
      setExperience("");
      return;
    }
    let numVal = parseInt(val, 10);
    if (isNaN(numVal)) return;
    if (numVal < 0) numVal = 0;
    if (numVal > 99) numVal = 99;
    setExperience(numVal.toString());
  };

  const validate = () => {
    let localErrors = {};

    if (!name.trim()) {
      localErrors.name = "Full name is required";
    } else if (name.trim().length < 3) {
      localErrors.name = "Name must be at least 3 characters long";
    }

    if (experience === "") {
      localErrors.experience = "Experience is required";
    } else if (Number(experience) < 0 || Number(experience) > 99) {
      localErrors.experience = "Experience must be between 0 and 99 years";
    }

    if (!image) {
      localErrors.image = "Profile picture is required";
    }

    if (!specialization) {
      localErrors.specialization = "Please select a specialization";
    } else if (specialization === "Other" && !otherSpecialization.trim()) {
      localErrors.otherSpecialization = "Please specify your specialization";
    }

    if (languages.length === 0 && !languageInput.trim()) {
      localErrors.language = "At least one language is required";
    }

    const phoneRegex = /^[0-9]{10,12}$/;
    if (!contactNo.trim()) {
      localErrors.contactNo = "Contact number is required";
    } else if (!phoneRegex.test(contactNo.replace(/[\s-+]/g, ""))) {
      localErrors.contactNo = "Enter a valid phone number (10-12 digits)";
    }

    if (!category) {
      localErrors.category = "Please select a category";
    } else if (category === "Other" && !otherCategory.trim()) {
      localErrors.otherCategory = "Please specify your category";
    }

    if (!fee || fee.trim() === "") {
      localErrors.fee = "Consultation fee is required";
    } else if (Number(fee) < 0) {
      localErrors.fee = "Fee cannot be negative";
    }

    setErrors(localErrors);
    return Object.keys(localErrors).length === 0;
  };

  async function nextPhase(e) {
    e.preventDefault();

    let currentLanguages = [...languages];
    if (languageInput.trim()) {
      const trimmed = languageInput.trim().replace(/,/g, '');
      if (trimmed && !currentLanguages.some((l) => l.toLowerCase() === trimmed.toLowerCase())) {
        currentLanguages.push(trimmed);
        setLanguages(currentLanguages);
        setLanguageInput("");
      }
    }

    if (!validate()) return;

    try {
      setLoading(true);

      if (category === "Other" && otherCategory.trim()) {
        await fetch(`${api}/api/doctors/Category`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Category: otherCategory.trim() }),
        });
      }

      if (specialization === "Other" && otherSpecialization.trim()) {
        await fetch(`${api}/api/doctors/Specialization`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Specialization: otherSpecialization.trim() }),
        });
      }

      const finalCategory = category === "Other" ? otherCategory.trim() : category;
      const finalSpecialization = specialization === "Other" ? otherSpecialization.trim() : specialization;
      const formattedLanguages = currentLanguages.join(", ");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("experience", experience);
      formData.append("specification", finalSpecialization);
      formData.append("language", formattedLanguages);
      formData.append("languages", JSON.stringify(currentLanguages));
      formData.append("contactNo", contactNo);
      formData.append("category", finalCategory);
      formData.append("fee", fee);
      formData.append("image", image);

      const response = await fetch(`${api}/api/doctors/createBasic/${token}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Basic details saved successfully!");
        setTimeout(() => {
          navigate("/LocationSetup");
        }, 1200);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function readSpecialization() {
    try {
      const response = await fetch(`${api}/api/doctors/ReadSpecialization`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data && data.data) setSpecializationList(data.data);
    } catch (err) {
      console.error("Error fetching specializations:", err);
    }
  }

  async function readCategory() {
    try {
      const response = await fetch(`${api}/api/doctors/ReadCategory`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data && data.data) setCategoryList(data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  useEffect(() => {
    readSpecialization();
    readCategory();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <Header />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-xs z-50">
          <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-2xl shadow-xl">
            <div className="w-10 h-10 border-4 border-[#058b7c] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 font-medium">Saving details...</p>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Basic Information</h1>
              <p className="text-sm text-gray-500 mt-1">Please fill in your professional profile details below.</p>
            </div>

            <form onSubmit={nextPhase} className="space-y-5">
              
              {/* Profile Image & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-4 flex flex-col items-center sm:items-start">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                    Profile Photo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#058b7c] transition flex items-center justify-center bg-gray-50 overflow-hidden cursor-pointer">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-2">
                        <svg className="w-6 h-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="text-[10px] text-gray-400 block mt-1">Upload</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                </div>

                <div className="sm:col-span-8">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Dr. John Doe"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-800 transition focus:outline-none focus:ring-2 ${
                      errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#058b7c] focus:ring-[#058b7c]/20'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
              </div>

              {/* Experience & Contact Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    Experience (Years) <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={experience}
                    onChange={handleExperienceChange}
                    type="number"
                    min="0"
                    max="99"
                    placeholder="e.g. 8"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-800 transition focus:outline-none focus:ring-2 ${
                      errors.experience ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#058b7c] focus:ring-[#058b7c]/20'
                    }`}
                  />
                  {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    type="tel"
                    placeholder="+91 98765 43210"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-800 transition focus:outline-none focus:ring-2 ${
                      errors.contactNo ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#058b7c] focus:ring-[#058b7c]/20'
                    }`}
                  />
                  {errors.contactNo && <p className="text-red-500 text-xs mt-1">{errors.contactNo}</p>}
                </div>
              </div>

              {/* Specialization & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    Specialization <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={specialization}
                    onChange={(e) => {
                      setSpecialization(e.target.value);
                      if (e.target.value !== "Other") setOtherSpecialization("");
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-800 bg-white transition focus:outline-none focus:ring-2 ${
                      errors.specialization ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#058b7c] focus:ring-[#058b7c]/20'
                    }`}
                  >
                    <option value="">Select Specialization</option>
                    {specializationList.map((item, index) => {
                      const specVal = item.specilization || item.specialization || item.name;
                      return (
                        <option key={item._id || index} value={specVal}>
                          {specVal}
                        </option>
                      );
                    })}
                    <option value="Other">Other</option>
                  </select>
                  {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}

                  {specialization === "Other" && (
                    <div className="mt-2">
                      <input
                        value={otherSpecialization}
                        onChange={(e) => handleTextOnlyChange(e, setOtherSpecialization)}
                        type="text"
                        placeholder="Specify specialization"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#058b7c]"
                      />
                      {errors.otherSpecialization && <p className="text-red-500 text-xs mt-1">{errors.otherSpecialization}</p>}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      if (e.target.value !== "Other") setOtherCategory("");
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-800 bg-white transition focus:outline-none focus:ring-2 ${
                      errors.category ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#058b7c] focus:ring-[#058b7c]/20'
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categoryList.map((item, index) => {
                      const catVal = item.category || item.name;
                      return (
                        <option key={item._id || index} value={catVal}>
                          {catVal}
                        </option>
                      );
                    })}
                    <option value="Other">Other</option>
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}

                  {category === "Other" && (
                    <div className="mt-2">
                      <input
                        value={otherCategory}
                        onChange={(e) => handleTextOnlyChange(e, setOtherCategory)}
                        type="text"
                        placeholder="Specify category"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#058b7c]"
                      />
                      {errors.otherCategory && <p className="text-red-500 text-xs mt-1">{errors.otherCategory}</p>}
                    </div>
                  )}
                </div>
              </div>

              {/* Languages Spoken */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  Languages Spoken <span className="text-red-500">*</span>
                </label>
                <input
                  value={languageInput}
                  onChange={(e) => handleTextOnlyChange(e, setLanguageInput)}
                  onKeyDown={handleLanguageKeyDown}
                  type="text"
                  placeholder="Type language & press Enter or comma"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-800 transition focus:outline-none focus:ring-2 ${
                    errors.language ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#058b7c] focus:ring-[#058b7c]/20'
                  }`}
                />
                
                {/* Language Tags */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {languages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-[#058b7c]/10 text-[#058b7c] border border-[#058b7c]/20 text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {lang}
                      <button
                        type="button"
                        onClick={() => removeLanguage(idx)}
                        className="hover:text-red-500 transition-colors ml-0.5 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {errors.language && <p className="text-red-500 text-xs mt-1">{errors.language}</p>}
              </div>

              {/* Consultation Fee */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  Consultation Fee (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  type="number"
                  placeholder="e.g. 500"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-800 transition focus:outline-none focus:ring-2 ${
                    errors.fee ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#058b7c] focus:ring-[#058b7c]/20'
                  }`}
                />
                {errors.fee && <p className="text-red-500 text-xs mt-1">{errors.fee}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#058b7c] hover:bg-[#047266] text-white font-semibold rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer mt-4"
              >
                Continue to Next Step
              </button>
            </form>
          </div>

          {/* Graphic Side */}
          <div className="hidden lg:col-span-5 lg:flex flex-col items-center justify-center h-full sticky top-8">
            <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100/60 w-full text-center">
              <img
                src="https://files.catbox.moe/abltpi.png"
                alt="Doctor registration setup"
                className="rounded-2xl max-h-[380px] w-full object-cover shadow-sm mx-auto"
              />
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                Completing your basic details helps patients discover your expertise and schedule consultations easily.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default BasicDetails;
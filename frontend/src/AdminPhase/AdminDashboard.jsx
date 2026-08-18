import React, { useEffect, useState } from "react";
import AdminHeader from "../component/AdminHeader";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { MdDelete } from "react-icons/md";

const AdminDashboard = () => {
  const api = import.meta.env.VITE_API_URL;
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const navigate = useNavigate();
  const [gmail, setgmail] = useState("");
  const [totalAdmin, settotalAdmin] = useState([]);

  // Fetch all admins
  async function listAdmin() {
    try {
      const response = await fetch(`${api}/api/admin/get/Admins`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json"
        }
      });
      const data = await response.json();
      if (data.data) {
        settotalAdmin(data.data);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to load admin list");
    }
  }

  // Create a new admin
  async function createAdmin(e) {
    e.preventDefault(); // Prevents page reload

    if (gmail === "" ) {
      return toast.error("Please Enter the Email");
    }

    try {
      const response = await fetch(`${api}/api/admin/create/Admin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gmail }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success("Admin created successfully!");
        setgmail("");
        setIsAdminModalOpen(false); // Close modal on success
        listAdmin(); // Refresh the list
      } else {
        toast.error(data.message || "Failed to create admin");
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      toast.error("An error occurred");
    }
  }

  // Delete an admin
  async function deleting(id) {
    // Implement your delete API logic here
    const response=await fetch(`${api}/api/admin/delete/admin/${id}`,
      {
        method:"GET",
        credentials:"include",
        headers:{
          "Content-type":"application/json"
        },
      }
    )
    const data=await response.json();
  if(data.success){
      toast.success(data.message);
  }
  else{
    toast.error(data.message);
  }
    
   
    listAdmin();
  }

  useEffect(() => {
    listAdmin();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <AdminHeader />
      <Toaster />
      
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl lg:text-4xl font-bold">Admin Dashboard</h1>
          <button 
            onClick={() => setIsAdminModalOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-xl transition cursor-pointer"
          >
            Add Admin
          </button>
        </div>

        {/* Navigation Quick Links */}
        <div className="bg-white rounded-2xl shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
            <div onClick={() => navigate('/Admin/DoctorVerification')} className="h-20 flex items-center justify-center border border-gray-200 rounded-xl text-xl font-semibold cursor-pointer hover:bg-gray-50 transition">
              Doctor's Verification
            </div>
            <div onClick={() => navigate('/Admin/TotalDoctor')} className="h-20 flex items-center justify-center border border-gray-200 rounded-xl text-xl font-semibold cursor-pointer hover:bg-gray-50 transition">
              Total Doctors
            </div>
            <div onClick={() => navigate('/Admin/TotalPatient')} className="h-20 flex items-center justify-center border border-gray-200 rounded-xl text-xl font-semibold cursor-pointer hover:bg-gray-50 transition">
              Total Patients
            </div>
          </div>
        </div>

  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Revenue Dashboard</h2>
            <p className="text-gray-500">Revenue visualizations go here...</p>
          </div>

        
          <div className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden">
            <h2 className="text-xl font-bold mb-4">System Admins</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-sm">
                    <th className="pb-2 w-12">No.</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {totalAdmin.map((item, index) => (
                    <tr key={item._id || index} className="hover:bg-gray-50">
                      <td className="py-3">{index + 1}</td>
                      <td className="py-3 truncate max-w-[150px]">{item.gmail}</td>
                      <td className="py-3 text-right">
                        <button 
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition" 
                          onClick={() => deleting(item._id)}
                        >
                          <MdDelete size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {totalAdmin.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-gray-400">No admins found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

       
        {isAdminModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Admin</h3>
                <button 
                  className="text-gray-400 hover:text-gray-600 text-2xl transition cursor-pointer hover:text-red-400 " 
                  onClick={() => setIsAdminModalOpen(false)}
                >
                  <RxCross2 />
                </button>
              </div>

              <form onSubmit={createAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    value={gmail}
                    onChange={(e) => setgmail(e.target.value)}
                    type="email"
                    placeholder="admin@example.com" 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl transition mt-4 cursor-pointer"
                >
                  Create Account
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
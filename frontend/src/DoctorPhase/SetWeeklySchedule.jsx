import React, { useState,useEffect } from "react";
import HeaderFront from "../component/HeaderFront";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
const SetWeeklySchedule = () => {
  const api= import.meta.env.VITE_API_URL;
  const navigate=useNavigate();
  const [schedule, setSchedule] = useState([
    { day: "Monday", status: true, start: "", end: "" },
    { day: "Tuesday", status: true, start: "", end: "" },
    { day: "Wednesday", status: true, start: "", end: "" },
    { day: "Thursday", status: true, start: "", end: "" },
    { day: "Friday", status: true, start: "", end: "" },
    { day: "Saturday", status:true, start: "", end: "" },
    { day: "Sunday", status: true, start: "", end: "" },
  ]);

    const [name, setname] = useState("")
  const [image, setimage] = useState("");
  const [loading, setloading] = useState(false);
  const changeStatus = (index, status) => {
    const updated = [...schedule];
    updated[index].status = status;

    if (status === false) {
      updated[index].start = "";
      updated[index].end = "";
    }
    setSchedule(updated);
  };

  const changeTime = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  
 
  async function setSchedules(e){
    e.preventDefault();
    try{
      setloading(true);
    const response=await fetch(`${api}/api/doctors/DoctorSchedule`,{
      method:"POST",
      credentials:"include",
      headers:{
        "Content-type":"application/json"
      },
      body:JSON.stringify({
        weekly:schedule
      })
    })
    const data=await response.json();
   if(data.success){
  toast.success(data.message);

  setTimeout(()=>{
    navigate('/login');
  },3000);
}
else{
  toast.error(data.message)
}
    }
    catch(error){
      toast.error(error);
    }
    finally{
      setTimeout(() => {
        setloading(false);
      }, 3000);
    }
  }
    async function getDetails(){
      const response=await fetch(`${api}/api/doctors/get/name/image`,{
        method:"GET",
        credentials:"include",
        headers:{
          "Content-type":"application/json"
        },
      })
      const data=await response.json();
      setname(data.name);
      setimage(data.image);
    }
    useEffect(() => {
      getDetails();
    }, [])

  return (
    <div className="min-h-screen bg-gray-200">
      <HeaderFront />
      <Toaster />
 {
        loading &&(
          <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50">
          <div className="w-12 h-12 border-4 border-[#078475] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )
      }
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Image */}

          <div>
            <div className="p-5 font-bold text-3xl">Dr {name} </div>
            <img
              src={image}
              alt="Doctor"
              className="w-full h-[80%] object-center  rounded-3xl shadow-lg"
            />
          </div>

          {/* Right Section */}

          <div className="lg:col-span-2" >

            <div className="bg-white rounded-3xl shadow-lg p-3 ">

              <h2 className="text-2xl font-semibold mb-3">
                Weekly Schedule
              </h2>

             {schedule.map((item, index) => (
  <div
    key={item.day}
    className={`rounded-xl p-3 mb-2 transition-all ${
      item.status === false ? "bg-red-100" : "bg-gray-50"
    }`}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
      {/* Day */}
      <div className="lg:col-span-2">
        <h3 className="font-semibold text-lg">{item.day}</h3>
      </div>

      {/* Toggle */}
      <div className="lg:col-span-2">
        <div className="flex bg-gray-200 rounded-full overflow-hidden w-full ">
          <button
            onClick={() => changeStatus(index,false)}
            className={`flex-1 py-1 text-sm font-semibold transition ${
              item.status === false
                ? "bg-gray-700 text-white"
                : "bg-transparent"
            }`}
          >
            Closed
          </button>

          <button
            onClick={() => changeStatus(index, true)}
            className={`flex-1 py-1 text-sm font-semibold transition ${
              item.status === true
                ? "bg-green-600 text-white"
                : "bg-transparent"
            }`}
          >
            Open
          </button>
        </div>
      </div>

      {/* Start Time */}
      {item.status===true && 
      <div className="lg:col-span-4">
        <label className="block text-xs text-gray-500 mb-1">
          Start Time
        </label>

        <input
          type="time"
          value={item.start}
          disabled={item.status === false}
          onChange={(e) =>
            changeTime(index, "start", e.target.value)
          }
          className="w-[90%] border rounded-lg px-3 py-1 disabled:bg-gray-200"
        />
      </div>

        }
     
      {/* End Time */}
         {item.status==true && 
      <div className="lg:col-span-4">
        <label className="block text-xs text-gray-500 mb-1">
          End Time
        </label>

        <input
          type="time"
          value={item.end}
          disabled={item.status === false}
          onChange={(e) =>
            changeTime(index, "end", e.target.value)
          }
          className="w-[90%] border rounded-lg px-3 py-1 disabled:bg-gray-200"
        />
      </div>
}
    </div>
  </div>
))}

              <div className="flex justify-center md:justify-end mt-3">

                <button
                  onClick={(e)=>{setSchedules(e)}}
                  className="bg-[#058b7c]  hover:bg-[#0a5950] transition text-white px-8 py-2 rounded-full font-semibold shadow-lg"
                >
                  Submit Changes →
                </button>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default SetWeeklySchedule;
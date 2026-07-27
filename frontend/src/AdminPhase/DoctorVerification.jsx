import React from 'react'
import Header from '../component/Header'
import {useEffect,useState} from 'react';

const DoctorVerification = () => {
  const api=import.meta.env.VITE_API_URL;
  const [doctorVerification,setdoctorVerification]=useState([]);
  const [loading, setloading] = useState(false);
  async function accept(id){
    console.log("hello");
    const response=await fetch(`${api}/api/admin/verification/accept/${id}`,{
      method:"GET",
      credentials:"include",
      headers:{
        "Content-Type":"application/json",
      },
    })
    const data=await response.json();
    if(data.success){
      fetchingData();
    }
  }

  async function reject(id){
    const response=await  fetch(`${api}/api/admin/verification/reject/${id}`,{
      method:"GET",
      credentials:"include",
      headers:{
        "Content-Type":"applicaiton/json",
      },
    })
    const data=await response.json();
    if(data.success){
      fetchingData();
    }
  }
  async function fetchingData(){
    try{
      setloading(true);
    const response=await fetch(`${api}/api/admin/get/PendingDoctor`,
      {
        method:"GET",
        credentials: "include",
        headers: {
        "Content-Type": "application/json",
      },
      }
    );
    const data=await  response.json()
    setdoctorVerification(data.data);
  }
  catch(error){
    toast.error(error);
  }
  finally{
    setTimeout(() => {
      setloading(false)
    }, 3000);
  }
}
  useEffect(() => {
    fetchingData()
  }, [])
  


 return (
  <div className="min-h-screen bg-slate-50">
    <Header />
      {
        loading &&(
          <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50">
          <div className="w-12 h-12 border-4 border-[#078475] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )
      }
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Doctor Verification
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Review and verify pending doctor registration requests.
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Pending Requests
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Doctors waiting for verification
              </p>
            </div>

            <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
              {
                doctorVerification.filter(
                  (doctor) => doctor.verificationStatus === "Pending"
                ).length
              }{" "}
              Pending
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left">

              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Doctor</th>
                  <th className="px-6 py-4">Registration No.</th>
                  <th className="px-6 py-4">Registration Date</th>
                  <th className="px-6 py-4">Medical Council</th>
                  <th className="px-6 py-4">Certificate</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {doctorVerification.map(
                  (item, index) =>
                    item.verificationStatus === "Pending" && (
                      <tr
                        key={index}
                        className="transition duration-200 hover:bg-slate-50"
                      >

                        {/* Doctor */}
                        <td className="px-6 py-5">
                          <div>
                            <p className="font-semibold text-slate-800">
                              {item.name}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {item.gmail}
                            </p>
                          </div>
                        </td>

                        {/* Registration Number */}
                        <td className="px-6 py-5">
                          <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                            {item.registrationNo}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-5 text-sm text-slate-600">
                          {item.registrationDate}
                        </td>

                        {/* Council */}
                        <td className="px-6 py-5 text-sm text-slate-600">
                          {item.stateMedicalCouncil}
                        </td>

                        {/* Certificate */}
                        <td className="px-6 py-5">
                           <a
                      href={item.certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                    >
                      View Certificate
                    </a>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex justify-center gap-2">

                            <button
                              onClick={()=>{accept(item._id)}}
                              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 active:scale-95"
                            >
                              Accept
                            </button>

                            <button
                            onClick={()=>{reject(item._id)}}
                              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 active:scale-95"
                            >
                              Reject
                            </button>

                          </div>
                        </td>

                      </tr>
                    )
                )}
              </tbody>

            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 p-4 lg:hidden">
            {doctorVerification.map(
              (item, index) =>
                item.verificationStatus === "Pending" && (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >

                    {/* Doctor Header */}
                    <div className="flex items-start gap-4">
                  

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900">
                          {item.name}
                        </h3>
                        

                        <p className="mt-1 truncate text-sm text-slate-500">
                          {item.gmail}
                        </p>

                        <span className="mt-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                          Pending
                        </span>
                      </div>

                    </div>

                    {/* Doctor Details */}
                    <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">

                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-slate-500">
                          Registration No.
                        </span>

                        <span className="text-right text-sm font-medium text-slate-800">
                          {item.registrationNo}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-slate-500">
                          Registration Date
                        </span>

                        <span className="text-right text-sm font-medium text-slate-800">
                          {item.registrationDate}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-sm text-slate-500">
                          Medical Council
                        </span>

                        <span className="max-w-[60%] text-right text-sm font-medium text-slate-800">
                          {item.stateMedicalCouncil}
                        </span>
                      </div>

                    </div>
                  <div className='m-2'>
                    <a
                      href={item.certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                    >
                      View Certificate
                    </a>
                  </div>
                    {/* Mobile Actions */}
                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <button
                        className="rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 active:scale-95"
                      >
                        Accept
                      </button>

                      <button
                        className="rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 active:scale-95"
                      >
                        Reject
                      </button>

                    </div>

                  </div>
                )
            )}
          </div>

        </div>
      </div>
    </div>
  </div>
);
};
export default DoctorVerification
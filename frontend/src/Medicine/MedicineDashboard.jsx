import React, { useState } from 'react'
import Header from '../component/Header'

const MedicineSlider = () => {
  // 1. Pharmacy Owner Orders Data with Billing Fields
  const [bookingData, setBookingData] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      address: '123 Main St, City, State 12345',
      contactNo: '(555) 123-4567',
      prescriptionImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      orderStatus: 'Delivered', // Locked
      billAmount: '450.00',
      billImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      address: '456 Oak Ave, Town, State 67890',
      contactNo: '(555) 987-6543',
      prescriptionImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
      orderStatus: 'Pending', // Needs Bill Upload
      billAmount: '',
      billImage: null,
    },
    {
      id: 3,
      patientName: 'Robert Johnson',
      address: '789 Pine Rd, Metro, State 11223',
      contactNo: '(555) 456-7890',
      prescriptionImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      orderStatus: 'Awaiting Patient Approval', // Bill Uploaded
      billAmount: '1250.00',
      billImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 4,
      patientName: 'Alice Brown',
      address: '321 Elm St, Suburb, State 44556',
      contactNo: '(555) 321-6548',
      prescriptionImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      orderStatus: 'Processing', // Patient Accepted
      billAmount: '890.00',
      billImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    }
  ])

  // State for Image Modal (Prescription / Bill)
  const [selectedImage, setSelectedImage] = useState(null)

  // State for Generate Bill Modal
  const [billModalOrder, setBillModalOrder] = useState(null)
  const [billInput, setBillInput] = useState({
    amount: '',
    image: null,
    imagePreview: ''
  })

  // Status Change Handler
  const handleStatusChange = (id, newStatus) => {
    setBookingData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, orderStatus: newStatus } : item
      )
    )
  }

  // Open Generate Bill Modal
  const openBillModal = (order) => {
    setBillModalOrder(order)
    setBillInput({ amount: '', image: null, imagePreview: '' })
  }

  // Bill Image Upload Handler
  const handleBillImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setBillInput({
        ...billInput,
        image: file,
        imagePreview: URL.createObjectURL(file)
      })
    }
  }

  // Submit Bill & Send to Patient
  const handleBillSubmit = (e) => {
    e.preventDefault()
    if (!billInput.amount || !billInput.imagePreview) {
      alert('Please enter bill amount and upload bill copy!')
      return
    }

    setBookingData((prevData) =>
      prevData.map((item) =>
        item.id === billModalOrder.id
          ? {
              ...item,
              orderStatus: 'Awaiting Patient Approval',
              billAmount: billInput.amount,
              billImage: billInput.imagePreview,
            }
          : item
      )
    )

    alert('Bill uploaded successfully! Sent to patient for approval.')
    setBillModalOrder(null)
  }

  // Demo Function: Simulate Patient Accepting the Bill
  const simulatePatientApproval = (id) => {
    setBookingData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, orderStatus: 'Processing' } : item
      )
    )
    alert('Patient has accepted the bill! Order moved to Processing.')
  }

  // Dynamic status badges and dropdown styling
  const getStatusSelectStyle = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-50 text-green-700 border-green-300 font-semibold'
      case 'Out for Delivery':
        return 'bg-purple-50 text-purple-700 border-purple-300 focus:ring-purple-500 font-semibold'
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-300 focus:ring-blue-500 font-semibold'
      case 'Awaiting Patient Approval':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-semibold'
      case 'Pending':
        return 'bg-orange-50 text-orange-700 border-orange-300 font-semibold'
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-300 font-semibold'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-300 font-semibold'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Owner Order Management Wrapper */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Owner Orders & Billing Portal</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Accept pending orders by uploading medicine bill. Patient approval is required before delivery.
              </p>
            </div>
            <div className="bg-teal-50 text-teal-800 text-xs px-3 py-1.5 rounded-lg border border-teal-200 font-semibold">
              Total Orders: {bookingData.length}
            </div>
          </div>

          {/* 📱 MOBILE VIEW: Cards (Hidden on Desktop 'md:') */}
          <div className="block md:hidden p-4 space-y-4 divide-y divide-gray-100 bg-gray-50/50">
            {bookingData.length > 0 ? (
              bookingData.map((item, index) => {
                const isClosed = item.orderStatus === 'Delivered' || item.orderStatus === 'Cancelled';
                const isPending = item.orderStatus === 'Pending';
                const isAwaiting = item.orderStatus === 'Awaiting Patient Approval';

                return (
                  <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3 pt-4 first:pt-4">
                    {/* Header: Sr No & Status */}
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="text-xs font-bold text-gray-400">Order #{index + 1}</span>
                      
                      {/* Status Badge / Dropdown */}
                      {isClosed || isPending || isAwaiting ? (
                        <span className={`inline-block text-[11px] px-2.5 py-1 rounded-lg border ${getStatusSelectStyle(item.orderStatus)}`}>
                          {item.orderStatus}
                        </span>
                      ) : (
                        <select
                          value={item.orderStatus}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`text-xs px-2.5 py-1 rounded-lg border focus:outline-hidden cursor-pointer transition-colors ${getStatusSelectStyle(
                            item.orderStatus
                          )}`}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      )}
                    </div>

                    {/* Patient Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{item.patientName}</h3>
                      <p className="text-xs text-teal-700 font-medium">{item.contactNo}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.address}</p>
                    </div>

                    {/* Thumbnails: Prescription & Bill */}
                    <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      {/* Prescription */}
                      <div className="flex items-center space-x-2">
                        <div
                          className="relative group w-12 h-12 cursor-pointer shrink-0"
                          onClick={() => setSelectedImage(item.prescriptionImage)}
                        >
                          <img
                            src={item.prescriptionImage}
                            alt="Prescription"
                            className="w-full h-full object-cover rounded-md border border-gray-300"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-[9px] font-bold rounded-md">
                            View
                          </span>
                        </div>
                        <span className="text-xs font-medium text-gray-600">Prescription</span>
                      </div>

                      {/* Bill Image */}
                      <div className="flex items-center space-x-2">
                        {item.billImage ? (
                          <div className="flex items-center space-x-2">
                            <div
                              className="relative group w-12 h-12 cursor-pointer shrink-0"
                              onClick={() => setSelectedImage(item.billImage)}
                            >
                              <img
                                src={item.billImage}
                                alt="Bill"
                                className="w-full h-full object-cover rounded-md border border-teal-300"
                              />
                              <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-[9px] font-bold rounded-md">
                                View
                              </span>
                            </div>
                            <span className="text-xs font-bold text-gray-800">₹{item.billAmount}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">No Bill</span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-1">
                      {isPending && (
                        <button
                          onClick={() => openBillModal(item)}
                          className="w-full text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 py-2 rounded-lg transition-all shadow-2xs active:scale-98"
                        >
                          Accept & Generate Bill
                        </button>
                      )}

                      {isAwaiting && (
                        <div className="space-y-1 text-center">
                          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 py-1.5 rounded-md block">
                            Waiting Patient Response
                          </span>
                          <button
                            onClick={() => simulatePatientApproval(item.id)}
                            className="text-[10px] text-blue-600 underline cursor-pointer hover:text-blue-800"
                          >
                            (Simulate Patient Approve)
                          </button>
                        </div>
                      )}

                      {isClosed && (
                        <p className="text-center text-xs font-semibold text-gray-400 italic py-1">
                          Closed (Locked)
                        </p>
                      )}

                      {!isPending && !isAwaiting && !isClosed && (
                        <span className="text-xs font-semibold text-teal-700 bg-teal-50 py-1.5 rounded-md border border-teal-200 block text-center">
                          Order Active
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">No order records found.</div>
            )}
          </div>

          {/* 🖥️ DESKTOP VIEW: Table (Hidden on Mobile, Visible on 'md:') */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Sr No.</th>
                  <th className="px-6 py-3 font-semibold">Patient Info</th>
                  <th className="px-6 py-3 font-semibold">Prescription</th>
                  <th className="px-6 py-3 font-semibold">Bill Copy</th>
                  <th className="px-6 py-3 font-semibold">Order Status</th>
                  <th className="px-6 py-3 font-semibold text-center">Owner Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookingData.length > 0 ? (
                  bookingData.map((item, index) => {
                    const isClosed = item.orderStatus === 'Delivered' || item.orderStatus === 'Cancelled';
                    const isPending = item.orderStatus === 'Pending';
                    const isAwaiting = item.orderStatus === 'Awaiting Patient Approval';

                    return (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-800">{item.patientName}</p>
                          <p className="text-xs text-teal-700 font-medium">{item.contactNo}</p>
                          <p className="text-xs text-gray-400 truncate max-w-xs">{item.address}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className="relative group w-14 h-14 cursor-pointer"
                            onClick={() => setSelectedImage(item.prescriptionImage)}
                          >
                            <img
                              src={item.prescriptionImage}
                              alt="Prescription"
                              className="w-full h-full object-cover rounded-lg border border-gray-300 shadow-2xs group-hover:opacity-80"
                            />
                            <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100">
                              View
                            </span>
                          </div>
                        </td>

                        {/* Bill Info Column */}
                        <td className="px-6 py-4">
                          {item.billImage ? (
                            <div className="flex items-center space-x-2">
                              <div
                                className="relative group w-12 h-12 cursor-pointer"
                                onClick={() => setSelectedImage(item.billImage)}
                              >
                                <img
                                  src={item.billImage}
                                  alt="Bill Copy"
                                  className="w-full h-full object-cover rounded-md border border-teal-300"
                                />
                                <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-[9px] font-bold rounded-md opacity-0 group-hover:opacity-100">
                                  View
                                </span>
                              </div>
                              <span className="text-xs font-bold text-gray-800">₹{item.billAmount}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No Bill Generated</span>
                          )}
                        </td>

                        {/* Order Status Column */}
                        <td className="px-6 py-4">
                          {isClosed || isPending || isAwaiting ? (
                            <span className={`inline-block text-xs px-3 py-1.5 rounded-lg border ${getStatusSelectStyle(item.orderStatus)}`}>
                              {item.orderStatus}
                            </span>
                          ) : (
                            <select
                              value={item.orderStatus}
                              onChange={(e) => handleStatusChange(item.id, e.target.value)}
                              className={`text-xs px-3 py-1.5 rounded-lg border focus:outline-hidden cursor-pointer transition-colors ${getStatusSelectStyle(
                                item.orderStatus
                              )}`}
                            >
                              <option value="Processing">Processing</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          )}
                        </td>

                        {/* Owner Actions Column */}
                        <td className="px-6 py-4 text-center">
                          {isPending && (
                            <button
                              onClick={() => openBillModal(item)}
                              className="text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer active:scale-95"
                            >
                              Accept & Generate Bill
                            </button>
                          )}

                          {isAwaiting && (
                            <div className="space-y-1">
                              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md block">
                                Waiting Patient Response
                              </span>
                              <button
                                onClick={() => simulatePatientApproval(item.id)}
                                className="text-[10px] text-blue-600 underline cursor-pointer hover:text-blue-800"
                              >
                                (Simulate Patient Approve)
                              </button>
                            </div>
                          )}

                          {isClosed && (
                            <span className="text-xs font-semibold text-gray-400 italic">
                              Closed (Locked)
                            </span>
                          )}

                          {!isPending && !isAwaiting && !isClosed && (
                            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                              Order Active
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400 text-sm">
                      No order records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* GENERATE BILL MODAL */}
      {billModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">Generate Medicine Bill</h3>
              <button
                onClick={() => setBillModalOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Upload prescription bill image and total amount for <b>{billModalOrder.patientName}</b>.
            </p>

            <form onSubmit={handleBillSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Total Bill Amount (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 850"
                  value={billInput.amount}
                  onChange={(e) => setBillInput({ ...billInput, amount: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Upload Bill Image / Receipt *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBillImageUpload}
                  className="w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                  required
                />
              </div>

              {billInput.imagePreview && (
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500">Preview:</span>
                  <img
                    src={billInput.imagePreview}
                    alt="Bill Preview"
                    className="w-16 h-16 object-cover rounded-lg border border-teal-300"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBillModalOrder(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Send Bill to Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL IMAGE MODAL (Prescription or Bill) */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative bg-white p-3 rounded-2xl max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 bg-gray-900/80 hover:bg-black text-white w-9 h-9 rounded-full flex items-center justify-center text-xl font-bold cursor-pointer transition-transform active:scale-95 z-10 shadow-md"
            >
              &times;
            </button>

            <img
              src={selectedImage}
              alt="Full View"
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default MedicineSlider
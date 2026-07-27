import React, { useState } from 'react';
import Header from '../component/Header';
import {useNavigate} from 'react-router-dom'
const PatientPassword = () => {
  const navigate=useNavigate();
  const api= import.meta.env.VITE_API_URL
  // Step tracker: 1 = Enter Email, 2 = Enter OTP, 3 = Reset Password, 4 = Success
  const [step, setStep] = useState(1);
  
  // Form states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  function gotoLoginPage(){
    navigate('/Patient/Login')
  }
  // Step 1: Send OTP handler
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return alert('Please enter your email address');

    setLoading(true);
    setMessage('');

    try {
      // Simulate API call to send OTP
      // await axios.post('/api/send-otp', { email });
      console.log("hi");
      
     const response=await fetch(`${api}/api/forget/Patient/get/otp/toVerify`,
      {
        method:"POST",
        credentials:"include",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({
          gmail:email
        })
      }

     )
     console.log("bye");
     
     const data=await response.json();
     console.log(data);
     

      // Move to next step on success
      setStep(2);
      setMessage('OTP has been sent to your email.');
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP handler
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return alert('Please enter the OTP');

    setLoading(true);
    setMessage('');

    try {
      // Simulate API call to verify OTP
      // await axios.post('/api/verify-otp', { email, otp });
       
     const response=await fetch(`${api}/api/forget/patient/post/Otp`,
      {
        method:"POST",
        credentials:"include",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({
          gmail:email,
          userOTP:otp
        })
      }
     )
     const data=await response.json();
     if(data.success){
      // Move to next step on succes
      setStep(3);
      setMessage('OTP verified successfully!');
     }
     else{
      setStep(2);
      setMessage("Please Enter the valid otp")
     }
    } catch (error) {
      alert('Invalid OTP. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password handler
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return alert('Please enter a new password');

    setLoading(true);
    setMessage('');

    try {
      // Simulate API call to change password
      // await axios.post('/api/reset-password', { email, newPassword });
      const response=await fetch(`${api}/api/forget/patient/change/password`,
      {
        method:"POST",
        credentials:"include",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({
          gmail:email,
          password:newPassword
        })
      }
     )
     const data=await response.json();
     console.log(data);
     
     if(data.success){
      setStep(4);
      setMessage('Password successfully changed!');
     }
     else{
      setStep(3);
     }
    } catch (error) {
      alert('Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-gray-200 min-h-screen'>
      <Header/>
    <div style={{   maxWidth: '400px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>

      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Forgot Password</h2>

      {message && (
        <div style={{ padding: '10px', background: '#eef2ff', color: '#4338ca', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>
          {message}
        </div>
      )}

      {/* STEP 1: Enter Email & Send OTP */}
      {step === 1 && (
        <form onSubmit={handleSendOtp}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Email Address</label>
            <input
              type="email"
              placeholder="enter your gmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            {loading ? 'Sending OTP...' : 'Send OTP to Mail'}
          </button>
        </form>
      )}

      {/* STEP 2: Enter OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Enter OTP</label>
            <input
              type="text"
              placeholder="enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            style={{ background: 'none', border: 'none', color: '#666', marginTop: '10px', cursor: 'pointer', width: '100%', fontSize: '13px' }}
          >
            ← Change Email
          </button>
        </form>
      )}

      {/* STEP 3: Change Password */}
      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>New Password</label>
            <input
              type="password"
              placeholder="enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '10px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      )}

      {/* STEP 4: Completed State */}
      {step === 4 && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#16a34a', fontWeight: 'bold' }}>All set! Your password has been reset.</p>
          <button
            onClick={() => gotoLoginPage()}
            style={{ marginTop: '10px', background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Back to Login
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default PatientPassword;
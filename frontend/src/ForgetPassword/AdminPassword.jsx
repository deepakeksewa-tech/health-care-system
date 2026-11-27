import React, { useState } from 'react';
import Header from '../component/Header';
import {useNavigate} from 'react-router-dom'
const AdminPassword = () => {
  const navigate=useNavigate();
  const api= import.meta.env.VITE_API_URL
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  function gotoLoginPage(){
    navigate('/Admin/LoginPage')
  }
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return alert('Please enter your email address');

    setLoading(true);
    setMessage('');

    try {
      console.log("hi");
      
     const response=await fetch(`${api}/api/forget/admin/get/otp/toVerify`,
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
       setStep(2);
      setMessage('OTP has been sent to your email.');
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };
 const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return alert('Please enter the OTP');

    setLoading(true);
    setMessage('');

    try {
       
     const response=await fetch(`${api}/api/forget/admin/post/Otp`,
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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return alert('Please enter a new password');

    setLoading(true);
    setMessage('');

    try {
      const response=await fetch(`${api}/api/forget/admin/change/password`,
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

export default AdminPassword;
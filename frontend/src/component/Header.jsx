import React from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/Logo.png'

const Header = () => {
  const navigate = useNavigate()

  // Dynamic back navigation (Goes back 1 step in history)
  const handleGoBack = () => {
    navigate(-1)
  }

  // Logout handler
  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  // Logo home redirect
  const handleHomeRedirect = () => {
    navigate('/')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Side: Clickable Logo & MED SEWA Brand */}
          <div 
            onClick={handleHomeRedirect} 
            className="flex items-center cursor-pointer select-none group"
          >
            <img 
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain transition-transform group-hover:scale-105" 
              src={Logo} 
              alt="logo" 
            />
            <span className="font-bold text-xl sm:text-2xl ml-2 sm:ml-3">
              <span className="text-[#058b7c]">MED</span> SEWA
            </span>
          </div>

          {/* Right Side: Back Button (-1) + Logout Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Back Button (-1) */}
            <button
              onClick={handleGoBack}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer"
              title="Go Back"
              aria-label="Go Back"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
              title="Log out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  )
}

export default Header
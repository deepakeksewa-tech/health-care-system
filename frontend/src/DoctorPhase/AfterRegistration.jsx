import React from 'react';
import Header from '../component/Header';
import HeaderFront from '../component/HeaderFront';

const AfterRegistration = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
    <HeaderFront/>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 text-center">
          
          {/* Status Icon */}
          <div className="w-16 h-16 bg-[#058b7c]/10 text-[#058b7c] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Registration Submitted!
          </h1>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
            We are currently verifying your details. You will receive an email confirmation within <span className="font-semibold text-gray-800">24 hours</span> once your account is approved.
          </p>

          {/* Action Helper */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Didn't receive an email after 24 hours? Check your spam folder or contact support.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AfterRegistration;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderFront from './component/HeaderFront';
import { RxPerson, RxActivityLog, RxLockClosed } from 'react-icons/rx';

const MainPage = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'patient',
      title: 'Patient',
      description: 'Book appointments, consult with doctors, and view medical reports.',
      icon: RxPerson,
      path: '/Patient/Login',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-[#058b7c]/10 text-[#058b7c]',
    },
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Manage clinical schedules, appointments, and patient consultations.',
      icon: RxActivityLog,
      path: '/login',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      iconBg: 'bg-[#058b7c]/10 text-[#058b7c]',
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Access system controls, manage user permissions, and overview operations.',
      icon: RxLockClosed,
      path: '/Admin/LoginPage',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      iconBg: 'bg-slate-100 text-slate-700',
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 antialiased font-sans flex flex-col">
      <HeaderFront />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center">
        {/* Page Title */}
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome to <span className=" tracking-tight text-[#058b7c]">MED</span>
              <span className=" tracking-tight text-slate-900"> SEWA</span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto">
            Please select your portal to continue to your tailored dashboard.
          </p>
        </div>

        {/* Roles Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => handleNavigation(role.path)}
                className="group relative bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#058b7c]/40 transition-all duration-200 text-left flex flex-col justify-between cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#058b7c]/30"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${role.iconBg} group-hover:scale-105 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${role.badgeColor}`}>
                      Portal
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#058b7c] transition-colors">
                      {role.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#058b7c]">
                  <span>Login to Portal</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default MainPage;
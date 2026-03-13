import React from 'react';

interface HeaderProps {
  onBookingClick: () => void;
  onMyAccountClick: () => void;
  onLogout?: () => void;
  onAdminDashboardClick?: () => void;
  showAdminDashboard?: boolean;
  onHomeClick?: () => void;
  onAboutClick?: () => void;
  onServicesClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onBookingClick,
  onMyAccountClick,
  onLogout,
  onAdminDashboardClick,
  showAdminDashboard,
  onHomeClick,
  onAboutClick,
  onServicesClick,
}) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
              </div>
              <h1 className="text-2xl font-normal" style={{ color: '#2fb5b4' }}>SmartWash</h1>
            </div>
          </div>
          <nav className="flex space-x-6 items-center">
            {onHomeClick && (
              <button onClick={onHomeClick} className="styled-button bg-teal-600 text-white hover:bg-teal-700 transition-colors px-6 py-3 rounded-lg font-normal shadow-md inline-flex items-center justify-center">
                Home
              </button>
            )}
            {onAboutClick && (
              <button onClick={onAboutClick} className="styled-button bg-teal-600 text-white hover:bg-teal-700 transition-colors px-6 py-3 rounded-lg font-normal shadow-md inline-flex items-center justify-center">
                About Us
              </button>
            )}
            {onServicesClick && (
              <button onClick={onServicesClick} className="styled-button bg-teal-600 text-white hover:bg-teal-700 transition-colors px-6 py-3 rounded-lg font-normal shadow-md inline-flex items-center justify-center">
                Services
              </button>
            )}
            <button onClick={onBookingClick} className="styled-button bg-teal-600 text-white hover:bg-teal-700 transition-colors px-6 py-3 rounded-lg font-normal shadow-md inline-flex items-center justify-center">
              Book Now
            </button>
            <button onClick={onMyAccountClick} className="styled-button bg-teal-500 text-white hover:bg-teal-600 transition-colors px-6 py-3 rounded-lg font-normal shadow-md inline-flex items-center justify-center">
              My Account
            </button>
            {showAdminDashboard && onAdminDashboardClick && (
              <button
                onClick={onAdminDashboardClick}
                className="styled-button bg-gray-900 text-white hover:bg-gray-800 transition-colors px-6 py-3 rounded-lg font-normal shadow-md inline-flex items-center justify-center"
              >
                Admin Dashboard
              </button>
            )}
            {onLogout && (
              <button onClick={onLogout} className="styled-button bg-red-500 text-white hover:bg-red-600 transition-colors px-6 py-3 rounded-lg font-normal shadow-md inline-flex items-center justify-center">
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
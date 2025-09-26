import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBuilding, FaCalendarAlt, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import LogoutModal from './LogoutModal';

function Sidebar() {
  const location = useLocation();
  // Check if navigation state indicates context (from search or managevenues)
  const contextFrom = location.state?.from;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const sidebarOptions = [
    {
      name: 'Home',
      route: '/dashboard',
      activePaths: ['/dashboard'],
      icon: <FaHome className="w-6 h-6 mr-4 inline-block text-blue-700" />
    },
    {
      name: 'Manage Venues',
      route: '/dashboard/venues',
      activePaths: ['/dashboard/venues', '/venues/add'],
      icon: <FaBuilding className="w-6 h-6 mr-4 inline-block text-blue-700" />
    },
    {
      name: 'Plan Events',
      route: '/dashboard/events',
      activePaths: ['/dashboard/events'],
      icon: <FaCalendarAlt className="w-6 h-6 mr-4 inline-block text-blue-700" />
    },
    {
      name: 'Notifications',
      route: '/dashboard/notifications',
      activePaths: ['/dashboard/notifications'],
      icon: <FaBell className="w-6 h-6 mr-4 inline-block text-blue-700" />
    },
    {
      name: 'Settings',
      route: '/dashboard/settings',
      activePaths: ['/dashboard/settings'],
      icon: <FiSettings className="w-6 h-6 mr-4 inline-block text-blue-700" />
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      <div className="text-blue-900 w-200 min-h-screen p-6 flex flex-col justify-between pt-20">
        {/* Top Section: Logo & System Name */}
        <div>
          <div className="flex items-center mb-10 px-5">
            <div className="w-14 h-14 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="#2563eb" strokeWidth="2" fill="#fff"/>
                <text x="16" y="21" textAnchor="middle" fontSize="14" fill="#2563eb" fontWeight="bold">EM</text>
              </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-wide">EventManager</span>
          </div>

          <ul className="flex flex-col space-y-8 px-5 mt-4 py-8">
            {sidebarOptions.map((item) => {
              let isActive;
              // Context-aware highlight for venue details
              if (location.pathname.startsWith('/dashboard/venues/') && contextFrom === 'search') {
                isActive = item.name === 'Home';
              } else if (location.pathname.startsWith('/dashboard/venues/') && contextFrom === 'managevenues') {
                isActive = item.name === 'Manage Venues';
              } else if (item.name === 'Home') {
                isActive = location.pathname === item.route;
              } else {
                isActive = item.activePaths.some(path =>
                  location.pathname.startsWith(path)
                );
              }

              return (
                <li
                  key={item.name}
                  className={`text-lg font-semibold cursor-pointer px-3 py-3 transition-all duration-200 rounded-xl
                    ${isActive ? 'bg-gold-500 text-white shadow-md' : ''}
                  `}
                >
                  <Link to={item.route} className="w-full h-full flex items-center">
                    {item.icon}
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Logout Option */}
        <div className="mt-8">
          <button
            className="w-full text-lg font-semibold px-5 py-2 text-left transition-all duration-200 flex items-center"
            onClick={() => setShowModal(true)}
          >
            <FaSignOutAlt className="w-6 h-6 mr-4 inline-block text-blue-700" />
            Logout
          </button>
        </div>
      </div>

      <LogoutModal
        open={showModal}
        onConfirm={handleLogout}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}

export default Sidebar;


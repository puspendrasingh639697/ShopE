


import React from 'react';
import useAuthStore from '../store/useAuthStore';
import NotificationDropdown from './NotificationDropdown';

const Topbar = ({ title }) => {
  const { user } = useAuthStore();

  return (
    <header className="bg-gradient-to-r from-red-400 to-red-600 shadow-sm border-b border-stone-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl  font-bold text-[#4a2e18]">{title}</h1>

      <div className="flex items-center gap-4">
        {/* ✅ Notification Bell */}
        <NotificationDropdown />

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-white">{user?.name}</p>
            <p className="text-xs text-stone-500 capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
          <div className="w-10 h-10 bg-[#8c0a15] text-white rounded-full flex items-center justify-center font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
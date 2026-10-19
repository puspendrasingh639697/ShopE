import React from 'react';
import useAuthStore from '../store/useAuthStore';

const Dashboard = () => {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const roleTitle = {
    super_admin: '👑 Super Admin Dashboard',
    admin: '🛡️ Admin Dashboard',
    blog_admin: '✏️ Blog Admin Dashboard',
    user: '👤 User Dashboard',
  };

  return (
    <div className="min-h-screen bg-[#fff3df] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-serif font-bold text-[#4a2e18] mb-4">
          {roleTitle[user.role] || 'Dashboard'}
        </h1>

        <div className="bg-stone-50 p-6 rounded-lg mb-6">
          <p className="text-sm text-stone-600 mb-1">Welcome back,</p>
          <p className="text-xl font-bold text-[#8c0a15]">{user.name}</p>
          <p className="text-xs text-stone-500 mt-2">
            Email: {user.email}
          </p>
          <p className="text-xs text-stone-500">
            Role: <span className="font-bold text-[#8c0a15]">{user.role}</span>
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-md text-sm font-bold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
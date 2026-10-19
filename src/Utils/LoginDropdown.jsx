import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiUser, BiShield, BiCrown, BiEdit, BiChevronDown } from 'react-icons/bi';
import useAuthStore from '../store/useAuthStore';

const LoginDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // ✅ Logged-in user
  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-[#8c0a15] text-white px-4 py-2 rounded-md text-sm font-bold"
        >
          <BiUser />
          {user.name?.split(' ')[0]}
          <BiChevronDown />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-stone-200 z-50">
            {user.role === 'super_admin' && (
              <Link
                to="/super-admin/dashboard"
                className="block px-4 py-2 text-sm hover:bg-stone-50"
                onClick={() => setIsOpen(false)}
              >
                👑 Super Admin
              </Link>
            )}

            {user.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="block px-4 py-2 text-sm hover:bg-stone-50"
                onClick={() => setIsOpen(false)}
              >
                🛡️ Admin
              </Link>
            )}

            {user.role === 'blog_admin' && (
              <Link
                to="/blog-admin/dashboard"
                className="block px-4 py-2 text-sm hover:bg-stone-50"
                onClick={() => setIsOpen(false)}
              >
                ✏️ Blog Admin
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  // ✅ Logged-out user — login options
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#8c0a15] text-white px-4 py-2 rounded-md text-sm font-bold"
      >
        <BiUser />
        Login
        <BiChevronDown />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-stone-200 z-50">
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-stone-50"
            onClick={() => setIsOpen(false)}
          >
            <BiUser className="text-[#8c0a15]" /> User Login
          </Link>

          <Link
            to="/admin/login"
            className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-stone-50"
            onClick={() => setIsOpen(false)}
          >
            <BiShield className="text-blue-600" /> Admin Login
          </Link>

          <Link
            to="/super-admin/login"
            className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-stone-50"
            onClick={() => setIsOpen(false)}
          >
            <BiCrown className="text-amber-600" /> Super Admin Login
          </Link>

          <Link
            to="/blog-admin/login"
            className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-stone-50"
            onClick={() => setIsOpen(false)}
          >
            <BiEdit className="text-green-600" /> Blog Admin Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default LoginDropdown;
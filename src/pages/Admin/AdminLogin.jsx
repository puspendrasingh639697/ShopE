import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiShield, BiUser, BiCrown, BiEdit, BiChevronDown } from 'react-icons/bi';
import useAuthStore from '../../store/useAuthStore';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ Login Roles — dropdown ke liye
  const loginRoles = [
    {
      id: 'user',
      label: 'User Login',
      icon: <BiUser className="text-[#8c0a15]" />,
      path: '/login',
    },
    {
      id: 'admin',
      label: 'Admin Login',
      icon: <BiShield className="text-blue-600" />,
      path: '/admin/login',
    },
    {
      id: 'super_admin',
      label: 'Super Admin Login',
      icon: <BiCrown className="text-amber-600" />,
      path: '/super-admin/login',
    },
    {
      id: 'blog_admin',
      label: 'Blog Admin Login',
      icon: <BiEdit className="text-green-600" />,
      path: '/blog-admin/login',
    },
  ];

  const currentRole = loginRoles.find((r) => r.path === window.location.pathname);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  console.log('🔐 Login attempt:', email);

  const result = await login(email, password);
  console.log('📥 Result:', result);

  if (!result.success) {
    setError(result.error);
    return;
  }

  const role = result.user.role;
  console.log('✅ Success! Role:', role);

  // ✅ Role-wise redirect — SAHI ROUTES
  if (role === 'super_admin') {
    navigate('/admin/dashboard');           // 👈 Super Admin bhi /admin/dashboard par
  } else if (role === 'admin') {
    navigate('/admin/dashboard');
  } else if (role === 'blog_admin') {
    navigate('/blog-admin/dashboard');
  } else {
    navigate('/account');                   // 👈 Normal user
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-orange-100 p-8">

        {/* ✅ Role Dropdown */}
        <div className="relative mb-6">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between gap-2 bg-orange-50 border border-orange-200 text-orange-800 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-100 transition"
          >
            <span className="flex items-center gap-2">
              {currentRole?.icon || <BiShield />}
              {currentRole?.label || 'Select Login Type'}
            </span>
            <BiChevronDown className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-orange-100 z-50 overflow-hidden">
              {loginRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setShowDropdown(false);
                    navigate(role.path);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-orange-50 transition text-left ${
                    currentRole?.id === role.id ? 'bg-orange-100 font-bold' : ''
                  }`}
                >
                  {role.icon}
                  {role.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-xs font-semibold mb-3">
            <BiShield className="w-3.5 h-3.5" />
            <span>{currentRole?.label || 'Admin Portal'}</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-gray-900">
            {currentRole?.label || 'Login'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">Sign in to your dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm bg-gray-50/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm bg-gray-50/50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-medium shadow-lg shadow-orange-500/25 hover:from-orange-700 hover:to-red-700 transition duration-300 text-sm mt-2 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;
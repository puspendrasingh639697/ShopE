import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BiUser, BiShield } from 'react-icons/bi';
import useAuthStore from '../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ Real backend login
    const result = await login(email, password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    // ✅ Role-wise redirect
    const role = result.user.role;

    if (role === 'super_admin') navigate('/super-admin/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'blog_admin') navigate('/blog-admin/dashboard');
    else navigate('/account'); // normal user
  };

  return (
    <div className="min-h-screen bg-[#fff3df] flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full border border-amber-100">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full uppercase">
            User Login
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mt-3">
            Welcome Back
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 rounded-xl shadow-md disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center text-sm text-stone-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-700 font-semibold hover:underline">
            Register
          </Link>
        </div>

        {/* Admin Login Link */}
        <div className="mt-4 pt-4 border-t border-stone-200 text-center">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800"
          >
            <BiShield className="text-base" /> Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
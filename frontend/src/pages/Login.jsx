import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (!result.error) {
      toast.success('Signed in successfully!');
      const lastRoute = localStorage.getItem('lastRoute');
      if (lastRoute && lastRoute !== '/login' && lastRoute !== '/register') {
        localStorage.removeItem('lastRoute');
        navigate(lastRoute);
      } else {
        navigate('/dashboard');
      }
    } else {
      toast.error(result.payload?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl px-6 py-8 flex flex-col gap-4"
        >
          {/* Email */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <EnvelopeIcon className="h-5 w-5" />
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="pl-10 pr-3 py-2 w-full rounded-md border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {/* Password */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <LockClosedIcon className="h-5 w-5" />
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className="pl-10 pr-16 py-2 w-full rounded-md border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-medium focus:outline-none"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {/* Forgot Password */}
          <div className="flex justify-end mb-2">
            <button
              type="button"
              className="text-gray-500 text-sm hover:underline focus:outline-none"
              tabIndex={0}
            >
              Forgot Password?
            </button>
          </div>
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm animate-fade-in mb-2" role="alert">
              {error}
            </div>
          )}
          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-black text-white font-semibold text-base shadow hover:bg-gray-900 transition-all duration-150 active:scale-95"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {/* Or Separator */}
          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          {/* Link to Register */}
          <Link
            to="/register"
            className="w-full py-2 rounded-md bg-gray-100 text-gray-700 font-semibold text-base shadow-sm hover:bg-gray-200 transition-all duration-150 text-center"
          >
            Create an account
          </Link>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, UserCircle } from 'lucide-react';

const Register = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);
    
    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-twitch-dark-light rounded-lg p-8 w-full max-w-md mx-4 max-h-screen overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Join Twitch Clone!</h2>
          <p className="text-twitch-gray-light">Create your account to start streaming</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-twitch-gray-light w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md pl-10 pr-4 py-3 text-white placeholder-twitch-gray-light focus:outline-none focus:border-twitch-purple transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Full Name (Optional)
            </label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-twitch-gray-light w-5 h-5" />
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md pl-10 pr-4 py-3 text-white placeholder-twitch-gray-light focus:outline-none focus:border-twitch-purple transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-twitch-gray-light w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password (min 6 characters)"
                className="w-full bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md pl-10 pr-12 py-3 text-white placeholder-twitch-gray-light focus:outline-none focus:border-twitch-purple transition-colors"
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-twitch-gray-light hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-twitch-gray-light w-5 h-5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md pl-10 pr-12 py-3 text-white placeholder-twitch-gray-light focus:outline-none focus:border-twitch-purple transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-twitch-gray-light hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-twitch-purple hover:bg-twitch-purple-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-md transition-colors"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-twitch-gray-light">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-twitch-purple hover:text-twitch-purple-light transition-colors font-medium"
            >
              Sign in
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-twitch-gray-light hover:text-white transition-colors"
          >
            Close
          </button>
        </div>

        <div className="mt-6 p-4 bg-twitch-dark-lighter rounded-md">
          <p className="text-twitch-gray-light text-sm mb-2">🔥 Firebase Authentication:</p>
          <div className="space-y-1 text-xs">
            <p className="text-white">✅ Email verification available</p>
            <p className="text-white">✅ Secure password storage</p>
            <p className="text-white">✅ Automatic session management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
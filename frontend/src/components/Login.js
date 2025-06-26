import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, User, Lock } from 'lucide-react';

const Login = ({ onClose, onSwitchToRegister }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(credentials);
    
    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-twitch-dark-light rounded-lg p-8 w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="text-twitch-gray-light">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-twitch-gray-light w-5 h-5" />
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md pl-10 pr-4 py-3 text-white placeholder-twitch-gray-light focus:outline-none focus:border-twitch-purple transition-colors"
                required
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
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md pl-10 pr-12 py-3 text-white placeholder-twitch-gray-light focus:outline-none focus:border-twitch-purple transition-colors"
                required
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-twitch-purple hover:bg-twitch-purple-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-md transition-colors"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-twitch-gray-light">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-twitch-purple hover:text-twitch-purple-light transition-colors font-medium"
            >
              Sign up
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
          <p className="text-twitch-gray-light text-sm mb-2">Demo Accounts:</p>
          <div className="space-y-1 text-xs">
            <p className="text-white">Username: <span className="text-twitch-purple">GamerPro123</span> | Password: <span className="text-twitch-purple">password123</span></p>
            <p className="text-white">Username: <span className="text-twitch-purple">MusicMaster</span> | Password: <span className="text-twitch-purple">password123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
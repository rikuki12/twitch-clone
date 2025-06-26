import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, MessageCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import Register from './Register';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <>
      <nav className="bg-twitch-dark-light border-b border-twitch-gray/20 px-4 py-3 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center space-x-8">
            <div 
              className="text-twitch-purple text-2xl font-bold cursor-pointer hover:text-twitch-purple-light transition-colors"
              onClick={() => navigate('/')}
            >
              Twitch
            </div>
            <div className="hidden md:flex space-x-6">
              <button 
                className="text-twitch-gray-light hover:text-white transition-colors"
                onClick={() => navigate('/browse/games')}
              >
                Browse
              </button>
              <button className="text-twitch-gray-light hover:text-white transition-colors">
                Esports
              </button>
              <button className="text-twitch-gray-light hover:text-white transition-colors">
                Music
              </button>
              <button className="text-twitch-gray-light hover:text-white transition-colors">
                More
              </button>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for channels, games, or categories"
                className="w-full bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md px-4 py-2 text-white placeholder-twitch-gray-light focus:outline-none focus:border-twitch-purple transition-colors navbar-search"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-twitch-gray-light hover:text-white transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button className="text-twitch-gray-light hover:text-white transition-colors">
                  <Heart className="w-6 h-6" />
                </button>
                <button className="text-twitch-gray-light hover:text-white transition-colors">
                  <MessageCircle className="w-6 h-6" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-twitch-dark-lighter hover:bg-twitch-gray/20 px-3 py-2 rounded-md transition-colors"
                  >
                    <img 
                      src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                      alt={user?.username}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-white text-sm font-medium">{user?.username}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-twitch-dark-light border border-twitch-gray/20 rounded-md shadow-lg z-50">
                      <div className="p-3 border-b border-twitch-gray/20">
                        <p className="text-white font-medium">{user?.username}</p>
                        <p className="text-twitch-gray-light text-sm">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => {
                            navigate(`/profile/${user?.username}`);
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-twitch-gray-light hover:text-white hover:bg-twitch-gray/20 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-twitch-gray-light hover:text-white hover:bg-twitch-gray/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button className="text-twitch-gray-light hover:text-white transition-colors">
                  <Heart className="w-6 h-6" />
                </button>
                <button className="text-twitch-gray-light hover:text-white transition-colors">
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setShowLogin(true)}
                  className="bg-twitch-purple hover:bg-twitch-purple-dark px-4 py-2 rounded-md text-white font-medium transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={() => setShowRegister(true)}
                  className="bg-twitch-purple-light hover:bg-twitch-purple px-4 py-2 rounded-md text-white font-medium transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={switchToRegister}
        />
      )}

      {/* Register Modal */}
      {showRegister && (
        <Register 
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={switchToLogin}
        />
      )}

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};

export default Navbar;
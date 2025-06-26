import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, MessageCircle } from 'lucide-react';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
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
          <button className="text-twitch-gray-light hover:text-white transition-colors">
            <Heart className="w-6 h-6" />
          </button>
          <button className="text-twitch-gray-light hover:text-white transition-colors">
            <MessageCircle className="w-6 h-6" />
          </button>
          <button className="bg-twitch-purple hover:bg-twitch-purple-dark px-4 py-2 rounded-md text-white font-medium transition-colors">
            Log In
          </button>
          <button className="bg-twitch-purple-light hover:bg-twitch-purple px-4 py-2 rounded-md text-white font-medium transition-colors">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
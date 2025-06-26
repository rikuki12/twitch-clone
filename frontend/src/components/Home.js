import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Users, Gamepad2, Music, Palette, Code, BookOpen, Dumbbell } from 'lucide-react';
import { apiService } from '../api';

const Home = () => {
  const navigate = useNavigate();
  const [streams, setStreams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch live streams and categories in parallel
      const [streamsData, categoriesData] = await Promise.all([
        apiService.getLiveStreams(null, 8), // Get 8 live streams
        apiService.getCategories(6) // Get 6 categories
      ]);
      
      setStreams(streamsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
      
      // Fallback to mock data if API fails
      setStreams(mockStreams);
      setCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  // Fallback mock data
  const mockStreams = [
    {
      id: 1,
      streamer_username: "GamerPro123",
      title: "Ranked Gameplay - Road to Diamond!",
      category: "Valorant",
      viewer_count: 15420,
      thumbnail_url: "https://images.pexels.com/photos/8728386/pexels-photo-8728386.jpeg",
      is_live: true
    },
    {
      id: 2,
      streamer_username: "MusicMaster",
      title: "Late Night Lofi Beats & Chill",
      category: "Music & Performing Arts",
      viewer_count: 8750,
      thumbnail_url: "https://images.pexels.com/photos/7233189/pexels-photo-7233189.jpeg",
      is_live: true
    }
  ];

  const mockCategories = [
    {
      id: 1,
      name: "Games",
      viewer_count: 1200000,
      thumbnail_url: "https://images.pexels.com/photos/7776899/pexels-photo-7776899.jpeg",
      stream_count: 150
    },
    {
      id: 2,
      name: "Music",
      viewer_count: 350000,
      thumbnail_url: "https://images.pexels.com/photos/7233194/pexels-photo-7233194.jpeg",
      stream_count: 45
    }
  ];

  const StreamCard = ({ stream }) => (
    <div 
      className="stream-card bg-twitch-dark-light rounded-lg overflow-hidden card-shadow"
      onClick={() => navigate(`/stream/${stream.streamer_username}`)}
    >
      <div className="relative">
        <img 
          src={stream.thumbnail_url} 
          alt={stream.title}
          className="w-full h-48 object-cover stream-thumbnail"
        />
        <div className="absolute top-2 left-2">
          <span className="live-badge">LIVE</span>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-sm">
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{stream.viewer_count.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stream.streamer_username}`}
            alt={stream.streamer_username}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm line-clamp-2 mb-1">
              {stream.title}
            </h3>
            <p className="text-twitch-gray-light text-sm mb-1">
              {stream.streamer_username}
            </p>
            <p className="text-twitch-gray-light text-sm">
              {stream.category}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const CategoryCard = ({ category }) => {
    const getIcon = (name) => {
      switch (name.toLowerCase()) {
        case 'games': return <Gamepad2 className="w-6 h-6" />;
        case 'music': return <Music className="w-6 h-6" />;
        case 'art': return <Palette className="w-6 h-6" />;
        case 'science & technology': return <Code className="w-6 h-6" />;
        case 'food & drink': return <BookOpen className="w-6 h-6" />;
        case 'fitness & health': return <Dumbbell className="w-6 h-6" />;
        default: return <Gamepad2 className="w-6 h-6" />;
      }
    };

    return (
      <div 
        className="category-card rounded-lg overflow-hidden cursor-pointer"
        onClick={() => navigate(`/browse/${category.slug || category.name.toLowerCase()}`)}
      >
        <div className="relative h-48">
          <img 
            src={category.thumbnail_url} 
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="category-overlay">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                {getIcon(category.name)}
                <h3 className="text-white font-semibold text-lg">{category.name}</h3>
              </div>
              <p className="text-twitch-gray-light text-sm">
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{category.viewer_count.toLocaleString()} viewers</span>
                </span>
              </p>
              {category.stream_count && (
                <p className="text-twitch-gray-light text-xs mt-1">
                  {category.stream_count} live streams
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="pt-20 p-6 max-w-screen-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-80 bg-twitch-dark-light rounded-xl mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-twitch-dark-light rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 p-6 max-w-screen-2xl mx-auto">
      {error && (
        <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-md p-4">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={fetchData}
            className="mt-2 text-twitch-purple hover:text-twitch-purple-light transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="mb-8">
        <div className="relative h-80 rounded-xl overflow-hidden gradient-bg">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 h-full flex items-center justify-center text-center">
            <div>
              <h1 className="text-6xl font-bold text-white mb-4 text-shadow">
                Welcome to Twitch
              </h1>
              <p className="text-xl text-white/90 mb-6 text-shadow">
                Discover amazing live streams from your favorite creators
              </p>
              <button 
                className="bg-white text-twitch-purple px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                onClick={() => navigate('/browse/all')}
              >
                Start Watching
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Channels */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Live Channels {streams.length > 0 && `(${streams.length})`}
          </h2>
          <button 
            className="text-twitch-purple hover:text-twitch-purple-light transition-colors"
            onClick={() => navigate('/browse/all')}
          >
            Show more
          </button>
        </div>
        {streams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {streams.map((stream) => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-twitch-gray-light text-lg mb-4">No live streams at the moment</p>
            <p className="text-twitch-gray-light">Check back later for amazing content!</p>
          </div>
        )}
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Browse Categories {categories.length > 0 && `(${categories.length})`}
          </h2>
          <button 
            className="text-twitch-purple hover:text-twitch-purple-light transition-colors"
            onClick={() => navigate('/browse/categories')}
          >
            Show more
          </button>
        </div>
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-twitch-gray-light text-lg">Categories loading...</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
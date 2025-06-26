import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Search, 
  Menu, 
  User, 
  Settings, 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreVertical,
  Play,
  Users,
  Eye,
  ThumbsUp,
  Gift,
  Crown,
  Gamepad2,
  Music,
  Mic,
  Camera,
  Code,
  BookOpen,
  Dumbbell,
  Palette,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Maximize,
  Settings as SettingsIcon,
  Send
} from 'lucide-react';

// Mock data for streams and categories
export const mockStreams = [
  {
    id: 1,
    username: "GamerPro123",
    title: "Ranked Gameplay - Road to Diamond!",
    game: "Valorant",
    viewers: 15420,
    thumbnail: "https://images.pexels.com/photos/8728386/pexels-photo-8728386.jpeg",
    isLive: true,
    avatar: "https://images.pexels.com/photos/7562468/pexels-photo-7562468.jpeg",
    category: "Games"
  },
  {
    id: 2,
    username: "MusicMaster",
    title: "Late Night Lofi Beats & Chill",
    game: "Music & Performing Arts",
    viewers: 8750,
    thumbnail: "https://images.pexels.com/photos/7233189/pexels-photo-7233189.jpeg",
    isLive: true,
    avatar: "https://images.pexels.com/photos/8512609/pexels-photo-8512609.jpeg",
    category: "Music"
  },
  {
    id: 3,
    username: "CodeWithMe",
    title: "Building a React App from Scratch",
    game: "Software and Game Development",
    viewers: 3200,
    thumbnail: "https://images.unsplash.com/photo-1569965352022-f014c3ca4c5e",
    isLive: true,
    avatar: "https://images.pexels.com/photos/7776899/pexels-photo-7776899.jpeg",
    category: "Science & Technology"
  },
  {
    id: 4,
    username: "ArtisticSoul",
    title: "Digital Art Stream - Creating Fantasy Characters",
    game: "Art",
    viewers: 2100,
    thumbnail: "https://images.unsplash.com/photo-1646614871839-881108ea8407",
    isLive: true,
    avatar: "https://images.pexels.com/photos/7657856/pexels-photo-7657856.jpeg",
    category: "Art"
  },
  {
    id: 5,
    username: "ChefStreamer",
    title: "Cooking Italian Pasta from Scratch",
    game: "Food & Drink",
    viewers: 1850,
    thumbnail: "https://images.unsplash.com/photo-1549476130-8afd7ecd8a45",
    isLive: true,
    avatar: "https://images.unsplash.com/photo-1550828486-68812fa3f966",
    category: "Food & Drink"
  },
  {
    id: 6,
    username: "TechReviewer",
    title: "Latest Gaming Gear Reviews & Setup Tour",
    game: "Science & Technology",
    viewers: 4200,
    thumbnail: "https://images.unsplash.com/photo-1597350153931-15bf0c672ce4",
    isLive: true,
    avatar: "https://images.unsplash.com/photo-1598347670477-27c12129dd7f",
    category: "Science & Technology"
  }
];

export const mockCategories = [
  {
    id: 1,
    name: "Games",
    viewers: 1200000,
    thumbnail: "https://images.pexels.com/photos/7776899/pexels-photo-7776899.jpeg",
    icon: <Gamepad2 className="w-6 h-6" />
  },
  {
    id: 2,
    name: "Music",
    viewers: 350000,
    thumbnail: "https://images.pexels.com/photos/7233194/pexels-photo-7233194.jpeg",
    icon: <Music className="w-6 h-6" />
  },
  {
    id: 3,
    name: "Art",
    viewers: 180000,
    thumbnail: "https://images.unsplash.com/photo-1639759032532-c7f288e9ef4f",
    icon: <Palette className="w-6 h-6" />
  },
  {
    id: 4,
    name: "Science & Technology",
    viewers: 120000,
    thumbnail: "https://images.unsplash.com/photo-1569965352022-f014c3ca4c5e",
    icon: <Code className="w-6 h-6" />
  },
  {
    id: 5,
    name: "Food & Drink",
    viewers: 95000,
    thumbnail: "https://images.unsplash.com/photo-1549476130-8afd7ecd8a45",
    icon: <BookOpen className="w-6 h-6" />
  },
  {
    id: 6,
    name: "Fitness & Health",
    viewers: 75000,
    thumbnail: "https://images.pexels.com/photos/7657856/pexels-photo-7657856.jpeg",
    icon: <Dumbbell className="w-6 h-6" />
  }
];

export const mockChatMessages = [
  { id: 1, username: "ViewerOne", message: "This is amazing! 🔥", color: "#FF6B6B" },
  { id: 2, username: "GamerFan", message: "How do you get so good at this?", color: "#4ECDC4" },
  { id: 3, username: "ProPlayer", message: "Nice play! 👏", color: "#45B7D1" },
  { id: 4, username: "StreamLover", message: "Been watching for 2 hours straight", color: "#96CEB4" },
  { id: 5, username: "NewViewer", message: "Just followed! Great content", color: "#FECA57" },
  { id: 6, username: "RegularFan", message: "When's the next stream?", color: "#FF9FF3" },
  { id: 7, username: "SupporterOne", message: "Gave 100 bits! Keep it up!", color: "#54A0FF" },
  { id: 8, username: "GameExpert", message: "Try using different strategy here", color: "#5F27CD" }
];

// Navbar Component
export const Navbar = () => {
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
              className="w-full bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md px-4 py-2 text-white placeholder-twitch-gray-light focus:outline-none focus:border-twitch-purple transition-colors"
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

// Sidebar Component
export const Sidebar = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  
  const followedChannels = [
    { username: "GamerPro123", isLive: true, game: "Valorant", viewers: 15420 },
    { username: "MusicMaster", isLive: true, game: "Music", viewers: 8750 },
    { username: "CodeWithMe", isLive: true, game: "Programming", viewers: 3200 },
    { username: "ArtisticSoul", isLive: false, game: "Art", viewers: 0 },
    { username: "ChefStreamer", isLive: true, game: "Cooking", viewers: 1850 }
  ];

  const recommendedChannels = [
    { username: "TechReviewer", isLive: true, game: "Technology", viewers: 4200 },
    { username: "FitnessGuru", isLive: false, game: "Fitness", viewers: 0 },
    { username: "BookClub", isLive: true, game: "Talk Shows", viewers: 950 }
  ];

  return (
    <aside className={`bg-twitch-dark-light border-r border-twitch-gray/20 fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 ${collapsed ? 'w-12' : 'w-64'} z-40`}>
      <div className="p-4">
        <button
          onClick={onToggle}
          className="text-twitch-gray-light hover:text-white transition-colors mb-4"
        >
          <Menu className="w-6 h-6" />
        </button>

        {!collapsed && (
          <div className="space-y-6">
            <div>
              <h3 className="text-twitch-gray-light text-sm font-medium mb-3 uppercase tracking-wide">
                Followed Channels
              </h3>
              <div className="space-y-2">
                {followedChannels.map((channel) => (
                  <div
                    key={channel.username}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-twitch-dark-lighter cursor-pointer transition-colors"
                    onClick={() => navigate(`/stream/${channel.username}`)}
                  >
                    <div className="w-8 h-8 bg-twitch-purple rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-white text-sm font-medium truncate">
                          {channel.username}
                        </p>
                        {channel.isLive && (
                          <span className="live-badge">LIVE</span>
                        )}
                      </div>
                      <p className="text-twitch-gray-light text-xs truncate">
                        {channel.isLive ? channel.game : 'Offline'}
                      </p>
                    </div>
                    {channel.isLive && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-twitch-gray-light text-xs">
                          {channel.viewers.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-twitch-gray-light text-sm font-medium mb-3 uppercase tracking-wide">
                Recommended Channels
              </h3>
              <div className="space-y-2">
                {recommendedChannels.map((channel) => (
                  <div
                    key={channel.username}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-twitch-dark-lighter cursor-pointer transition-colors"
                    onClick={() => navigate(`/stream/${channel.username}`)}
                  >
                    <div className="w-8 h-8 bg-twitch-gray rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-white text-sm font-medium truncate">
                          {channel.username}
                        </p>
                        {channel.isLive && (
                          <span className="live-badge">LIVE</span>
                        )}
                      </div>
                      <p className="text-twitch-gray-light text-xs truncate">
                        {channel.isLive ? channel.game : 'Offline'}
                      </p>
                    </div>
                    {channel.isLive && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-twitch-gray-light text-xs">
                          {channel.viewers.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Users, Gamepad2, Music, Palette, Code, BookOpen, Dumbbell } from 'lucide-react';

const mockStreams = [
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

const mockCategories = [
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

const Home = () => {
  const navigate = useNavigate();

  const StreamCard = ({ stream }) => (
    <div 
      className="stream-card bg-twitch-dark-light rounded-lg overflow-hidden card-shadow"
      onClick={() => navigate(`/stream/${stream.username}`)}
    >
      <div className="relative">
        <img 
          src={stream.thumbnail} 
          alt={stream.title}
          className="w-full h-48 object-cover stream-thumbnail"
        />
        <div className="absolute top-2 left-2">
          <span className="live-badge">LIVE</span>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-sm">
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{stream.viewers.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <img 
            src={stream.avatar} 
            alt={stream.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm line-clamp-2 mb-1">
              {stream.title}
            </h3>
            <p className="text-twitch-gray-light text-sm mb-1">
              {stream.username}
            </p>
            <p className="text-twitch-gray-light text-sm">
              {stream.game}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const CategoryCard = ({ category }) => (
    <div 
      className="category-card rounded-lg overflow-hidden cursor-pointer"
      onClick={() => navigate(`/browse/${category.name.toLowerCase()}`)}
    >
      <div className="relative h-48">
        <img 
          src={category.thumbnail} 
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="category-overlay">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {category.icon}
              <h3 className="text-white font-semibold text-lg">{category.name}</h3>
            </div>
            <p className="text-twitch-gray-light text-sm">
              <span className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{category.viewers.toLocaleString()} viewers</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-20 p-6 max-w-screen-2xl mx-auto">
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
              <button className="bg-white text-twitch-purple px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                Start Watching
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Channels */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Live Channels</h2>
          <button 
            className="text-twitch-purple hover:text-twitch-purple-light transition-colors"
            onClick={() => navigate('/browse/all')}
          >
            Show more
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockStreams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Browse Categories</h2>
          <button 
            className="text-twitch-purple hover:text-twitch-purple-light transition-colors"
            onClick={() => navigate('/browse/categories')}
          >
            Show more
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
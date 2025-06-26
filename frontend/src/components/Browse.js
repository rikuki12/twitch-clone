import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, Users } from 'lucide-react';

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

const Browse = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const filteredStreams = category === 'all' 
    ? mockStreams 
    : mockStreams.filter(stream => 
        stream.category.toLowerCase().includes(category?.toLowerCase() || '')
      );

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

  return (
    <div className="pt-20 p-6 max-w-screen-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Browse {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All'} Streams
        </h1>
        <div className="flex items-center space-x-1 text-twitch-gray-light">
          <Users className="w-4 h-4" />
          <span>{filteredStreams.reduce((total, stream) => total + stream.viewers, 0).toLocaleString()} viewers</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <select className="bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md px-4 py-2 text-white focus:outline-none focus:border-twitch-purple">
            <option>Sort by: Viewers (high to low)</option>
            <option>Sort by: Recently started</option>
            <option>Sort by: Recommended</option>
          </select>
          <select className="bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md px-4 py-2 text-white focus:outline-none focus:border-twitch-purple">
            <option>All Languages</option>
            <option>English</option>
            <option>Spanish</option>
            <option>Portuguese</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStreams.map((stream) => (
          <StreamCard key={stream.id} stream={stream} />
        ))}
      </div>

      {filteredStreams.length === 0 && (
        <div className="text-center py-12">
          <div className="text-twitch-gray-light text-lg mb-4">
            No streams found for this category
          </div>
          <button 
            className="text-twitch-purple hover:text-twitch-purple-light transition-colors"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default Browse;
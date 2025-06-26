import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, User } from 'lucide-react';

const Sidebar = ({ collapsed, onToggle }) => {
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
    <aside className={`bg-twitch-dark-light border-r border-twitch-gray/20 fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 ${collapsed ? 'w-12' : 'w-64'} z-40 overflow-y-auto`}>
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
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-twitch-dark-lighter cursor-pointer transition-colors sidebar-item"
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
                        <div className="w-2 h-2 bg-red-500 rounded-full live-indicator"></div>
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
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-twitch-dark-lighter cursor-pointer transition-colors sidebar-item"
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
                        <div className="w-2 h-2 bg-red-500 rounded-full live-indicator"></div>
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

export default Sidebar;
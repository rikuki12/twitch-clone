import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  MoreVertical, 
  Users, 
  Eye, 
  ThumbsUp, 
  Gift,
  Settings,
  Volume2,
  Maximize,
  Send,
  Crown
} from 'lucide-react';

const mockChatMessages = [
  { id: 1, username: "ViewerOne", message: "This is amazing! 🔥", color: "#FF6B6B", timestamp: "12:34" },
  { id: 2, username: "GamerFan", message: "How do you get so good at this?", color: "#4ECDC4", timestamp: "12:35" },
  { id: 3, username: "ProPlayer", message: "Nice play! 👏", color: "#45B7D1", timestamp: "12:35" },
  { id: 4, username: "StreamLover", message: "Been watching for 2 hours straight", color: "#96CEB4", timestamp: "12:36" },
  { id: 5, username: "NewViewer", message: "Just followed! Great content", color: "#FECA57", timestamp: "12:37" },
  { id: 6, username: "RegularFan", message: "When's the next stream?", color: "#FF9FF3", timestamp: "12:37" },
  { id: 7, username: "SupporterOne", message: "Gave 100 bits! Keep it up!", color: "#54A0FF", timestamp: "12:38" },
  { id: 8, username: "GameExpert", message: "Try using different strategy here", color: "#5F27CD", timestamp: "12:38" }
];

const StreamPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState(mockChatMessages);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock stream data
  const streamData = {
    username: username || "GamerPro123",
    title: "Ranked Gameplay - Road to Diamond! | 24hr Stream Challenge",
    game: "Valorant",
    viewers: 15420,
    thumbnail: "https://images.pexels.com/photos/8728386/pexels-photo-8728386.jpeg",
    avatar: "https://images.pexels.com/photos/7562468/pexels-photo-7562468.jpeg",
    followers: 245000,
    isLive: true,
    streamStarted: "3 hours ago"
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        username: "You",
        message: chatMessage,
        color: "#9146FF",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage('');
    }
  };

  // Simulate new chat messages
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessages = [
        "This gameplay is insane! 😍",
        "How are you so good?",
        "Nice shot!",
        "GG wp",
        "Clutch!!! 🔥",
        "Following now!",
        "Love this stream ❤️"
      ];
      
      const randomUsernames = [
        "Viewer123", "GameFan99", "StreamWatcher", "ProGamer", "NewFollower", "ChatUser"
      ];

      const randomMessage = {
        id: Date.now(),
        username: randomUsernames[Math.floor(Math.random() * randomUsernames.length)],
        message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev.slice(-50), randomMessage]); // Keep last 50 messages
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-16 bg-twitch-dark min-h-screen">
      <div className="flex">
        {/* Main Stream Area */}
        <div className={`flex-1 ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
          {/* Video Player */}
          <div className={`relative bg-black ${isFullscreen ? 'h-full' : 'aspect-video'}`}>
            <img 
              src={streamData.thumbnail}
              alt="Stream"
              className="w-full h-full object-cover"
            />
            
            {/* Stream Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-black/70 px-3 py-1 rounded">
                  <div className="w-2 h-2 bg-red-500 rounded-full live-indicator"></div>
                  <span className="text-white text-sm font-medium">LIVE</span>
                </div>
                <div className="flex items-center space-x-1 bg-black/70 px-3 py-1 rounded text-white">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{streamData.viewers.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="bg-black/70 hover:bg-black/90 p-2 rounded text-white transition-colors">
                  <Volume2 className="w-5 h-5" />
                </button>
                <button className="bg-black/70 hover:bg-black/90 p-2 rounded text-white transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <button 
                  className="bg-black/70 hover:bg-black/90 p-2 rounded text-white transition-colors"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Stream Info */}
          {!isFullscreen && (
            <div className="p-6 bg-twitch-dark-light">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <img 
                    src={streamData.avatar}
                    alt={streamData.username}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h1 className="text-xl font-bold text-white mb-1">
                      {streamData.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-twitch-gray-light">
                      <span className="font-medium text-twitch-purple">
                        {streamData.username}
                      </span>
                      <span>{streamData.game}</span>
                      <span>Started {streamData.streamStarted}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button 
                    className={`px-6 py-2 rounded-md font-medium transition-all ${
                      isFollowing 
                        ? 'bg-twitch-gray text-white hover:bg-twitch-gray/80' 
                        : 'bg-twitch-purple text-white hover:bg-twitch-purple-dark follow-button'
                    }`}
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    <div className="flex items-center space-x-2">
                      <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current' : ''}`} />
                      <span>{isFollowing ? 'Following' : 'Follow'}</span>
                    </div>
                  </button>
                  <button className="p-2 bg-twitch-dark-lighter hover:bg-twitch-gray rounded-md text-twitch-gray-light hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-twitch-dark-lighter hover:bg-twitch-gray rounded-md text-twitch-gray-light hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-twitch-gray-light">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{streamData.followers.toLocaleString()} followers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>2.3k likes</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {!isFullscreen && (
          <div className="w-80 bg-twitch-dark-light border-l border-twitch-gray/20 h-[calc(100vh-4rem)] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-twitch-gray/20">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">Stream Chat</h3>
                <div className="flex items-center space-x-2">
                  <button className="text-twitch-gray-light hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="text-twitch-gray-light hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="chat-message">
                  <span className="text-xs text-twitch-gray-light mr-2">
                    {msg.timestamp}
                  </span>
                  <span 
                    className="font-medium mr-2"
                    style={{ color: msg.color }}
                  >
                    {msg.username}:
                  </span>
                  <span className="text-white text-sm">
                    {msg.message}
                  </span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-twitch-gray/20">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Say something..."
                  className="flex-1 bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md px-3 py-2 text-white placeholder-twitch-gray-light focus:outline-none focus:border-twitch-purple transition-colors"
                />
                <button
                  type="submit"
                  className="bg-twitch-purple hover:bg-twitch-purple-dark px-3 py-2 rounded-md text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center justify-between mt-2 text-xs text-twitch-gray-light">
                <span>{chatMessages.length} messages</span>
                <div className="flex items-center space-x-2">
                  <Gift className="w-4 h-4" />
                  <Crown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamPage;
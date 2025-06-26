import React, { useState, useEffect, useRef } from 'react';
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
  Crown,
  Smile,
  Ban,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../api';

const StreamPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatConnected, setChatConnected] = useState(false);
  const [onlineViewers, setOnlineViewers] = useState(0);
  const chatRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    fetchStreamData();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [username]);

  useEffect(() => {
    if (streamData && streamData.id) {
      connectToChat();
    }
  }, [streamData, user]);

  useEffect(() => {
    // Auto-scroll chat to bottom
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const fetchStreamData = async () => {
    try {
      setLoading(true);
      // For demo, we'll use mock data but structure it like API response
      const mockStream = {
        id: "stream_" + username,
        streamer_username: username,
        title: `Live Stream by ${username}`,
        category: "Gaming",
        thumbnail_url: "https://images.pexels.com/photos/8728386/pexels-photo-8728386.jpeg",
        viewer_count: Math.floor(Math.random() * 20000) + 1000,
        is_live: true,
        started_at: new Date().toISOString(),
        streamer_id: "user_" + username
      };
      
      setStreamData(mockStream);
      setOnlineViewers(mockStream.viewer_count);
    } catch (error) {
      console.error('Error fetching stream:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectToChat = () => {
    if (!streamData || wsRef.current) return;

    try {
      wsRef.current = apiService.connectToChat(
        streamData.id,
        handleChatMessage,
        () => {
          setChatConnected(true);
          console.log('Connected to chat');
        },
        () => {
          setChatConnected(false);
          console.log('Disconnected from chat');
        }
      );
    } catch (error) {
      console.error('Failed to connect to chat:', error);
      // Fallback to mock chat simulation
      simulateChatMessages();
    }
  };

  const simulateChatMessages = () => {
    const mockMessages = [
      { id: 1, username: "ViewerOne", message: "This is amazing! 🔥", color: "#FF6B6B", timestamp: new Date().toISOString() },
      { id: 2, username: "GamerFan", message: "How do you get so good at this?", color: "#4ECDC4", timestamp: new Date().toISOString() },
      { id: 3, username: "ProPlayer", message: "Nice play! 👏", color: "#45B7D1", timestamp: new Date().toISOString() },
    ];
    
    setChatMessages(mockMessages);
    
    // Simulate new messages
    const interval = setInterval(() => {
      const randomMessages = [
        "This gameplay is insane! 😍",
        "How are you so good?",
        "Nice shot!",
        "GG wp",
        "Clutch!!! 🔥",
        "Following now!",
        "Love this stream ❤️",
        "What's your setup?",
        "Been watching for hours!",
        "First time here, amazing content!"
      ];
      
      const randomUsernames = [
        "Viewer123", "GameFan99", "StreamWatcher", "ProGamer", "NewFollower", "ChatUser", "LiveViewer", "StreamLover"
      ];
      
      const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57", "#FF9FF3", "#54A0FF", "#5F27CD"];
      
      const newMessage = {
        id: Date.now(),
        username: randomUsernames[Math.floor(Math.random() * randomUsernames.length)],
        message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        timestamp: new Date().toISOString()
      };

      setChatMessages(prev => [...prev.slice(-49), newMessage]);
    }, 3000);

    return () => clearInterval(interval);
  };

  const handleChatMessage = (messageData) => {
    setChatMessages(prev => [...prev.slice(-49), messageData]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || !isAuthenticated) return;

    const message = {
      username: user.username,
      message: chatMessage.trim(),
      color: user.color || "#9146FF"
    };

    try {
      if (wsRef.current && chatConnected) {
        wsRef.current.send(message);
      } else {
        // Fallback: add message locally
        const newMessage = {
          id: Date.now(),
          ...message,
          timestamp: new Date().toISOString()
        };
        setChatMessages(prev => [...prev.slice(-49), newMessage]);
      }
      setChatMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleFollow = async () => {
    if (!isAuthenticated) {
      // Show login modal or redirect
      return;
    }
    
    try {
      if (isFollowing) {
        await apiService.unfollowUser(username);
        setIsFollowing(false);
      } else {
        await apiService.followUser(username);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="pt-16 bg-twitch-dark min-h-screen">
        <div className="animate-pulse">
          <div className="aspect-video bg-twitch-dark-light"></div>
          <div className="p-6 bg-twitch-dark-light">
            <div className="h-6 bg-twitch-gray rounded mb-4"></div>
            <div className="h-4 bg-twitch-gray rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!streamData) {
    return (
      <div className="pt-16 bg-twitch-dark min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Stream not found</h1>
          <button 
            onClick={() => navigate('/')}
            className="text-twitch-purple hover:text-twitch-purple-light transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-twitch-dark min-h-screen">
      <div className="flex">
        {/* Main Stream Area */}
        <div className={`flex-1 ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
          {/* Video Player */}
          <div className={`relative bg-black ${isFullscreen ? 'h-full' : 'aspect-video'}`}>
            <img 
              src={streamData.thumbnail_url}
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
                  <span className="text-sm">{onlineViewers.toLocaleString()}</span>
                </div>
                {chatConnected && (
                  <div className="flex items-center space-x-1 bg-green-600/70 px-3 py-1 rounded text-white">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Chat Connected</span>
                  </div>
                )}
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
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${streamData.streamer_username}`}
                    alt={streamData.streamer_username}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h1 className="text-xl font-bold text-white mb-1">
                      {streamData.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-twitch-gray-light">
                      <span className="font-medium text-twitch-purple">
                        {streamData.streamer_username}
                      </span>
                      <span>{streamData.category}</span>
                      <span>Started {formatTime(streamData.started_at)}</span>
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
                    onClick={handleFollow}
                    disabled={!isAuthenticated}
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
                  <span>245K followers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>2.3k likes</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Chat Sidebar */}
        {!isFullscreen && (
          <div className="w-80 bg-twitch-dark-light border-l border-twitch-gray/20 h-[calc(100vh-4rem)] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-twitch-gray/20">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">Stream Chat</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${chatConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-twitch-gray-light">
                    {chatConnected ? 'Connected' : 'Disconnected'}
                  </span>
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
            <div 
              ref={chatRef}
              className="flex-1 overflow-y-auto p-4 space-y-2"
            >
              {chatMessages.map((msg) => (
                <div key={msg.id} className="chat-message">
                  <span className="text-xs text-twitch-gray-light mr-2">
                    {formatTime(msg.timestamp)}
                  </span>
                  <span 
                    className="font-medium mr-2 cursor-pointer hover:underline"
                    style={{ color: msg.color }}
                  >
                    {msg.username}:
                  </span>
                  <span className="text-white text-sm">
                    {msg.message}
                  </span>
                </div>
              ))}
              
              {chatMessages.length === 0 && (
                <div className="text-center text-twitch-gray-light py-8">
                  <p>Welcome to the chat!</p>
                  <p className="text-sm">Be the first to say something.</p>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-twitch-gray/20">
              {isAuthenticated ? (
                <>
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Say something..."
                      className="flex-1 bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md px-3 py-2 text-white placeholder-twitch-gray-light focus:outline-none focus:border-twitch-purple transition-colors"
                      maxLength="500"
                    />
                    <button
                      type="button"
                      className="bg-twitch-dark-lighter hover:bg-twitch-gray border border-twitch-gray/30 rounded-md px-3 py-2 text-twitch-gray-light hover:text-white transition-colors"
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                    <button
                      type="submit"
                      disabled={!chatMessage.trim()}
                      className="bg-twitch-purple hover:bg-twitch-purple-dark disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-md text-white transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                  <div className="flex items-center justify-between mt-2 text-xs text-twitch-gray-light">
                    <span>{chatMessages.length} messages</span>
                    <div className="flex items-center space-x-2">
                      <Gift className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                      <Crown className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-twitch-gray-light text-sm mb-3">
                    Log in to join the chat
                  </p>
                  <button 
                    className="bg-twitch-purple hover:bg-twitch-purple-dark px-4 py-2 rounded-md text-white font-medium transition-colors"
                    onClick={() => {/* Show login modal */}}
                  >
                    Log In
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamPage;
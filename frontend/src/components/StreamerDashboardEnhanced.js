import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../api';
import webrtcService from '../services/webrtc-service';
import LiveStreamModal from './LiveStreamModal';
import { 
  Play, 
  Square, 
  Settings, 
  Users, 
  Eye, 
  MessageCircle,
  TrendingUp,
  Clock,
  Edit,
  Save,
  X,
  Camera,
  Mic,
  Monitor,
  AlertCircle,
  Video,
  Share,
  Copy
} from 'lucide-react';

const StreamerDashboardEnhanced = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentStream, setCurrentStream] = useState(null);
  const [streamForm, setStreamForm] = useState({
    title: '',
    category: 'Gaming',
    description: ''
  });
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const [stats, setStats] = useState({
    totalViewers: 0,
    peakViewers: 0,
    followers: 0,
    chatMessages: 0
  });

  const categories = [
    'Gaming', 'Music', 'Art', 'Science & Technology', 
    'Food & Drink', 'Fitness & Health', 'Education', 'Just Chatting'
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserStreams();
      fetchUserStats();
    }

    // Set up WebRTC callbacks
    webrtcService.setOnViewerCountUpdate((count) => {
      setViewerCount(count);
    });

    return () => {
      // Cleanup WebRTC when component unmounts
      if (webrtcService.isCurrentlyStreaming()) {
        webrtcService.stopStream();
      }
    };
  }, [isAuthenticated]);

  const fetchUserStreams = async () => {
    try {
      if (!user?.username) return;
      
      // For demo, simulate user's streams
      const mockStream = {
        id: "stream_demo_" + user.username,
        title: "My Awesome Stream",
        category: "Gaming",
        description: "Playing some amazing games!",
        is_live: false,
        viewer_count: 0,
        created_at: new Date().toISOString()
      };
      
      setCurrentStream(mockStream);
      setStreamForm({
        title: mockStream.title,
        category: mockStream.category,
        description: mockStream.description || ''
      });
    } catch (error) {
      console.error('Error fetching streams:', error);
    }
  };

  const fetchUserStats = async () => {
    // Simulate user stats
    setStats({
      totalViewers: Math.floor(Math.random() * 1000),
      peakViewers: Math.floor(Math.random() * 5000),
      followers: Math.floor(Math.random() * 10000),
      chatMessages: Math.floor(Math.random() * 50000)
    });
  };

  const handleCreateStream = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate creating stream
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStream = {
        id: "stream_" + Date.now(),
        ...streamForm,
        is_live: false,
        viewer_count: 0,
        created_at: new Date().toISOString()
      };
      
      setCurrentStream(newStream);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating stream:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoLive = () => {
    setShowLiveModal(true);
  };

  const handleStopLive = async () => {
    try {
      setLoading(true);
      await webrtcService.stopStream();
      setIsLive(false);
      setRoomId('');
      setViewerCount(0);
    } catch (error) {
      console.error('Error stopping live stream:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStream = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate updating stream
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCurrentStream(prev => ({
        ...prev,
        ...streamForm
      }));
    } catch (error) {
      console.error('Error updating stream:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyStreamUrl = () => {
    if (roomId) {
      const streamUrl = `${window.location.origin}/watch/${roomId}`;
      navigator.clipboard.writeText(streamUrl);
      // Could add toast notification here
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-20 p-6 max-w-screen-2xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">Streamer Dashboard</h1>
          <p className="text-twitch-gray-light mb-6">You need to be logged in to access the dashboard</p>
          <button className="bg-twitch-purple hover:bg-twitch-purple-dark px-6 py-3 rounded-md text-white font-medium transition-colors">
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 p-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Creator Dashboard</h1>
            <p className="text-twitch-gray-light">Manage your streams and engage with your audience</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
              isLive ? 'bg-red-600' : 'bg-twitch-dark-lighter'
            }`}>
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-white animate-pulse' : 'bg-twitch-gray'}`}></div>
              <span className="text-white font-medium">
                {isLive ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
            
            {roomId && (
              <div className="bg-twitch-dark-lighter px-4 py-2 rounded-md">
                <span className="text-twitch-gray-light text-sm">Room: </span>
                <span className="text-white font-mono">{roomId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-twitch-dark-light rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-twitch-gray-light text-sm">Current Viewers</p>
              <p className="text-2xl font-bold text-white">
                {isLive ? viewerCount : 0}
              </p>
            </div>
            <Eye className="w-8 h-8 text-twitch-purple" />
          </div>
        </div>

        <div className="bg-twitch-dark-light rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-twitch-gray-light text-sm">Followers</p>
              <p className="text-2xl font-bold text-white">{stats.followers.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-twitch-dark-light rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-twitch-gray-light text-sm">Peak Viewers</p>
              <p className="text-2xl font-bold text-white">{Math.max(stats.peakViewers, viewerCount).toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-twitch-dark-light rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-twitch-gray-light text-sm">Chat Messages</p>
              <p className="text-2xl font-bold text-white">{stats.chatMessages.toLocaleString()}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stream Controls */}
        <div className="lg:col-span-2">
          <div className="bg-twitch-dark-light rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Live Stream Controls</h2>
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-green-500" />
                <Mic className="w-5 h-5 text-green-500" />
                <Monitor className="w-5 h-5 text-green-500" />
              </div>
            </div>

            {currentStream ? (
              <div>
                <div className="bg-twitch-dark-lighter rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{currentStream.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-twitch-gray-light">
                    <span>Category: {currentStream.category}</span>
                    <span>•</span>
                    <span>Created: {new Date(currentStream.created_at).toLocaleDateString()}</span>
                    {isLive && (
                      <>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{viewerCount} viewers</span>
                        </div>
                      </>
                    )}
                  </div>
                  {currentStream.description && (
                    <p className="text-twitch-gray-light mt-2">{currentStream.description}</p>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {!isLive ? (
                    <button
                      onClick={handleGoLive}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2 px-6 py-3 rounded-md text-white font-medium transition-colors"
                    >
                      <Video className="w-5 h-5" />
                      <span>Go Live</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopLive}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2 px-6 py-3 rounded-md text-white font-medium transition-colors"
                    >
                      <Square className="w-5 h-5" />
                      <span>{loading ? 'Stopping...' : 'Stop Live'}</span>
                    </button>
                  )}
                  
                  {roomId && (
                    <button
                      onClick={copyStreamUrl}
                      className="bg-twitch-purple hover:bg-twitch-purple-dark flex items-center space-x-2 px-4 py-3 rounded-md text-white transition-colors"
                    >
                      <Share className="w-5 h-5" />
                      <span>Share Stream</span>
                    </button>
                  )}
                  
                  <button className="bg-twitch-dark-lighter hover:bg-twitch-gray flex items-center space-x-2 px-4 py-3 rounded-md text-white transition-colors">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </button>
                </div>

                {/* Live Stream Info */}
                {isLive && roomId && (
                  <div className="mt-6 bg-green-600/20 border border-green-600/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-medium">You're Live!</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-white">Room ID:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-mono">{roomId}</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(roomId)}
                            className="text-green-400 hover:text-green-300 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white">Stream URL:</span>
                        <button
                          onClick={copyStreamUrl}
                          className="text-green-400 hover:text-green-300 transition-colors text-sm"
                        >
                          Copy Link
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white">Current Viewers:</span>
                        <span className="text-white font-medium">{viewerCount}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-twitch-gray-light mx-auto mb-4" />
                <p className="text-twitch-gray-light mb-4">No stream configured</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-twitch-purple hover:bg-twitch-purple-dark px-6 py-3 rounded-md text-white font-medium transition-colors"
                >
                  Create Stream
                </button>
              </div>
            )}
          </div>

          {/* Stream Settings Form */}
          {(showCreateForm || currentStream) && (
            <div className="bg-twitch-dark-light rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {showCreateForm ? 'Create New Stream' : 'Stream Settings'}
                </h2>
                {showCreateForm && (
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-twitch-gray-light hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <form onSubmit={showCreateForm ? handleCreateStream : handleUpdateStream} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Stream Title
                  </label>
                  <input
                    type="text"
                    value={streamForm.title}
                    onChange={(e) => setStreamForm(prev => ({...prev, title: e.target.value}))}
                    placeholder="Enter an engaging title for your stream"
                    className="w-full bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md px-4 py-3 text-white placeholder-twitch-gray-light focus:outline-none focus:border-twitch-purple transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={streamForm.category}
                    onChange={(e) => setStreamForm(prev => ({...prev, category: e.target.value}))}
                    className="w-full bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-twitch-purple transition-colors"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={streamForm.description}
                    onChange={(e) => setStreamForm(prev => ({...prev, description: e.target.value}))}
                    placeholder="Describe what you'll be streaming about..."
                    rows="3"
                    className="w-full bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md px-4 py-3 text-white placeholder-twitch-gray-light focus:outline-none focus:border-twitch-purple transition-colors resize-none"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    disabled={loading || !streamForm.title.trim()}
                    className="bg-twitch-purple hover:bg-twitch-purple-dark disabled:opacity-50 flex items-center space-x-2 px-6 py-3 rounded-md text-white font-medium transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    <span>
                      {loading 
                        ? (showCreateForm ? 'Creating...' : 'Updating...') 
                        : (showCreateForm ? 'Create Stream' : 'Update Stream')
                      }
                    </span>
                  </button>
                  
                  {!showCreateForm && (
                    <button
                      type="button"
                      className="bg-twitch-dark-lighter hover:bg-twitch-gray px-4 py-3 rounded-md text-white transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar - Same as before */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-twitch-dark-light rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-twitch-dark-lighter hover:bg-twitch-gray px-4 py-3 rounded-md text-white text-left transition-colors">
                <div className="flex items-center space-x-3">
                  <Edit className="w-5 h-5 text-twitch-purple" />
                  <span>Edit Profile</span>
                </div>
              </button>
              
              <button className="w-full bg-twitch-dark-lighter hover:bg-twitch-gray px-4 py-3 rounded-md text-white text-left transition-colors">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span>View Analytics</span>
                </div>
              </button>
              
              <button className="w-full bg-twitch-dark-lighter hover:bg-twitch-gray px-4 py-3 rounded-md text-white text-left transition-colors">
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-twitch-gray-light" />
                  <span>Stream Settings</span>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-twitch-dark-light rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-white">+15 new followers</span>
                <span className="text-twitch-gray-light">2h ago</span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-white">Peak viewers: {Math.max(stats.peakViewers, viewerCount).toLocaleString()}</span>
                <span className="text-twitch-gray-light">4h ago</span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-white">Stream ended</span>
                <span className="text-twitch-gray-light">6h ago</span>
              </div>
            </div>
          </div>

          {/* Stream Health */}
          <div className="bg-twitch-dark-light rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Stream Health</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-twitch-gray-light">Video Quality</span>
                <span className="text-green-500 font-medium">Excellent</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-twitch-gray-light">Audio Quality</span>
                <span className="text-green-500 font-medium">Good</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-twitch-gray-light">Connection</span>
                <span className="text-green-500 font-medium">
                  {isLive ? 'Live' : 'Stable'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Stream Modal */}
      <LiveStreamModal
        isOpen={showLiveModal}
        onClose={() => setShowLiveModal(false)}
        streamData={currentStream}
        onStreamStart={(newRoomId) => {
          setRoomId(newRoomId);
          setIsLive(true);
          setShowLiveModal(false);
        }}
      />
    </div>
  );
};

export default StreamerDashboardEnhanced;
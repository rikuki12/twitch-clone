import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import webrtcService from '../services/webrtc-service';
import { 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  Eye,
  Users,
  ArrowLeft,
  AlertCircle,
  Play,
  MessageCircle
} from 'lucide-react';

const LiveStreamViewer = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (roomId) {
      joinStream();
    }

    return () => {
      if (webrtcService.isCurrentlyViewing()) {
        webrtcService.stopStream();
      }
    };
  }, [roomId]);

  useEffect(() => {
    // Set up stream update callback
    webrtcService.setOnStreamUpdate((stream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        setIsConnected(true);
      }
    });

    // Set up viewer count updates
    webrtcService.setOnViewerCountUpdate((count) => {
      setViewerCount(count);
    });
  }, []);

  const joinStream = async () => {
    try {
      setLoading(true);
      setError('');
      
      await webrtcService.joinRoom(roomId);
      console.log('Successfully joined stream');
    } catch (error) {
      console.error('Error joining stream:', error);
      setError('Failed to join stream. The stream may have ended or the room ID is invalid.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMute = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = !remoteVideoRef.current.muted;
      setIsMuted(remoteVideoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      remoteVideoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleVideoPlay = () => {
    setIsConnected(true);
  };

  if (loading) {
    return (
      <div className="pt-16 bg-twitch-dark min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-twitch-purple mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-white mb-2">Connecting to stream...</h2>
          <p className="text-twitch-gray-light">Please wait while we connect you to the live stream</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 bg-twitch-dark min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Unable to Connect</h2>
          <p className="text-twitch-gray-light mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={joinStream}
              className="bg-twitch-purple hover:bg-twitch-purple-dark px-6 py-3 rounded-md text-white font-medium transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="block w-full bg-twitch-dark-lighter hover:bg-twitch-gray px-6 py-3 rounded-md text-white transition-colors"
            >
              <div className="flex items-center justify-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-twitch-dark min-h-screen">
      <div className="flex">
        {/* Main Video Area */}
        <div className={`flex-1 ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
          {/* Video Player */}
          <div className={`relative bg-black ${isFullscreen ? 'h-full' : 'aspect-video'}`}>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              onPlay={handleVideoPlay}
              className="w-full h-full object-cover"
            />
            
            {/* Loading Overlay */}
            {!isConnected && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-white">Waiting for stream...</p>
                </div>
              </div>
            )}

            {/* Stream Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-medium">LIVE</span>
                </div>
                
                <div className="flex items-center space-x-1 bg-black/70 px-3 py-1 rounded text-white">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{viewerCount} viewers</span>
                </div>

                <div className="bg-black/70 px-3 py-1 rounded text-white text-sm">
                  Room: {roomId}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="bg-black/70 hover:bg-black/90 p-2 rounded text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                <button className="bg-black/70 hover:bg-black/90 p-2 rounded text-white transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                
                <button
                  onClick={toggleFullscreen}
                  className="bg-black/70 hover:bg-black/90 p-2 rounded text-white transition-colors"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Back Button */}
            {!isFullscreen && (
              <div className="absolute top-4 left-4">
                <button
                  onClick={() => navigate('/')}
                  className="bg-black/70 hover:bg-black/90 flex items-center space-x-2 px-3 py-2 rounded text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              </div>
            )}
          </div>

          {/* Stream Info */}
          {!isFullscreen && (
            <div className="p-6 bg-twitch-dark-light">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Live Stream
                  </h1>
                  <div className="flex items-center space-x-4 text-twitch-gray-light">
                    <span>Room ID: {roomId}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{viewerCount} viewers</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button className="bg-twitch-purple hover:bg-twitch-purple-dark px-4 py-2 rounded-md text-white font-medium transition-colors">
                    Follow Streamer
                  </button>
                  <button className="bg-twitch-dark-lighter hover:bg-twitch-gray p-2 rounded-md text-twitch-gray-light hover:text-white transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Sidebar - you can integrate your existing chat component here */}
        {!isFullscreen && (
          <div className="w-80 bg-twitch-dark-light border-l border-twitch-gray/20 h-[calc(100vh-4rem)]">
            <div className="p-4 border-b border-twitch-gray/20">
              <h3 className="text-white font-medium">Stream Chat</h3>
              <p className="text-twitch-gray-light text-sm">Chat with other viewers</p>
            </div>
            
            <div className="flex-1 p-4">
              <div className="text-center text-twitch-gray-light">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chat integration coming soon!</p>
                <p className="text-sm">Connect your existing chat system here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveStreamViewer;
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import webrtcService from '../services/webrtc-service';
import { 
  Camera, 
  Mic, 
  MicOff, 
  VideoOff, 
  Play, 
  Square, 
  Settings, 
  Copy,
  X,
  Eye,
  Users,
  Share
} from 'lucide-react';

const LiveStreamModal = ({ isOpen, onClose, streamData }) => {
  const { user } = useAuth();
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [roomId, setRoomId] = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const localVideoRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      initializeCamera();
    }
    
    return () => {
      if (webrtcService.isCurrentlyStreaming()) {
        handleStopStream();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    // Set up viewer count updates
    webrtcService.setOnViewerCountUpdate((count) => {
      setViewerCount(count);
    });
  }, []);

  const initializeCamera = async () => {
    try {
      const stream = await webrtcService.initializeLocalMedia({
        video: true,
        audio: true
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error initializing camera:', error);
      setError('Failed to access camera and microphone. Please check your permissions.');
    }
  };

  const handleStartStream = async () => {
    try {
      setLoading(true);
      setError('');
      
      const newRoomId = await webrtcService.createRoom();
      setRoomId(newRoomId);
      setIsStreaming(true);
      
      console.log('Stream started with room ID:', newRoomId);
    } catch (error) {
      console.error('Error starting stream:', error);
      setError('Failed to start stream. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStopStream = async () => {
    try {
      setLoading(true);
      await webrtcService.stopStream();
      setIsStreaming(false);
      setRoomId('');
      setViewerCount(0);
    } catch (error) {
      console.error('Error stopping stream:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCamera = async () => {
    const videoTrack = localVideoRef.current?.srcObject?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  const toggleMicrophone = async () => {
    const audioTrack = localVideoRef.current?.srcObject?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    // Could add a toast notification here
  };

  const shareStream = () => {
    const streamUrl = `${window.location.origin}/watch/${roomId}`;
    navigator.clipboard.writeText(streamUrl);
    // Could add a toast notification here
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-twitch-dark-light rounded-lg w-full max-w-4xl mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-twitch-gray/20">
          <h2 className="text-2xl font-bold text-white">Go Live</h2>
          <button
            onClick={onClose}
            className="text-twitch-gray-light hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-md p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Video Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Preview</h3>
              
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Stream Status Overlay */}
                {isStreaming && (
                  <div className="absolute top-4 left-4 flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white text-sm font-medium">LIVE</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-black/70 px-3 py-1 rounded">
                      <Eye className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">{viewerCount}</span>
                    </div>
                  </div>
                )}

                {/* Controls Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleCamera}
                      className={`p-2 rounded-md transition-colors ${
                        isCameraOn 
                          ? 'bg-twitch-dark-lighter text-white' 
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {isCameraOn ? <Camera className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </button>
                    
                    <button
                      onClick={toggleMicrophone}
                      className={`p-2 rounded-md transition-colors ${
                        isMicOn 
                          ? 'bg-twitch-dark-lighter text-white' 
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </button>
                  </div>

                  <button className="bg-twitch-dark-lighter hover:bg-twitch-gray p-2 rounded-md text-white transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stream Settings & Controls */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Stream Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Stream Title
                    </label>
                    <input
                      type="text"
                      defaultValue={streamData?.title || `${user?.username}'s Live Stream`}
                      className="w-full bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md px-4 py-3 text-white placeholder-twitch-gray-light focus:outline-none focus:border-twitch-purple transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Category
                    </label>
                    <select
                      defaultValue={streamData?.category || 'Gaming'}
                      className="w-full bg-twitch-dark-lighter border border-twitch-gray/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-twitch-purple transition-colors"
                    >
                      <option value="Gaming">Gaming</option>
                      <option value="Music">Music</option>
                      <option value="Art">Art</option>
                      <option value="Just Chatting">Just Chatting</option>
                      <option value="Science & Technology">Science & Technology</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Stream Controls */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Controls</h3>
                
                {!isStreaming ? (
                  <button
                    onClick={handleStartStream}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2 py-3 rounded-md text-white font-medium transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>{loading ? 'Starting...' : 'Start Stream'}</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={handleStopStream}
                      disabled={loading}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 flex items-center justify-center space-x-2 py-3 rounded-md text-white font-medium transition-colors"
                    >
                      <Square className="w-5 h-5" />
                      <span>{loading ? 'Stopping...' : 'Stop Stream'}</span>
                    </button>

                    {/* Stream Info */}
                    <div className="bg-twitch-dark-lighter rounded-md p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-twitch-gray-light">Room ID:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-mono text-sm">{roomId}</span>
                          <button
                            onClick={copyRoomId}
                            className="text-twitch-purple hover:text-twitch-purple-light transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-twitch-gray-light">Viewers:</span>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-twitch-gray-light" />
                          <span className="text-white">{viewerCount}</span>
                        </div>
                      </div>

                      <button
                        onClick={shareStream}
                        className="w-full bg-twitch-purple hover:bg-twitch-purple-dark flex items-center justify-center space-x-2 py-2 rounded-md text-white font-medium transition-colors"
                      >
                        <Share className="w-4 h-4" />
                        <span>Share Stream</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Stream Tips */}
              <div className="bg-twitch-dark-lighter rounded-md p-4">
                <h4 className="text-white font-medium mb-2">💡 Quick Tips</h4>
                <ul className="text-twitch-gray-light text-sm space-y-1">
                  <li>• Make sure you have good lighting</li>
                  <li>• Test your audio before going live</li>
                  <li>• Interact with your viewers in chat</li>
                  <li>• Share your stream link to get viewers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamModal;
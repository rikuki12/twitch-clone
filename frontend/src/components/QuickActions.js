import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { 
  Play, 
  Users, 
  Search, 
  Settings, 
  Zap, 
  TrendingUp,
  Heart,
  Share2,
  Copy,
  ExternalLink
} from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, info } = useToast();
  const [showShareModal, setShowShareModal] = useState(false);

  const actions = [
    {
      icon: <Play className="w-5 h-5" />,
      label: 'Go Live',
      description: 'Start streaming now',
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => {
        if (isAuthenticated) {
          navigate('/dashboard');
          info('Ready to stream! Click "Go Live" in your dashboard 🎥');
        } else {
          info('Please login to start streaming 🔑');
        }
      }
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Discover',
      description: 'Find new streamers',
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => {
        navigate('/browse/all');
        info('Discovering amazing content for you! 🔍');
      }
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Trending',
      description: 'Popular right now',
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => {
        navigate('/browse/games');
        info('Check out what\'s trending! 🔥');
      }
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      label: 'Share',
      description: 'Invite friends',
      color: 'bg-pink-600 hover:bg-pink-700',
      onClick: () => setShowShareModal(true)
    }
  ];

  const shareOptions = [
    {
      label: 'Copy Link',
      icon: <Copy className="w-4 h-4" />,
      action: () => {
        navigator.clipboard.writeText(window.location.origin);
        success('Platform link copied! Share with friends 🎉');
        setShowShareModal(false);
      }
    },
    {
      label: 'Share Profile',
      icon: <ExternalLink className="w-4 h-4" />,
      action: () => {
        if (user) {
          navigator.clipboard.writeText(`${window.location.origin}/profile/${user.username}`);
          success('Your profile link copied! 👤');
        }
        setShowShareModal(false);
      }
    }
  ];

  return (
    <>
      {/* Quick Actions Floating Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-twitch-dark-light/90 backdrop-blur-md border border-twitch-gray/20 rounded-full px-6 py-3 shadow-2xl">
          <div className="flex items-center space-x-4">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`${action.color} text-white p-3 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg group relative`}
                title={action.description}
              >
                {action.icon}
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black text-white text-xs rounded-md px-2 py-1 whitespace-nowrap">
                    {action.label}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-twitch-dark-light rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Share the Experience</h3>
              <p className="text-twitch-gray-light">Invite friends to join this amazing platform!</p>
            </div>

            <div className="space-y-3">
              {shareOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={option.action}
                  className="w-full flex items-center space-x-3 p-3 bg-twitch-dark-lighter hover:bg-twitch-gray rounded-lg transition-colors"
                >
                  {option.icon}
                  <span className="text-white">{option.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 py-2 text-twitch-gray-light hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActions;
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { Camera, Users, Play, CheckCircle, ArrowRight, X } from 'lucide-react';

const UserOnboarding = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { success } = useToast();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: '🎉 Welcome to Twitch Clone!',
      subtitle: `Hey ${user?.username || 'there'}! Let's get you started`,
      content: (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
            <span className="text-3xl">🚀</span>
          </div>
          <p className="text-twitch-gray-light">
            You're about to explore the most advanced streaming platform ever built! 
            Let's show you around in just 30 seconds.
          </p>
        </div>
      )
    },
    {
      title: '📺 Start Streaming in Seconds',
      subtitle: 'No complex setup required!',
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-twitch-dark-lighter rounded-lg">
            <Camera className="w-8 h-8 text-green-500" />
            <div>
              <h4 className="text-white font-medium">Go Live Instantly</h4>
              <p className="text-twitch-gray-light text-sm">Click "Go Live" in your dashboard to start streaming with your camera and mic</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-twitch-dark-lighter rounded-lg">
            <Play className="w-8 h-8 text-red-500" />
            <div>
              <h4 className="text-white font-medium">Share Your Stream</h4>
              <p className="text-twitch-gray-light text-sm">Get a Room ID and share it with friends - no sign-up required for viewers!</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '👥 Build Your Community',
      subtitle: 'Connect with other streamers and viewers',
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-twitch-dark-lighter rounded-lg">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <h4 className="text-white font-medium">Follow & Discover</h4>
              <p className="text-twitch-gray-light text-sm">Follow your favorite streamers and discover new content across categories</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-twitch-dark-lighter rounded-lg">
            <CheckCircle className="w-8 h-8 text-twitch-purple" />
            <div>
              <h4 className="text-white font-medium">Real-time Chat</h4>
              <p className="text-twitch-gray-light text-sm">Engage with streamers and other viewers through live chat</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '🎮 You\'re Ready to Rock!',
      subtitle: 'Time to explore your new streaming platform',
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mx-auto flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-2">
            <p className="text-white font-medium">🔥 Your account is set up!</p>
            <p className="text-twitch-gray-light">Ready to stream, chat, and discover amazing content</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-twitch-dark-lighter p-3 rounded-lg">
              <p className="text-twitch-purple font-medium">Dashboard</p>
              <p className="text-twitch-gray-light">Manage your streams</p>
            </div>
            <div className="bg-twitch-dark-lighter p-3 rounded-lg">
              <p className="text-green-500 font-medium">Go Live</p>
              <p className="text-twitch-gray-light">Start streaming now</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      success('Welcome aboard! 🎉 Ready to start streaming!');
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-twitch-dark-light rounded-xl max-w-2xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-twitch-purple to-purple-600 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{steps[currentStep].title}</h2>
            <p className="text-purple-100">{steps[currentStep].subtitle}</p>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-purple-200 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-purple-800/30 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {steps[currentStep].content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 bg-twitch-dark-lighter">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-4 py-2 text-twitch-gray-light hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-twitch-purple' : 'bg-twitch-gray'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextStep}
            className="bg-twitch-purple hover:bg-twitch-purple-dark px-6 py-2 rounded-md text-white font-medium transition-colors flex items-center space-x-2"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserOnboarding;
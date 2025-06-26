import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'purple' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-8 h-8';
      case 'xl':
        return 'w-12 h-12';
      default:
        return 'w-6 h-6';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'white':
        return 'border-white/20 border-t-white';
      case 'green':
        return 'border-green-200/20 border-t-green-500';
      case 'red':
        return 'border-red-200/20 border-t-red-500';
      default:
        return 'border-twitch-purple/20 border-t-twitch-purple';
    }
  };

  return (
    <div className={`animate-spin rounded-full border-2 ${getSizeClasses()} ${getColorClasses()}`} />
  );
};

export const FullPageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-twitch-dark/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="text-white mt-4 text-lg">{message}</p>
      </div>
    </div>
  );
};

export const ButtonLoader = ({ size = 'sm' }) => {
  return <LoadingSpinner size={size} color="white" />;
};

export default LoadingSpinner;

import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
      <span className="ml-3 text-gray-400">AI đang phân tích...</span>
    </div>
  );
};

export default LoadingSpinner;

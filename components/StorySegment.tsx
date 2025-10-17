import React from 'react';
import type { StoryPart } from '../types';

// Star SVG for the AI icon
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-400">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006Z" clipRule="evenodd" />
  </svg>
);


const StorySegment: React.FC<StoryPart> = ({ type, text }) => {
  if (type === 'ai') {
    return (
      <div className="mb-6 animate-fade-in">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 border border-red-700/50 flex items-center justify-center">
             <StarIcon />
          </div>
          <div className="flex-1 bg-gray-800/60 p-4 rounded-lg border-l-4 border-red-600">
            <p className="whitespace-pre-wrap font-serif leading-relaxed text-gray-300">{text}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-start justify-end space-x-4">
        <div className="flex-1 bg-gray-700/50 p-3 rounded-lg border-r-4 border-blue-500">
          <p className="whitespace-pre-wrap text-right italic text-blue-200">{text}</p>
        </div>
         <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 border border-blue-700/50 flex items-center justify-center font-bold text-blue-300 text-sm">Bạn</div>
      </div>
    </div>
  );
};

export default StorySegment;
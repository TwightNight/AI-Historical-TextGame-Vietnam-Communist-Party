import React from 'react';

interface ChoiceButtonProps {
  text: string;
  onClick: () => void;
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left p-4 bg-gray-800/50 border-2 border-gray-700 hover:border-red-500/70 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 flex items-center space-x-4 transform hover:scale-[1.02]"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 group-hover:bg-red-600 flex items-center justify-center transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 group-hover:text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
      </div>
      <p className="flex-1 text-gray-200 group-hover:text-white transition-colors duration-200">{text}</p>
    </button>
  );
};

export default ChoiceButton;
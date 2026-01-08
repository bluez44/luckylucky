import React from "react";

interface WelcomeModalProps {
  onEnter: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center pointer-events-auto">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="text-6xl mb-6">🧧</div>
        <h1 className="text-4xl font-bold text-red-700 mb-4">
          Chúc Mừng Năm Mới!
        </h1>
        <p className="text-gray-700 text-lg mb-2">Happy Lunar New Year!</p>
        <p className="text-gray-600 mb-8">Bóc lì xì đi!</p>
        <button
          onClick={onEnter}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 w-full cursor-pointer"
        >
          Zô luôn
        </button>
      </div>
    </div>
  );
};

import React from "react";

interface WelcomeModalProps {
  onEnter: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 bg-theme-modal-overlay z-50 flex items-center justify-center pointer-events-auto">
      <div className="bg-theme-card-bg rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="text-6xl mb-6">🏮</div>
        <h1 className="text-4xl font-bold text-theme-text-primary mb-4">
          Chúc Mừng Năm Mới!
        </h1>
        <p className="text-theme-text-secondary text-lg mb-2">
          Happy Lunar New Year!
        </p>
        <p className="text-theme-text-body mb-8">Bóc lì xì đi!</p>
        <button
          onClick={onEnter}
          className="bg-theme-btn-primary hover:bg-theme-btn-primary-hover text-white font-bold py-3 px-8 rounded-lg transition duration-200 w-full cursor-pointer"
        >
          Zô luôn
        </button>
      </div>
    </div>
  );
};

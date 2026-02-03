import React, { useState, useEffect } from "react";

export const LoadingModal: React.FC = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-theme-modal-overlay backdrop-blur-sm">
      <div className="bg-theme-card-bg rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-4 border-theme-accent">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-block animate-spin text-7xl">🏮</div>
          </div>
          <h2 className="text-3xl font-bold text-theme-text-dark mb-2">
            Đang tạo câu hỏi{dots}
          </h2>
          <p className="text-theme-text-body mb-6 text-lg">
            Đừng rung cây nhát khỉ nha! 🐒🔥
          </p>

          {/* Animated loading bar */}
          <div className="w-full bg-theme-input-border rounded-full h-3 overflow-hidden mb-4">
            <div
              className="bg-linear-to-r from-theme-envelope via-theme-accent to-theme-celebration-orange h-full animate-pulse"
              style={{
                backgroundSize: "200% 100%",
                animation: "shimmer 2s infinite",
              }}
            ></div>
          </div>

          {/* Bouncing dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-theme-envelope rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-theme-celebration-orange rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-theme-accent-dark rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
      `}</style>
    </div>
  );
};

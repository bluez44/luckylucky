import React from "react";

export const LoadingModal: React.FC = () => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-linear-to-br from-red-50 to-orange-50 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-4 border-yellow-400">
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-block animate-spin text-6xl">🧧</div>
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">
            Đang tạo câu hỏi...
          </h2>
          <p className="text-gray-600">Đừng rung cây nhát khỉ nha! 🐒🔥</p>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

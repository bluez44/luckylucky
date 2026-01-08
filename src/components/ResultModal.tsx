import React, { useEffect } from "react";
import confetti from "canvas-confetti";

interface ResultModalProps {
  amount: number;
  onClose: () => void;
}

export function ResultModal({ amount, onClose }: ResultModalProps) {
  useEffect(() => {
    // Trigger confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#FFD700", "#FFA500", "#FF6347", "#FF1493"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#FFD700", "#FFA500", "#FF6347", "#FF1493"],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const quote = getRandomQuote(amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-linear-to-br from-red-600 to-red-700 rounded-3xl shadow-2xl max-w-lg w-full p-8 md:p-12 border-8 border-yellow-500 animate-scale-in">
        {/* Greeting */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-playfair text-yellow-400 mb-2">
            🎊 Happy New Year! 🎊
          </h2>
          <p className="text-xl text-yellow-200 font-montserrat">
            Chúc Mừng Năm Mới!
          </p>
        </div>

        {/* Amount Display */}
        <div className="bg-white/95 rounded-2xl p-8 mb-6 text-center shadow-inner">
          <p className="text-lg md:text-xl text-red-700 font-montserrat mb-2">
            Tài khoản đã 'nổ':
          </p>
          <p className="text-5xl md:text-7xl font-playfair text-transparent bg-clip-text bg-linear-to-r from-yellow-500 to-yellow-600 mb-2">
            {formatCurrency(amount)}
          </p>
          <p className="text-2xl md:text-3xl font-montserrat text-red-700">
            VNĐ
          </p>
        </div>

        {/* Quote */}
        <div className="bg-yellow-400 rounded-xl p-4 mb-6 text-center">
          <p className="text-lg md:text-xl font-montserrat text-red-800">
            {quote.emoji} {quote.text}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-white hover:bg-yellow-100 text-red-700 font-montserrat text-xl py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-200 border-2 border-yellow-500 cursor-pointer"
        >
          Bóc tiếp
        </button>
      </div>
    </div>
  );
}

function formatCurrency(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getRandomQuote(amount: number): { text: string; emoji: string } {
  const quotes = {
    big: [
      { text: "Jackpot! Đại gia đây rồi!", emoji: "🎰" },
      { text: "Nhân phẩm đỉnh cao! Vía giàu sang đã tới!", emoji: "🔥" },
      {
        text: "Đỉnh nóc kịch trần!",
        emoji: "💎",
      },
      { text: "Tổ độ bạn rồi!", emoji: "✨" },
    ],
    medium: [
      { text: "Húp nhẹ cái lộc! Cũng ra gì và này nọ đấy!", emoji: "👍" },
      { text: "Vibe này là thấy giàu sang phú quý rồi!", emoji: "🌟" },
      { text: 'Không nhiều nhưng đủ để "vào việc" luôn!', emoji: "💸" },
      { text: "Nhân phẩm tốt! Sang năm làm ăn phát đạt nha!", emoji: "🍬" },
    ],
    small: [
      {
        text: "Của ít lòng nhiều, tích tiểu thành đại!",
        emoji: "🌸",
      },
      { text: 'Nhân phẩm hơi "hẻo"!', emoji: "🙏" },
      { text: "Đừng buồn nha sếp!", emoji: "❤️" },
      {
        text: "Vạn sự khởi đầu nan, ván sau gỡ gạc lại nhân phẩm!",
        emoji: "🌱",
      },
    ],
  };

  let category: "big" | "medium" | "small";

  if (amount >= 100000) {
    category = "big";
  } else if (amount >= 30000) {
    category = "medium";
  } else {
    category = "small";
  }

  const categoryQuotes = quotes[category];
  return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
}

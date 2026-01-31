import React from "react";
import { GameStats, getLeaderboard } from "../utils/achievements";

interface GameStatsScreenProps {
  stats: GameStats;
  onPlayAgain: () => void;
}

export function GameStatsScreen({ stats, onPlayAgain }: GameStatsScreenProps) {
  const leaderboard = getLeaderboard();
  const accuracyRate =
    stats.totalChallenges > 0
      ? Math.round((stats.correctAnswers / stats.totalChallenges) * 100)
      : 0;

  const handleShare = () => {
    const text = `🎉 I won ${formatCurrency(stats.totalWon)} VNĐ in Tết Lucky Money Game! 🧧
📊 Accuracy: ${accuracyRate}%
🔥 Longest Streak: ${stats.longestStreak}
🏆 Check the leaderboard!`;

    if (navigator.share) {
      navigator.share({
        title: "Tết Lucky Money",
        text: text,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      alert("Results copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4">
      <div className="bg-linear-to-br from-red-600 to-red-700 rounded-3xl shadow-2xl max-w-3xl w-full p-8 md:p-12 border-8 border-yellow-500 my-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-playfair text-yellow-400 mb-4">
            🎊 Kết Quả Ván Chơi 🎊
          </h2>
        </div>

        {/* Total Won */}
        <div className="bg-white/95 rounded-2xl p-8 mb-6 text-center shadow-inner">
          <p className="text-lg md:text-xl text-red-700 font-montserrat mb-2">
            Tổng tiền thắng được:
          </p>
          <p className="text-5xl md:text-7xl font-playfair text-transparent bg-clip-text bg-linear-to-r from-yellow-500 to-yellow-600">
            {formatCurrency(stats.totalWon)}
          </p>
          <p className="text-2xl md:text-3xl font-montserrat text-red-700 mt-2">
            VNĐ
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-yellow-400 rounded-xl p-4 text-center">
            <p className="text-sm text-red-800 font-montserrat mb-2">
              Độ chính xác
            </p>
            <p className="text-3xl font-bold text-red-800">{accuracyRate}%</p>
          </div>
          <div className="bg-yellow-400 rounded-xl p-4 text-center">
            <p className="text-sm text-red-800 font-montserrat mb-2">
              Streak Dài Nhất
            </p>
            <p className="text-3xl font-bold text-red-800">
              {stats.longestStreak}
            </p>
          </div>
          <div className="bg-yellow-400 rounded-xl p-4 text-center">
            <p className="text-sm text-red-800 font-montserrat mb-2">Câu Hỏi</p>
            <p className="text-3xl font-bold text-red-800">
              {stats.correctAnswers}/{stats.totalChallenges}
            </p>
          </div>
        </div>

        {/* Best/Worst Envelopes */}
        {(stats.bestEnvelope || stats.worstEnvelope) && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {stats.bestEnvelope && (
              <div className="bg-green-100 rounded-xl p-4 border-2 border-green-500">
                <p className="text-sm text-green-800 font-montserrat mb-2">
                  🏆 Bao Cao Nhất
                </p>
                <p className="text-2xl font-bold text-green-800">
                  {formatCurrency(stats.bestEnvelope.amount)} VNĐ
                </p>
              </div>
            )}
            {stats.worstEnvelope && (
              <div className="bg-orange-100 rounded-xl p-4 border-2 border-orange-500">
                <p className="text-sm text-orange-800 font-montserrat mb-2">
                  😅 Bao Thấp Nhất
                </p>
                <p className="text-2xl font-bold text-orange-800">
                  {formatCurrency(stats.worstEnvelope.amount)} VNĐ
                </p>
              </div>
            )}
          </div>
        )}

        {/* Achievements */}
        {stats.achievements.length > 0 && (
          <div className="bg-yellow-400/30 rounded-xl p-4 mb-6 border-2 border-yellow-400">
            <p className="text-lg font-bold text-yellow-200 mb-3 text-center">
              🏅 Thành Tựu
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {stats.achievements
                .filter((a) => a.earned)
                .map((achievement) => (
                  <div
                    key={achievement.id}
                    className="bg-white/20 rounded-lg p-3 text-center"
                  >
                    <p className="text-3xl mb-1">{achievement.emoji}</p>
                    <p className="text-sm font-montserrat text-yellow-100">
                      {achievement.name}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="bg-white/10 rounded-xl p-4 mb-6 border-2 border-yellow-300">
            <p className="text-lg font-bold text-yellow-300 mb-3 text-center">
              🏆 Bảng Xếp Hạng Top 5
            </p>
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded ${
                    entry.timestamp === stats.timestamp
                      ? "bg-yellow-400 text-red-800"
                      : "bg-white/10 text-yellow-100"
                  }`}
                >
                  <span className="font-bold">#{idx + 1}</span>
                  <span className="font-montserrat">
                    {formatCurrency(entry.totalWon)} VNĐ
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <button
            onClick={handleShare}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-montserrat font-bold py-3 px-6 rounded-xl transition duration-200 border-2 border-blue-400"
          >
            📱 Chia Sẻ Kết Quả
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 bg-white hover:bg-yellow-100 text-red-700 font-montserrat font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition duration-200 border-2 border-yellow-500"
          >
            🎮 Chơi Lại
          </button>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

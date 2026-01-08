import React, { useState } from "react";
import { GameMode } from "../App";

interface SetupScreenProps {
  onCreateEnvelopes: (
    totalFund: number,
    numberOfPackets: number,
    gameMode: GameMode
  ) => void;
}

export function SetupScreen({ onCreateEnvelopes }: SetupScreenProps) {
  const [totalFund, setTotalFund] = useState("500.000");
  const [numberOfPackets, setNumberOfPackets] = useState("5");
  const [gameMode, setGameMode] = useState<GameMode>("normal");
  const [error, setError] = useState("");

  const formatCurrency = (value: string): string => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";

    // Format with dots every 3 digits
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleTotalFundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setTotalFund(formatted);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fundAmount = parseInt(totalFund.replace(/\./g, ""));
    const packets = parseInt(numberOfPackets);

    if (!fundAmount || fundAmount <= 0) {
      setError("Ủa alo? Nhập 'thóc' tử tế đi nào bạn ơi! 💸");
      return;
    }

    if (!packets || packets <= 0) {
      setError("Tính phát cho không khí à?");
      return;
    }

    if (packets <= 0) {
      setError("Số người phải lớn hơn 0 chứ!");
      return;
    }

    if (packets < 2) {
      setError("Ít nhất phải có 2 người chơi chứ!");
      return;
    }

    if (packets > 100) {
      setError("Chia vừa thôi không 'loạn' đấy (max 100 người)!");
      return;
    }

    if (fundAmount < packets * 10000) {
      setError("Lộc này 'mỏng' quá (ít nhất mỗi người phải được 10k)!");
      return;
    }

    onCreateEnvelopes(fundAmount, packets, gameMode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-playfair text-yellow-400 mb-4 drop-shadow-lg font-bold">
            🧧 Lì Xì Tết 🧧
          </h1>
        </div>

        {/* Setup Form */}
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-yellow-500">
          <h2 className="text-3xl font-playfair text-red-700 mb-6 text-center">
            Set kèo phát lì xì
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Total Fund */}
            <div>
              <label className="block text-lg font-montserrat text-gray-700 mb-2">
                Ngân sách 'vào việc' (VNĐ) 💰
              </label>
              <input
                type="text"
                value={totalFund}
                onChange={handleTotalFundChange}
                placeholder="500.000"
                className="w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition font-montserrat"
              />
            </div>

            {/* Number of Packets */}
            <div>
              <label className="block text-lg font-montserrat text-gray-700 mb-2">
                Số người 'may mắn' (Hy vọng thế) 🤔
              </label>
              <input
                type="number"
                value={numberOfPackets}
                onChange={(e) => {
                  setNumberOfPackets(e.target.value);
                  setError("");
                }}
                placeholder="10"
                className="w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition font-montserrat"
              />
            </div>

            {/* Game Mode */}
            <div>
              <label className="block text-lg font-montserrat text-gray-700 mb-3">
                Luật chơi 'hệ' gì? ✨
              </label>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="distribution"
                    value="random"
                    checked={gameMode === "normal"}
                    onChange={() => setGameMode("normal")}
                    className="w-5 h-5 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-3 text-lg font-montserrat text-gray-700 group-hover:text-red-600 transition">
                    Hệ chill - Chơi nhờ nhân phẩm! 🎲
                  </span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="distribution"
                    value="equal"
                    checked={gameMode === "challenge"}
                    onChange={() => setGameMode("challenge")}
                    className="w-5 h-5 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-3 text-lg font-montserrat text-gray-700 group-hover:text-red-600 transition">
                    Hệ tri thức - Vượt ải nhận lộc 📚
                  </span>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg font-montserrat">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-red-900 text-2xl font-playfair py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-200 border-2 border-yellow-700 cursor-pointer"
            >
              🔥 Vào việc luôn! 🔥
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-yellow-200 mt-6 font-montserrat">
          Chúc Mừng Năm Mới - Happy New Year! 🌸
        </p>
      </div>
    </div>
  );
}

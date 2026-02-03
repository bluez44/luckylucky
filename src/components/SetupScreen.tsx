import React, { useState } from "react";
import { GameMode } from "../App";

interface SetupScreenProps {
  onCreateEnvelopes: (
    totalFund: number,
    numberOfPackets: number,
    gameMode: GameMode,
    minValue: number,
    maxValue: number,
  ) => void;
}

export function SetupScreen({ onCreateEnvelopes }: SetupScreenProps) {
  const [totalFund, setTotalFund] = useState("500.000");
  const [numberOfPackets, setNumberOfPackets] = useState("5");
  const [gameMode, setGameMode] = useState<GameMode>("normal");
  const [minValue, setMinValue] = useState("50.000");
  const [maxValue, setMaxValue] = useState("200.000");
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
    const min = parseInt(minValue.replace(/\./g, ""));
    const max = parseInt(maxValue.replace(/\./g, ""));

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

    if (!min || min <= 0) {
      setError("Giá trị tối thiểu phải lớn hơn 0!");
      return;
    }

    if (!max || max <= 0) {
      setError("Giá trị tối đa phải lớn hơn 0!");
      return;
    }

    if (min >= max) {
      setError("Giá trị tối thiểu phải nhỏ hơn giá trị tối đa!");
      return;
    }

    if (fundAmount < packets * min) {
      setError(
        `Tổng tiền không đủ! Cần ít nhất ${
          packets * min
        } VNĐ (${packets} x ${min})`,
      );
      return;
    }

    if (fundAmount > packets * max) {
      setError(
        `Tổng tiền quá nhiều! Tối đa chỉ được ${
          packets * max
        } VNĐ (${packets} x ${max})`,
      );
      return;
    }

    onCreateEnvelopes(fundAmount, packets, gameMode, min, max);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-playfair text-theme-accent mb-4 drop-shadow-lg font-bold">
            Lì Lì Xì Xì
          </h1>
        </div>

        {/* Setup Form */}
        <div className="bg-theme-modal-bg backdrop-blur rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-theme-border-accent">
          <h2 className="text-3xl font-playfair text-theme-text-primary mb-6 text-center">
            Set kèo phát lì xì
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Total Fund */}
            <div>
              <label className="block text-lg font-montserrat text-theme-text-secondary mb-2">
                Ngân sách 'vào việc' (VNĐ) 💰
              </label>
              <input
                type="text"
                value={totalFund}
                onChange={handleTotalFundChange}
                placeholder="500.000"
                className="w-full px-4 py-3 text-xl border-2 border-theme-input-border bg-theme-input-bg text-theme-input-text rounded-lg focus:border-theme-envelope focus:ring-2 focus:ring-theme-error-light outline-none transition font-montserrat"
              />
            </div>

            {/* Number of Packets */}
            <div>
              <label className="block text-lg font-montserrat text-theme-text-secondary mb-2">
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
                className="w-full px-4 py-3 text-xl border-2 border-theme-input-border bg-theme-input-bg text-theme-input-text rounded-lg focus:border-theme-envelope focus:ring-2 focus:ring-theme-error-light outline-none transition font-montserrat"
              />
            </div>

            {/* Min Value */}
            <div>
              <label className="block text-lg font-montserrat text-theme-text-secondary mb-2">
                Giá trị tối thiểu (VNĐ) 📉
              </label>
              <input
                type="text"
                value={minValue}
                onChange={(e) => {
                  const formatted = formatCurrency(e.target.value);
                  setMinValue(formatted);
                  setError("");
                }}
                placeholder="50.000"
                className="w-full px-4 py-3 text-xl border-2 border-theme-input-border bg-theme-input-bg text-theme-input-text rounded-lg focus:border-theme-envelope focus:ring-2 focus:ring-theme-error-light outline-none transition font-montserrat"
              />
            </div>

            {/* Max Value */}
            <div>
              <label className="block text-lg font-montserrat text-theme-text-secondary mb-2">
                Giá trị tối đa (VNĐ) 📈
              </label>
              <input
                type="text"
                value={maxValue}
                onChange={(e) => {
                  const formatted = formatCurrency(e.target.value);
                  setMaxValue(formatted);
                  setError("");
                }}
                placeholder="200.000"
                className="w-full px-4 py-3 text-xl border-2 border-theme-input-border bg-theme-input-bg text-theme-input-text rounded-lg focus:border-theme-envelope focus:ring-2 focus:ring-theme-error-light outline-none transition font-montserrat"
              />
            </div>

            {/* Game Mode */}
            <div>
              <label className="block text-lg font-montserrat text-theme-text-secondary mb-3">
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
                    className="w-5 h-5 text-theme-envelope focus:ring-theme-envelope"
                  />
                  <span className="ml-3 text-lg font-montserrat text-theme-text-secondary group-hover:text-theme-envelope transition">
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
                    className="w-5 h-5 text-theme-envelope focus:ring-theme-envelope"
                  />
                  <span className="ml-3 text-lg font-montserrat text-theme-text-secondary group-hover:text-theme-envelope transition">
                    Hệ tri thức - Vượt ải nhận lộc 📚
                  </span>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-theme-error-light border-2 border-theme-error text-theme-text-primary px-4 py-3 rounded-lg font-montserrat">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-linear-to-r from-theme-accent-dark to-theme-accent-darker hover:from-theme-accent-darker hover:to-theme-accent-darker text-theme-text-dark text-2xl font-playfair py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-200 border-2 border-theme-accent-darker cursor-pointer"
            >
              🔥 Vào việc luôn! 🔥
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-theme-accent-light mt-6 font-montserrat">
          Bóc Lì Xì Đê{" "}
        </p>
      </div>
    </div>
  );
}

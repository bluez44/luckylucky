import React from "react";
import { GameState } from "../App";
import { Envelope } from "./Envelope";

interface EnvelopeGridProps {
  gameState: GameState;
  onEnvelopeClick: (index: number) => void;
  onReset: () => void;
}

export function EnvelopeGrid({
  gameState,
  onEnvelopeClick,
  onReset,
}: EnvelopeGridProps) {
  const allOpened =
    gameState.openedEnvelopes.size === gameState.numberOfPackets;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-playfair text-yellow-400 mb-4 drop-shadow-lg">
            Bao Nào 'Thơm' Nhất Thì Pick Nhé! 🧧
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-yellow-200 font-montserrat text-lg">
            <span>
              Quỹ lộc hiện có: {formatCurrency(gameState.totalFund)} VNĐ
            </span>
            <span className="hidden md:inline">•</span>
            <span>
              Đã 'bay màu': {gameState.openedEnvelopes.size} /{" "}
              {gameState.numberOfPackets}
            </span>
          </div>
        </div>

        {/* Envelope Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
          {gameState.amounts.map((amount, index) => (
            <Envelope
              key={index}
              index={index}
              amount={amount}
              isOpened={gameState.openedEnvelopes.has(index)}
              onClick={() => onEnvelopeClick(index)}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="text-center flex flex-col gap-2 items-center">
          {allOpened && (
            <div className="mb-6 bg-yellow-400 text-red-800 px-6 py-4 rounded-xl inline-block font-playfair text-2xl shadow-lg">
              Đã sạch túi! 🔥
            </div>
          )}
          <button
            onClick={onReset}
            className="bg-white hover:bg-gray-100 text-red-700 font-montserrat text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-200 border-2 border-yellow-500 cursor-pointer"
          >
            Làm ván mới!
          </button>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface EnvelopeProps {
  index: number;
  isOpened: boolean;
  amount: number;
  onClick: () => void;
  showValue?: boolean;
  totalFund?: number;
}

export function Envelope({
  index,
  isOpened,
  amount,
  onClick,
  showValue = false,
  totalFund = 0,
}: EnvelopeProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    onClick();
  };

  // Get difficulty level
  const getDifficultyStars = (amt: number): string => {
    if (totalFund === 0) return "";
    const percentage = (amt / totalFund) * 100;
    if (percentage < 15) return "⭐";
    if (percentage < 30) return "⭐⭐";
    return "⭐⭐⭐";
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={isOpened}
      className={`
        relative aspect-3/4 w-full rounded-lg transition-all duration-300
        ${
          isOpened
            ? "opacity-40 cursor-not-allowed scale-95 bg-gray-400"
            : "cursor-pointer hover:scale-110 hover:rotate-2 hover:shadow-2xl animate-envelope-shake-on-hover bg-linear-to-b from-red-600 to-red-700"
        }
        border-4 shadow-xl
        ${isOpened ? "border-gray-500" : "border-yellow-500"}
      `}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d" as any,
      }}
    >
      {/* Envelope decoration */}
      <div
        ref={innerRef}
        className="absolute inset-0 flex flex-col items-center justify-center p-2"
      >
        {/* Top flap */}
        <div
          className={`absolute top-0 left-0 right-0 h-1/4 ${
            isOpened ? "bg-gray-500" : "bg-red-800"
          } rounded-t-lg`}
          style={{
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          }}
        ></div>

        {/* Center decoration */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          {!isOpened && !showValue && (
            <>
              {/* Ornament */}
              <div className="text-3xl md:text-5xl mb-2">🧧</div>
              {/* Number */}
              <div className="font-playfair text-yellow-400 text-xl md:text-2xl">
                {index + 1}
              </div>
            </>
          )}
          {!isOpened && showValue && (
            <div className="flex flex-col items-center gap-2">
              {/* Ornament */}
              <div className="text-3xl md:text-5xl mb-2">🧧</div>
              {/* Amount */}
              <div className="font-playfair text-yellow-400 text-sm md:text-base font-bold text-center wrap-break-word px-1">
                {formatCurrency(amount)} VNĐ
              </div>
              {/* Difficulty Stars */}
              {totalFund > 0 && (
                <div className="text-lg mt-2">{getDifficultyStars(amount)}</div>
              )}
            </div>
          )}
          {isOpened && (
            <div className="flex flex-col items-center gap-2">
              <div className="text-2xl md:text-4xl">✓</div>
              <div className="font-playfair text-yellow-400 text-lg md:text-xl font-bold text-center wrap-break-word px-1">
                {formatCurrency(amount)} VNĐ
              </div>
            </div>
          )}
        </div>

        {/* Gold border pattern */}
        {!isOpened && (
          <>
            <div className="absolute top-2 left-2 right-2 h-1 bg-yellow-400 opacity-50 rounded"></div>
            <div className="absolute bottom-2 left-2 right-2 h-1 bg-yellow-400 opacity-50 rounded"></div>
            <div className="absolute top-2 bottom-2 left-2 w-1 bg-yellow-400 opacity-50 rounded"></div>
            <div className="absolute top-2 bottom-2 right-2 w-1 bg-yellow-400 opacity-50 rounded"></div>
          </>
        )}
      </div>
    </button>
  );
}

function formatCurrency(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

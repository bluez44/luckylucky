import React from "react";

interface EnvelopeProps {
  index: number;
  isOpened: boolean;
  onClick: () => void;
}

export function Envelope({ index, isOpened, onClick }: EnvelopeProps) {
  return (
    <button
      onClick={onClick}
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
    >
      {/* Envelope decoration */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
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
          {!isOpened && (
            <>
              {/* Ornament */}
              <div className="text-3xl md:text-5xl mb-2">🧧</div>
              {/* Number */}
              <div className="font-playfair text-yellow-400 text-xl md:text-2xl">
                {index + 1}
              </div>
            </>
          )}
          {isOpened && <div className="text-2xl md:text-4xl">✓</div>}
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

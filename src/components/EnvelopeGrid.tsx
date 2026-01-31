import React, { useEffect, useRef } from "react";
import { GameState } from "../App";
import { Envelope } from "./Envelope";
import gsap from "gsap";

interface EnvelopeGridProps {
  gameState: GameState;
  onEnvelopeClick: (index: number) => void;
  onReset: () => void;
  onStartGame: () => void;
  wrongEnvelopeIndex?: number;
}

export function EnvelopeGrid({
  gameState,
  onEnvelopeClick,
  onReset,
  onStartGame,
  wrongEnvelopeIndex,
}: EnvelopeGridProps) {
  const allOpened =
    gameState.openedEnvelopes.size === gameState.numberOfPackets;
  const envelopeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const startButtonRef = useRef<HTMLButtonElement | null>(null);
  const hasAnimated = useRef(false);

  // Apply shake animation to wrong envelope
  useEffect(() => {
    if (
      wrongEnvelopeIndex !== undefined &&
      envelopeRefs.current[wrongEnvelopeIndex]
    ) {
      const el = envelopeRefs.current[wrongEnvelopeIndex];
      el?.classList.add("animate-shake");
      setTimeout(() => {
        el?.classList.remove("animate-shake");
      }, 500);
    }
  }, [wrongEnvelopeIndex]);

  // Reusable animation function
  const animateEnvelopes = () => {
    envelopeRefs.current.forEach((envelopeEl, index) => {
      if (!envelopeEl) return;

      // Random starting position from the sides
      const sides = ["top", "bottom", "left", "right"];
      const side = sides[Math.floor(Math.random() * sides.length)];

      let startX = 0;
      let startY = 0;

      switch (side) {
        case "top":
          startX = Math.random() * window.innerWidth;
          startY = -200;
          break;
        case "bottom":
          startX = Math.random() * window.innerWidth;
          startY = window.innerHeight + 200;
          break;
        case "left":
          startX = -200;
          startY = Math.random() * window.innerHeight;
          break;
        case "right":
          startX = window.innerWidth + 200;
          startY = Math.random() * window.innerHeight;
          break;
      }

      // Set initial position
      gsap.set(envelopeEl, {
        x: startX - envelopeEl.offsetLeft,
        y: startY - envelopeEl.offsetTop,
        opacity: 0,
        rotation: Math.random() * 360,
        scale: 0.3,
      });

      // Animate to final position with random trajectory
      const midX = (Math.random() - 0.5) * 400;
      const midY = (Math.random() - 0.5) * 400;

      gsap.to(envelopeEl, {
        x: 0,
        y: 0,
        opacity: 1,
        rotation: 0,
        scale: 1,
        duration: 1.2 + Math.random() * 0.8,
        delay: index * 0.08,
        ease: "back.out(1.2)",
        bezier: {
          values: [
            {
              x: startX - envelopeEl.offsetLeft,
              y: startY - envelopeEl.offsetTop,
            },
            { x: midX, y: midY },
            { x: 0, y: 0 },
          ],
          type: "soft",
        },
      });
    });
  };

  // Fly-in animation when envelopes are first created
  useEffect(() => {
    if (!hasAnimated.current && envelopeRefs.current.length > 0) {
      hasAnimated.current = true;
      animateEnvelopes();

      // Animate start button after envelopes
      if (startButtonRef.current && !gameState.gameStarted) {
        gsap.set(startButtonRef.current, {
          scale: 0,
          opacity: 0,
          y: 50,
        });

        gsap.to(startButtonRef.current, {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: gameState.amounts.length * 0.08 + 0.5,
          ease: "elastic.out(1, 0.5)",
        });

        // Add pulsing animation
        gsap.to(startButtonRef.current, {
          scale: 1.05,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: gameState.amounts.length * 0.08 + 1.2,
        });
      }
    }
  }, [gameState.amounts]);

  // Animate when game starts (start button clicked)
  useEffect(() => {
    if (gameState.gameStarted && envelopeRefs.current.length > 0) {
      // Kill any existing animations
      envelopeRefs.current.forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });

      // Re-animate envelopes
      animateEnvelopes();
    }
  }, [gameState.gameStarted]);

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
              Quỹ lộc hiện có:{" "}
              {formatCurrency(
                gameState.totalFund -
                  Array.from(gameState.openedEnvelopes).reduce(
                    (sum, idx) => sum + gameState.amounts[idx],
                    0,
                  ),
              )}{" "}
              VNĐ
            </span>
            <span className="hidden md:inline">•</span>
            <span>
              Đã 'bay màu': {gameState.openedEnvelopes.size} /{" "}
              {gameState.numberOfPackets}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 max-w-2xl mx-auto">
            <div className="bg-yellow-200/30 rounded-full h-4 overflow-hidden border-2 border-yellow-400">
              <div
                className="bg-linear-to-r from-yellow-400 to-yellow-300 h-full transition-all duration-300"
                style={{
                  width: `${(gameState.openedEnvelopes.size / gameState.numberOfPackets) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Streak Counter */}
          {gameState.gameMode === "challenge" && gameState.streak > 0 && (
            <div className="mt-4 text-2xl font-playfair text-red-300 animate-pulse">
              🔥 {gameState.streak} Streak! 🔥
            </div>
          )}
        </div>

        {/* Envelope Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
          {gameState.amounts.map((amount, index) => (
            <div
              key={index}
              ref={(el) => {
                envelopeRefs.current[index] = el;
              }}
            >
              <Envelope
                index={index}
                amount={amount}
                isOpened={gameState.openedEnvelopes.has(index)}
                onClick={() => onEnvelopeClick(index)}
                showValue={!gameState.gameStarted}
                totalFund={gameState.totalFund}
              />
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="text-center flex flex-col gap-2 items-center">
          {allOpened && (
            <div className="mb-6 bg-yellow-400 text-red-800 px-6 py-4 rounded-xl inline-block font-playfair text-2xl shadow-lg">
              Đã sạch túi! 🔥
            </div>
          )}
          {!gameState.gameStarted ? (
            <button
              ref={startButtonRef}
              onClick={onStartGame}
              className="bg-yellow-400 hover:bg-yellow-500 text-red-800 font-montserrat text-xl px-12 py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-200 border-2 border-red-700 cursor-pointer font-bold"
            >
              Bắt Đầu! 🎉
            </button>
          ) : (
            <button
              onClick={onReset}
              className="bg-white hover:bg-gray-100 text-red-700 font-montserrat text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-200 border-2 border-yellow-500 cursor-pointer"
            >
              Làm ván mới!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function formatCurrency(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

npmimport React, { useEffect, useState } from "react";

interface GameCutsceneProps {
  numberOfPackets: number;
  onComplete: () => void;
}

interface Character {
  id: number;
  emoji: string;
  delay: number;
}

export function GameCutscene({
  numberOfPackets,
  onComplete,
}: GameCutsceneProps) {
  const [showText, setShowText] = useState(false);
  const [showCharacters, setShowCharacters] = useState(false);

  // Generate random characters
  const characters: Character[] = [
    { id: 1, emoji: "👨", delay: 0.2 },
    { id: 2, emoji: "👩", delay: 0.4 },
    { id: 3, emoji: "👦", delay: 0.6 },
    { id: 4, emoji: "👧", delay: 0.8 },
    { id: 5, emoji: "🧓", delay: 1.0 },
  ];

  useEffect(() => {
    // Show text after 0.3s
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 300);

    // Show characters after 0.8s
    const charactersTimer = setTimeout(() => {
      setShowCharacters(true);
    }, 800);

    // Complete cutscene after 4.5s
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(charactersTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-linear-to-br from-red-700 via-red-600 to-red-800 z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Envelopes Flying In */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left side envelopes */}
        {[0, 1, 2].map((i) => (
          <div
            key={`left-${i}`}
            className="absolute animate-fly-in-left"
            style={{
              top: `${20 + i * 20}%`,
              left: "5%",
              animationDelay: `${i * 0.2}s`,
              fontSize: "3rem",
            }}
          >
            🧧
          </div>
        ))}

        {/* Right side envelopes */}
        {[0, 1, 2].map((i) => (
          <div
            key={`right-${i}`}
            className="absolute animate-fly-in-right"
            style={{
              top: `${20 + i * 20}%`,
              right: "5%",
              animationDelay: `${i * 0.2}s`,
              fontSize: "3rem",
            }}
          >
            🧧
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl px-8">
        {/* Welcome Text */}
        {showText && (
          <div className="animate-fade-in-scale mb-12">
            <h1 className="text-5xl md:text-7xl font-playfair text-yellow-400 mb-4 drop-shadow-lg font-bold">
              Chào Mừng! 🎉
            </h1>
            <p className="text-2xl md:text-3xl font-montserrat text-yellow-200 mb-4">
              Bạn sắp phát lì xì cho {numberOfPackets} người!
            </p>
            <p className="text-xl md:text-2xl font-montserrat text-yellow-100">
              Mọi người đều đợi bạn rồi... 👀
            </p>
          </div>
        )}

        {/* Characters */}
        {showCharacters && (
          <div className="flex justify-center items-end gap-2 md:gap-4">
            {characters.map((char) => (
              <div
                key={char.id}
                className="animate-bounce-in"
                style={{
                  animationDelay: `${char.delay}s`,
                }}
              >
                <div className="flex flex-col items-center">
                  {/* Character with waving hand */}
                  <div className="relative">
                    <span className="text-5xl md:text-7xl">{char.emoji}</span>
                    {[0, 1, 2].includes(char.id) && (
                      <span
                        className="absolute animate-wave"
                        style={{
                          fontSize: "2.5rem",
                          top: "-20px",
                          right: "-15px",
                        }}
                      >
                        👋
                      </span>
                    )}
                  </div>
                  {/* Happy expression */}
                  <span className="text-2xl mt-1">😊</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Decorative confetti elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["🎉", "🎊", "🌸", "✨", "💝"].map((emoji, index) => (
          <div
            key={`confetti-${index}`}
            className="absolute animate-fade-in-scale"
            style={{
              fontSize: "2rem",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${0.5 + Math.random() * 0.5}s`,
              animationDuration: "1.2s",
              opacity: 0.6,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>
    </div>
  );
}

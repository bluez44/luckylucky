import { useMemo, useRef, useState } from "react";
import { SetupScreen } from "./components/SetupScreen";
import { EnvelopeGrid } from "./components/EnvelopeGrid";
import { ResultModal } from "./components/ResultModal";
import { WelcomeModal } from "./components/WelcomeModal";
import { QuestionModal } from "./components/QuestionModal";
import { LoadingModal } from "./components/LoadingModal";
import { GameCutscene } from "./components/GameCutscene";
import { GameStatsScreen } from "./components/GameStatsScreen";
import { ThemeToggle } from "./components/ThemeToggle";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  distributeAmount,
  formatDifficultyBasedOnAmount,
  generateDecorativeIcons,
  redistributeUnopened,
} from "./utils";
import { generateTetQuestion, questionType } from "./service/gemini";
import {
  createInitialStats,
  GameStats,
  getAchievements,
  saveToLeaderboard,
} from "./utils/achievements";
import { playSound } from "./utils/audio";

export type GameMode = "normal" | "challenge";

export interface Envelope {
  id: number;
  opened: boolean;
}

export interface GameState {
  totalFund: number;
  numberOfPackets: number;
  amounts: number[];
  openedEnvelopes: Set<number>;
  gameMode: GameMode;
  minValue: number;
  maxValue: number;
  gameStarted: boolean;
  streak: number;
  longestStreak: number;
}

function AppContent() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>(createInitialStats());
  const [showCutscene, setShowCutscene] = useState(false);
  const [showGameStats, setShowGameStats] = useState(false);
  const [selectedEnvelope, setSelectedEnvelope] = useState<{
    index: number;
    amount: number;
  } | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<{
    question: questionType;
    envelopeIndex: number;
    envelopeAmount: number;
  } | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const bgMusic = "/audio/background-music.mp3";

  const floatingIcons = useMemo(() => {
    return generateDecorativeIcons();
  }, []);

  const toggleMusic = () => {
    console.log("Toggling music. Current state:", isMusicOn);
    if (isMusicOn) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
      audioRef.current!.volume = 0.2;
    }
    setIsMusicOn(!isMusicOn);
  };

  const handleCreateEnvelopes = (
    totalFund: number,
    numberOfPackets: number,
    gameMode: GameMode,
    minValue: number,
    maxValue: number,
  ) => {
    const amounts = distributeAmount(
      totalFund,
      numberOfPackets,
      minValue,
      maxValue,
    );
    const newGameState: GameState = {
      totalFund,
      numberOfPackets,
      amounts,
      openedEnvelopes: new Set(),
      gameMode,
      minValue,
      maxValue,
      gameStarted: false,
      streak: 0,
      longestStreak: 0,
    };
    setGameState(newGameState);

    // Reset game stats
    setGameStats(createInitialStats());

    // Show cutscene after creating envelopes
    setShowCutscene(true);
  };

  const handleEnvelopeClick = async (index: number) => {
    if (
      !gameState ||
      gameState.openedEnvelopes.has(index) ||
      !gameState.gameStarted
    )
      return;

    const amount = gameState.amounts[index];

    // Only generate questions in challenge mode
    if (gameState.gameMode === "challenge") {
      const questionLevel = formatDifficultyBasedOnAmount(
        amount,
        gameState.totalFund,
      );

      setIsLoadingQuestion(true);
      try {
        const quizPromise: questionType =
          await generateTetQuestion(questionLevel);

        // Show the question modal instead of opening envelope immediately
        setCurrentQuestion({
          question: quizPromise,
          envelopeIndex: index,
          envelopeAmount: amount,
        });
      } catch (error) {
        console.error("Error generating quiz:", error);
      } finally {
        setIsLoadingQuestion(false);
      }
    } else {
      // Normal mode: directly open the envelope
      const newOpenedEnvelopes = new Set(gameState.openedEnvelopes);
      newOpenedEnvelopes.add(index);
      playSound("envelope-open");

      // Update stats
      const amountWon = amount;
      const newStats = { ...gameStats };
      newStats.totalWon += amountWon;

      if (!newStats.bestEnvelope || amountWon > newStats.bestEnvelope.amount) {
        newStats.bestEnvelope = { amount: amountWon, index };
      }
      if (
        !newStats.worstEnvelope ||
        amountWon < newStats.worstEnvelope.amount
      ) {
        newStats.worstEnvelope = { amount: amountWon, index };
      }

      setGameStats(newStats);

      setGameState({
        ...gameState,
        openedEnvelopes: newOpenedEnvelopes,
        gameStarted: true,
      });

      setSelectedEnvelope({ index, amount });
    }
  };

  const handleCloseModal = () => {
    setSelectedEnvelope(null);
  };

  const handleQuestionAnswer = (isCorrect: boolean) => {
    if (!currentQuestion || !gameState) return;

    if (isCorrect) {
      playSound("correct-answer");

      // Mark envelope as opened
      const newOpenedEnvelopes = new Set(gameState.openedEnvelopes);
      newOpenedEnvelopes.add(currentQuestion.envelopeIndex);

      // Update streak and stats
      const newStreak = gameState.streak + 1;
      const newLongestStreak = Math.max(newStreak, gameState.longestStreak);

      const newStats = { ...gameStats };
      newStats.totalWon += currentQuestion.envelopeAmount;
      newStats.totalChallenges += 1;
      newStats.correctAnswers += 1;
      newStats.longestStreak = newLongestStreak;

      if (
        !newStats.bestEnvelope ||
        currentQuestion.envelopeAmount > newStats.bestEnvelope.amount
      ) {
        newStats.bestEnvelope = {
          amount: currentQuestion.envelopeAmount,
          index: currentQuestion.envelopeIndex,
        };
      }
      if (
        !newStats.worstEnvelope ||
        currentQuestion.envelopeAmount < newStats.worstEnvelope.amount
      ) {
        newStats.worstEnvelope = {
          amount: currentQuestion.envelopeAmount,
          index: currentQuestion.envelopeIndex,
        };
      }

      setGameStats(newStats);

      // Play different sounds based on amount
      if (currentQuestion.envelopeAmount >= gameState.totalFund * 0.3) {
        playSound("jackpot");
      } else if (currentQuestion.envelopeAmount >= gameState.totalFund * 0.15) {
        playSound("success");
      } else {
        playSound("small-win");
      }

      setGameState({
        ...gameState,
        openedEnvelopes: newOpenedEnvelopes,
        gameStarted: true,
        streak: newStreak,
        longestStreak: newLongestStreak,
      });

      // Show the result modal
      setSelectedEnvelope({
        index: currentQuestion.envelopeIndex,
        amount: currentQuestion.envelopeAmount,
      });
    } else {
      playSound("fail");

      // Wrong answer: redistribute amounts among unopened envelopes
      const redistributed = redistributeUnopened(
        gameState.amounts,
        gameState.openedEnvelopes,
      );

      const newStats = { ...gameStats };
      newStats.totalChallenges += 1;
      setGameStats(newStats);

      setGameState({
        ...gameState,
        amounts: redistributed,
        gameStarted: true,
        streak: 0, // Reset streak on wrong answer
      });
    }

    // Close the question modal
    setCurrentQuestion(null);
  };

  const handleReset = () => {
    // Save stats to leaderboard if in challenge mode
    if (gameState && gameState.gameMode === "challenge") {
      const finalStats = {
        ...gameStats,
        achievements: getAchievements(
          gameStats.totalWon,
          gameStats.correctAnswers,
          gameStats.totalChallenges,
          gameStats.longestStreak,
          gameStats.bestEnvelope?.amount || 0,
          gameState.totalFund,
        ),
      };
      saveToLeaderboard(finalStats);
      setShowGameStats(true);
    } else {
      setGameState(null);
      setSelectedEnvelope(null);
    }
  };

  const handleWelcomeEnter = async () => {
    // Play audio

    audioRef.current?.play();
    audioRef.current!.volume = 0.2;
    setIsMusicOn(true);

    // Hide welcome modal and show setup screen
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-theme-bg-primary via-theme-bg-secondary to-theme-bg-dark relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-40 z-10 pointer-events-none">
        {floatingIcons.map((icon, index) => (
          <div
            key={index}
            className={`absolute text-6xl ${icon.animate}`}
            style={{
              top: `${icon.top}%`,
              left: `${icon.left}%`,
              // animation: icon.animate,
            }}
          >
            {icon.emoji}
          </div>
        ))}
      </div>

      {/* Welcome Modal */}
      {showWelcome && <WelcomeModal onEnter={handleWelcomeEnter} />}

      {/* Game Cutscene */}
      {showCutscene && gameState && (
        <GameCutscene
          numberOfPackets={gameState.numberOfPackets}
          onComplete={() => setShowCutscene(false)}
        />
      )}

      {/* Main content */}
      <div className="relative z-50">
        {!showWelcome && !showCutscene && (
          <>
            {!gameState ? (
              <SetupScreen onCreateEnvelopes={handleCreateEnvelopes} />
            ) : (
              <EnvelopeGrid
                gameState={gameState}
                onEnvelopeClick={handleEnvelopeClick}
                onReset={handleReset}
                onStartGame={() => {
                  if (gameState) {
                    // Shuffle amounts
                    const shuffled = [...gameState.amounts].sort(
                      () => Math.random() - 0.5,
                    );
                    setGameState({
                      ...gameState,
                      amounts: shuffled,
                      gameStarted: true,
                    });
                  }
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Background music element (hidden) */}
      <audio ref={audioRef} src={bgMusic} preload="auto" className="hidden" />

      {/* Music Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-4">
        <ThemeToggle />

        <button
          onClick={toggleMusic}
          aria-label={isMusicOn ? "Turn off music" : "Turn on music"}
          className="hover:cursor-pointer bg-transparent hover:bg-white/30 text-white border border-white/30 backdrop-blur-md rounded-full px-2 py-2 shadow-lg transition flex items-center gap-2"
        >
          <span className="text-xl">{isMusicOn ? "🔊" : "🔇"}</span>
        </button>
      </div>

      {/* Loading Modal */}
      {isLoadingQuestion && <LoadingModal />}

      {/* Question Modal */}
      {currentQuestion && (
        <QuestionModal
          question={currentQuestion.question}
          onAnswer={handleQuestionAnswer}
        />
      )}

      {/* Result Modal */}
      {selectedEnvelope && (
        <ResultModal
          amount={selectedEnvelope.amount}
          onClose={handleCloseModal}
        />
      )}

      {/* Game Stats Screen */}
      {showGameStats && gameState && (
        <GameStatsScreen
          stats={gameStats}
          onPlayAgain={() => {
            setShowGameStats(false);
            setGameState(null);
            setSelectedEnvelope(null);
          }}
        />
      )}
    </div>
  );
}

// Wrap the app with ThemeProvider
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

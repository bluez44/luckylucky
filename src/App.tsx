import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SetupScreen } from "./components/SetupScreen";
import { EnvelopeGrid } from "./components/EnvelopeGrid";
import { ResultModal } from "./components/ResultModal";
import { WelcomeModal } from "./components/WelcomeModal";
import { QuestionModal } from "./components/QuestionModal";
import { LoadingModal } from "./components/LoadingModal";
import {
  distributeAmount,
  formatDifficultyBasedOnAmount,
  generateDecorativeIcons,
  redistributeUnopened,
} from "./utils";
import { generateTetQuestion, questionType, test } from "./service/gemini";

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
}

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
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
  const bgMusic = "../assets/audios/background-music.mp3";

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
    gameMode: GameMode
  ) => {
    const amounts = distributeAmount(totalFund, numberOfPackets);
    setGameState({
      totalFund,
      numberOfPackets,
      amounts,
      openedEnvelopes: new Set(),
      gameMode,
    });
  };

  const handleEnvelopeClick = async (index: number) => {
    if (!gameState || gameState.openedEnvelopes.has(index)) return;

    const amount = gameState.amounts[index];

    // Only generate questions in challenge mode
    if (gameState.gameMode === "challenge") {
      const questionLevel = formatDifficultyBasedOnAmount(
        amount,
        gameState.totalFund
      );

      setIsLoadingQuestion(true);
      try {
        const quizPromise: questionType = await generateTetQuestion(
          questionLevel
        );

        console.log("Question level:", questionLevel);
        console.log("Quiz promise:", quizPromise);

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
      setGameState({ ...gameState, openedEnvelopes: newOpenedEnvelopes });

      setSelectedEnvelope({ index, amount });
    }
  };

  const handleCloseModal = () => {
    setSelectedEnvelope(null);
  };

  const handleQuestionAnswer = (isCorrect: boolean) => {
    if (!currentQuestion || !gameState) return;

    if (isCorrect) {
      // Mark envelope as opened
      const newOpenedEnvelopes = new Set(gameState.openedEnvelopes);
      newOpenedEnvelopes.add(currentQuestion.envelopeIndex);
      setGameState({ ...gameState, openedEnvelopes: newOpenedEnvelopes });

      // Show the result modal
      setSelectedEnvelope({
        index: currentQuestion.envelopeIndex,
        amount: currentQuestion.envelopeAmount,
      });
    } else {
      // Wrong answer: redistribute amounts among unopened envelopes
      const redistributed = redistributeUnopened(
        gameState.amounts,
        gameState.openedEnvelopes
      );
      setGameState({ ...gameState, amounts: redistributed });
    }

    // Close the question modal
    setCurrentQuestion(null);
  };

  const handleReset = () => {
    setGameState(null);
    setSelectedEnvelope(null);
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
    <div className="min-h-screen bg-linear-to-br from-red-700 via-red-600 to-red-800 relative overflow-hidden">
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

      {/* Main content */}
      <div className="relative z-50">
        {!showWelcome && (
          <>
            {!gameState ? (
              <SetupScreen onCreateEnvelopes={handleCreateEnvelopes} />
            ) : (
              <EnvelopeGrid
                gameState={gameState}
                onEnvelopeClick={handleEnvelopeClick}
                onReset={handleReset}
              />
            )}
          </>
        )}
      </div>

      {/* Background music element (hidden) */}
      <audio ref={audioRef} src={bgMusic} preload="auto" className="hidden" />

      {/* Music Toggle Button */}
      <button
        onClick={toggleMusic}
        aria-label={isMusicOn ? "Turn off music" : "Turn on music"}
        className="fixed bottom-4 right-4 z-50 hover:cursor-pointer bg-transparent hover:bg-white/30 text-white border border-white/30 backdrop-blur-md rounded-full px-2 py-2 shadow-lg transition flex items-center gap-2"
      >
        <span className="text-xl">{isMusicOn ? "🔊" : "🔇"}</span>
      </button>

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
    </div>
  );
}

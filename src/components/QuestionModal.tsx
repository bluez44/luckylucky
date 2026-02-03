import React from "react";
import { questionType } from "../service/gemini";

interface QuestionModalProps {
  question: questionType;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  onAnswer,
}) => {
  const [selectedChoice, setSelectedChoice] = React.useState<number | null>(
    null,
  );
  const [showResult, setShowResult] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const handleChoiceSelect = (index: number) => {
    if (showResult) return;
    setSelectedChoice(index);
  };

  const handleSubmit = () => {
    if (selectedChoice === null) return;
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    const isCorrect = selectedChoice === question.correctAnswer;
    setShowResult(true);

    // Wait a bit to show the result before calling onAnswer
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1500);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-theme-modal-overlay backdrop-blur-sm">
      <div className="bg-theme-card-bg rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 border-4 border-theme-accent">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-theme-text-dark mb-2 uppercase">
            🏮 🤔 Check não đầu xuân 🤔 🏮
          </h2>
          <p className="text-theme-text-body">Não có nảy được số này không?</p>
        </div>

        {/* Question */}
        <div className="bg-theme-card-bg rounded-xl p-6 mb-6 shadow-md border-2 border-theme-accent">
          <p className="text-xl font-semibold text-theme-text-heading">
            {question.question}
          </p>
        </div>

        {/* Choices */}
        <div className="space-y-3 mb-6">
          {question.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleChoiceSelect(index)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedChoice === index
                  ? showResult
                    ? index === question.correctAnswer
                      ? "bg-theme-card-bg-success border-theme-card-border-success text-theme-text-success"
                      : "bg-theme-error-light border-theme-error text-theme-text-primary"
                    : "bg-theme-accent-lighter border-theme-accent-dark text-theme-text-heading"
                  : showResult && index === question.correctAnswer
                    ? "bg-theme-card-bg-success border-theme-card-border-success text-theme-text-success"
                    : "bg-theme-card-bg border-theme-input-border hover:border-theme-accent hover:bg-theme-accent-lighter"
              } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center">
                <span className="text-lg font-medium">{choice}</span>
                {showResult && index === question.correctAnswer && (
                  <span className="ml-auto text-theme-success">✓</span>
                )}
                {showResult &&
                  selectedChoice === index &&
                  index !== question.correctAnswer && (
                    <span className="ml-auto text-theme-error">✗</span>
                  )}
              </div>
            </button>
          ))}
        </div>

        {/* Submit Button */}
        {!showResult && (
          <button
            onClick={handleSubmit}
            disabled={selectedChoice === null}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all cursor-pointer ${
              selectedChoice === null
                ? "bg-theme-input-border text-theme-text-muted cursor-not-allowed"
                : "bg-linear-to-r from-theme-envelope to-theme-celebration-orange text-white hover:from-theme-envelope-dark hover:to-theme-celebration-red shadow-lg"
            }`}
          >
            Trả lời
          </button>
        )}

        {/* Result Message */}
        {showResult && (
          <div
            className={`text-center p-4 rounded-lg font-bold text-lg ${
              selectedChoice === question.correctAnswer
                ? "bg-theme-card-bg-success text-theme-text-success"
                : "bg-theme-error-light text-theme-text-primary"
            }`}
          >
            {selectedChoice === question.correctAnswer
              ? "🎉 Chuẩn Đét!"
              : "❌ Ủa Alo? Trả Lời Gì Kỳ Vậy Sếp?..."}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-theme-modal-overlay-dark backdrop-blur-sm">
          <div className="bg-theme-card-bg rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 border-2 border-theme-accent">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🤔</div>
              <h3 className="text-xl font-bold text-theme-text-heading mb-2">
                Chắc chưa?
              </h3>
              <p className="text-theme-text-body">
                Đã chọn đáp án:{" "}
                <span className="font-semibold text-theme-envelope">
                  {question.choices[selectedChoice!]}
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 rounded-lg font-semibold text-theme-text-secondary bg-theme-input-border hover:bg-theme-text-muted transition cursor-pointer"
              >
                Đổi ý
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-lg font-semibold text-white bg-linear-to-r from-theme-envelope to-theme-celebration-orange hover:from-theme-envelope-dark hover:to-theme-celebration-red transition shadow-lg cursor-pointer"
              >
                Chốt luôn! 🎯
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

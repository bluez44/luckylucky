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
    null
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
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-linear-to-br from-red-50 to-orange-50 rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 border-4 border-yellow-400">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-red-800 mb-2 uppercase">
            🧧 🤔 Check não đầu xuân 🤔 🧧
          </h2>
          <p className="text-gray-600">Não có nảy được số này không?</p>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md border-2 border-yellow-300">
          <p className="text-xl font-semibold text-gray-800">
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
                      ? "bg-green-100 border-green-500 text-green-800"
                      : "bg-red-100 border-red-500 text-red-800"
                    : "bg-yellow-100 border-yellow-500 text-gray-800"
                  : showResult && index === question.correctAnswer
                  ? "bg-green-50 border-green-400 text-green-800"
                  : "bg-white border-gray-300 hover:border-yellow-400 hover:bg-yellow-50"
              } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center">
                <span className="text-lg font-medium">{choice}</span>
                {showResult && index === question.correctAnswer && (
                  <span className="ml-auto text-green-600">✓</span>
                )}
                {showResult &&
                  selectedChoice === index &&
                  index !== question.correctAnswer && (
                    <span className="ml-auto text-red-600">✗</span>
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
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-linear-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 shadow-lg"
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
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
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
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 border-2 border-yellow-400">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🤔</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Chắc chưa?
              </h3>
              <p className="text-gray-600">
                Đã chọn đáp án:{" "}
                <span className="font-semibold text-red-600">
                  {question.choices[selectedChoice!]}
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
              >
                Đổi ý
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-lg font-semibold text-white bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 transition shadow-lg cursor-pointer"
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

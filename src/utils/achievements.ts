// Achievement system
export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: () => boolean;
  earned: boolean;
}

export interface GameStats {
  totalWon: number;
  totalChallenges: number;
  correctAnswers: number;
  longestStreak: number;
  bestEnvelope: { amount: number; index: number } | null;
  worstEnvelope: { amount: number; index: number } | null;
  achievements: Achievement[];
  timestamp: number;
}

export function createInitialStats(): GameStats {
  return {
    totalWon: 0,
    totalChallenges: 0,
    correctAnswers: 0,
    longestStreak: 0,
    bestEnvelope: null,
    worstEnvelope: null,
    achievements: [],
    timestamp: Date.now(),
  };
}

export function getAccuracyRate(stats: GameStats): number {
  if (stats.totalChallenges === 0) return 0;
  return Math.round((stats.correctAnswers / stats.totalChallenges) * 100);
}

export function getAchievements(
  totalWon: number,
  correctAnswers: number,
  totalChallenges: number,
  longestStreak: number,
  bestAmount: number,
  totalFund: number,
): Achievement[] {
  const achievements: Achievement[] = [];

  // Lucky Dragon - won highest envelope
  achievements.push({
    id: "lucky-dragon",
    name: "Lucky Dragon",
    description: "Won the highest envelope",
    emoji: "🐉",
    condition: () => bestAmount >= totalFund * 0.3,
    earned: bestAmount >= totalFund * 0.3,
  });

  // Quiz Master - all correct
  achievements.push({
    id: "quiz-master",
    name: "Quiz Master",
    description: "Got all questions correct",
    emoji: "🧠",
    condition: () => totalChallenges > 0 && correctAnswers === totalChallenges,
    earned: totalChallenges > 0 && correctAnswers === totalChallenges,
  });

  // Risk Taker - high accuracy
  achievements.push({
    id: "risk-taker",
    name: "Risk Taker",
    description: "80% accuracy or higher",
    emoji: "🎰",
    condition: () =>
      totalChallenges > 0 && correctAnswers / totalChallenges >= 0.8,
    earned: totalChallenges > 0 && correctAnswers / totalChallenges >= 0.8,
  });

  // Fire Streak - 5+ correct in a row
  achievements.push({
    id: "fire-streak",
    name: "Fire Streak",
    description: "5+ correct answers in a row",
    emoji: "🔥",
    condition: () => longestStreak >= 5,
    earned: longestStreak >= 5,
  });

  // Money Maker - won lots
  achievements.push({
    id: "money-maker",
    name: "Money Maker",
    description: "Won over half the fund",
    emoji: "💰",
    condition: () => totalWon >= totalFund * 0.5,
    earned: totalWon >= totalFund * 0.5,
  });

  return achievements;
}

export function saveToLeaderboard(stats: GameStats): void {
  try {
    const leaderboard = JSON.parse(
      localStorage.getItem("tetLeaderboard") || "[]",
    ) as GameStats[];
    leaderboard.push(stats);
    // Keep only top 10
    leaderboard.sort((a, b) => b.totalWon - a.totalWon);
    localStorage.setItem(
      "tetLeaderboard",
      JSON.stringify(leaderboard.slice(0, 10)),
    );
  } catch (e) {
    console.error("Failed to save leaderboard:", e);
  }
}

export function getLeaderboard(): GameStats[] {
  try {
    return JSON.parse(
      localStorage.getItem("tetLeaderboard") || "[]",
    ) as GameStats[];
  } catch (e) {
    console.error("Failed to get leaderboard:", e);
    return [];
  }
}

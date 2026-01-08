interface DecorativeIcon {
  emoji: string;
  top: number;
  left: number;
  animate: string;
}

export function generateDecorativeIcons(): DecorativeIcon[] {
  const icons = [
    "🌸",
    "🧧",
    "💰",
    "🎆",
    "🎇",
    "🎉",
    "🧨",
    "🐉",
    "💝",
    "🎊",
    "✨",
    "🌺",
    "🍊",
    "🏮",
    "🎀",
    "🌼",
    "⭐",
    "🌟",
    "🎁",
    "🎈",
  ];
  const animations = ["animate-float", "animate-float-delayed"];
  const decorativeIcons: DecorativeIcon[] = [];

  // Create a 5x4 grid (20 cells) to distribute icons evenly
  const cols = 5;
  const rows = 4;
  const cellWidth = 100 / cols;
  const cellHeight = 100 / rows;
  const spacing = 8; // Random offset within each cell

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const baseTop = row * cellHeight;
      const baseLeft = col * cellWidth;

      decorativeIcons.push({
        emoji: icons[Math.floor(Math.random() * icons.length)],
        top: baseTop + Math.random() * spacing,
        left: baseLeft + Math.random() * spacing,
        animate: animations[Math.floor(Math.random() * animations.length)],
      });
    }
  }

  return decorativeIcons;
}

// Distribution algorithm
export function distributeAmount(total: number, packets: number): number[] {
  // Random distribution
  const amounts: number[] = [];
  let remaining = total;
  const minAmount = Math.floor(total / packets / 10) || 1000; // Minimum 10% of average or 1000 VNĐ

  for (let i = 0; i < packets - 1; i++) {
    const maxPossible = remaining - minAmount * (packets - i - 1);
    const randomAmount = Math.floor(
      Math.random() * (maxPossible - minAmount + 1) + minAmount
    );
    amounts.push(randomAmount);
    remaining -= randomAmount;
  }
  amounts.push(remaining); // Last packet gets the remainder

  // Shuffle to randomize positions
  return shuffleArray(amounts);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function formatDifficultyBasedOnAmount(
  amount: number,
  totalFund: number
): string {
  const percentage = (amount / totalFund) * 100;
  if (percentage < 20) {
    return "Easy";
  } else if (percentage < 50) {
    return "Medium";
  } else {
    return "Hard";
  }
}

// Redistribute amounts across unopened envelopes, preserving opened ones.
export function redistributeUnopened(
  amounts: number[],
  openedIndices: Set<number>
): number[] {
  const newAmounts = [...amounts];
  const unopenedIndices: number[] = [];

  for (let i = 0; i < amounts.length; i++) {
    if (!openedIndices.has(i)) {
      unopenedIndices.push(i);
    }
  }

  if (unopenedIndices.length === 0) {
    return newAmounts;
  }

  const remainingTotal = unopenedIndices.reduce(
    (sum, idx) => sum + amounts[idx],
    0
  );

  const redistributed = distributeAmount(
    remainingTotal,
    unopenedIndices.length
  );

  unopenedIndices.forEach((idx, k) => {
    newAmounts[idx] = redistributed[k];
  });

  return newAmounts;
}

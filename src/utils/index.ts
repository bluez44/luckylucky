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
export function distributeAmount(
  total: number,
  packets: number,
  minValue?: number,
  maxValue?: number
): number[] {
  // Use provided min/max or calculate defaults
  const min = minValue || Math.floor(total / packets / 10) || 1000;
  const max = maxValue || total; // Default max is total if not specified

  // Validate that distribution is possible
  if (packets * min > total || packets * max < total) {
    // Fallback to equal distribution if constraints can't be met
    const equalAmount = Math.floor(total / packets);
    const remainder = total % packets;
    const amounts: number[] = Array(packets).fill(equalAmount);
    // Distribute remainder across first few envelopes
    for (let i = 0; i < remainder; i++) {
      amounts[i]++;
    }
    return shuffleArray(amounts);
  }

  // Random distribution within min/max constraints
  const amounts: number[] = [];
  let remaining = total;

  for (let i = 0; i < packets - 1; i++) {
    const minPossible = Math.max(min, remaining - max * (packets - i - 1));
    const maxPossible = Math.min(max, remaining - min * (packets - i - 1));

    const randomAmount = Math.floor(
      Math.random() * (maxPossible - minPossible + 1) + minPossible
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

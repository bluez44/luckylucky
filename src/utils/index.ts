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
  maxValue?: number,
): number[] {
  // Round to nearest multiple of 1000
  const roundToThousand = (value: number): number => Math.round(value / 1000) * 1000;

  // Use provided min/max or calculate defaults, rounded to multiples of 1000
  const min = roundToThousand(minValue || Math.floor(total / packets / 1000) || 1000);
  const max = roundToThousand(maxValue || total);
  // Validate that distribution is possible
  if (packets < 2 || packets * min > total || packets * max < total) {
    // Fallback to equal distribution if constraints can't be met
    const equalAmount = roundToThousand(total / packets);
    const amounts: number[] = Array(packets).fill(equalAmount);
    const remainder = total - equalAmount * packets;
    // Distribute remainder across first few envelopes
    for (let i = 0; i < Math.abs(remainder) / 1000; i++) {
      amounts[i] += remainder > 0 ? 1000 : -1000;
    }
    return shuffleArray(amounts);
  }

  const amounts: number[] = [];

  // Guarantee at least one min and one max value
  amounts.push(min);
  amounts.push(max);
  let remaining = total - min - max;

  // Distribute the rest among remaining packets
  for (let i = 0; i < packets - 3; i++) {
    const minPossible = Math.max(min, remaining - max * (packets - i - 3));
    const maxPossible = Math.min(max, remaining - min * (packets - i - 3));

    const randomAmount = roundToThousand(
      Math.random() * (maxPossible - minPossible) + minPossible,
    );
    amounts.push(randomAmount);
    remaining -= randomAmount;
  }

  // Last packet gets the remainder, rounded to multiple of 1000
  const lastAmount = roundToThousand(remaining);
  amounts.push(lastAmount);

  // Adjust if rounding caused discrepancy
  const currentTotal = amounts.reduce((sum, val) => sum + val, 0);
  const diff = total - currentTotal;
  if (diff !== 0) {
    // Add the difference to a random envelope (not min or max)
    const adjustIndex = Math.floor(Math.random() * (packets - 2)) + 2;
    amounts[adjustIndex] += diff;
    amounts[adjustIndex] = roundToThousand(amounts[adjustIndex]);
  }

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
  totalFund: number,
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
  openedIndices: Set<number>,
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
    0,
  );

  const redistributed = distributeAmount(
    remainingTotal,
    unopenedIndices.length,
  );

  unopenedIndices.forEach((idx, k) => {
    newAmounts[idx] = redistributed[k];
  });

  return newAmounts;
}

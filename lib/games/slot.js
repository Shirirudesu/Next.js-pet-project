import { symbols, payouts } from "../constants/slotSymbols";

export function playSlot(bet) {
  const getSymbol = () => {
    if (bet === 200) {
      return Math.random() < 0.02
        ? "💎"
        : symbols[Math.floor(Math.random() * (symbols.length - 1))];
    }

    if (bet === 50) {
      return Math.random() < 0.05
        ? "⭐"
        : symbols[Math.floor(Math.random() * (symbols.length - 1))];
    }

    return Math.random() < 0.1
      ? "🍒"
      : symbols[Math.floor(Math.random() * symbols.length)];
  };

  const newReels = Array(3).fill(null).map(getSymbol);

  const [a, b, c] = newReels;

  const win = a === b && b === c;

  const winningAmount = win ? bet * (payouts[a] || 2) : 0;

  return {
    newReels,
    win,
    winningAmount,
  };
}

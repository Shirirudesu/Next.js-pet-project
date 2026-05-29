export function playCoinFlip(bet, choice) {
  const result = Math.random() < 0.5 ? "heads" : "tails";

  const win = choice === result;

  return {
    result,
    win,
    creditChange: win ? bet : -bet,
  };
}

export default function CoinChoice({
  playerChoice,
  setPlayerChoice,
  flipping,
}) {
  if (flipping) return null;

  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={() => setPlayerChoice("heads")}
        className={
          playerChoice === "heads"
            ? "bg-blue-500 text-white px-4 py-2 rounded-xl"
            : "bg-blue-200 px-4 py-2 rounded-xl"
        }
      >
        Heads
      </button>

      <button
        onClick={() => setPlayerChoice("tails")}
        className={
          playerChoice === "tails"
            ? "bg-blue-500 text-white px-4 py-2 rounded-xl"
            : "bg-blue-200 px-4 py-2 rounded-xl"
        }
      >
        Tails
      </button>
    </div>
  );
}

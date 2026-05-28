const bets = [5, 10, 50, 100];

export default function CoinBetSelector({ bet, setBet }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {bets.map((b) => (
        <button
          key={b}
          onClick={() => setBet(b)}
          className={
            bet === b
              ? "bg-black text-white rounded-xl p-2"
              : "bg-zinc-200 rounded-xl p-2"
          }
        >
          {b}
        </button>
      ))}
    </div>
  );
}

export default function BetSelector({ bet, setBet }) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {[5, 50, 200].map((amount) => (
        <button
          key={amount}
          onClick={() => setBet(amount)}
          className={
            bet === amount
              ? "h-10 rounded-xl bg-black text-white"
              : "h-10 rounded-xl bg-zinc-200"
          }
        >
          {amount} credits
        </button>
      ))}
    </div>
  );
}

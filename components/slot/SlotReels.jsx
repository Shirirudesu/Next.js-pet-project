export default function SlotReels({ reels }) {
  return (
    <div className="flex justify-center gap-4 bg-zinc-50 p-4 rounded-xl mb-6">
      {reels.map((symbol, i) => (
        <div
          key={i}
          className="w-16 h-16 flex items-center justify-center text-3xl border rounded-xl"
        >
          {symbol}
        </div>
      ))}
    </div>
  );
}

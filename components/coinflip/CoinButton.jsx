export default function CoinButton({ onClick, flipping, bet }) {
  return (
    <button
      onClick={onClick}
      disabled={flipping}
      className="w-full bg-blue-500 text-white py-3 rounded-xl"
    >
      {flipping ? "Flipping..." : `Play for ${bet}`}
    </button>
  );
}

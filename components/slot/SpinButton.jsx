export default function SpinButton({ onClick, isSpinning, bet }) {
  return (
    <button
      onClick={onClick}
      disabled={isSpinning}
      className="w-full h-12 bg-black text-white rounded-xl disabled:opacity-50"
    >
      {isSpinning ? "Spinning..." : `Spin for ${bet}`}
    </button>
  );
}

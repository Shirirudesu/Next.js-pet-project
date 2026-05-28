export default function CoinMessage({ message }) {
  if (!message) return null;
  return <p className="text-center text-sm text-zinc-600">{message}</p>;
}

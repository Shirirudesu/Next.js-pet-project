export default function SlotMessage({ message }) {
  if (!message) return null;

  return <p className="mt-4 text-center text-sm text-zinc-500">{message}</p>;
}

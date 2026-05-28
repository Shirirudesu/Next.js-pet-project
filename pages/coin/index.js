import { useState } from "react";
import { useSession } from "next-auth/react";

import CoinBetSelector from "../../components/coinflip/CoinBetSelector";
import CoinChoice from "../../components/coinflip/CoinChoice";
import CoinButton from "../../components/coinflip/CoinButton";
import CoinAnimation from "../../components/coinflip/CoinAnimation";
import CoinMessage from "../../components/coinflip/CoinMessage";

export default function CoinFlip({ credits, setCredits }) {
  const { data: session, status } = useSession();

  const [flipping, setFlipping] = useState(false);
  const [side, setSide] = useState(null);
  const [message, setMessage] = useState("");
  const [playerChoice, setPlayerChoice] = useState(null);
  const [bet, setBet] = useState(10);

  const handleFlip = async () => {
    if (status !== "authenticated") return;
    if (flipping) return;
    if (credits < bet) return;

    setFlipping(true);
    setMessage("Flipping...");
    setSide(null);

    const res = await fetch("/api/coin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
        bet,
      }),
    });

    const data = await res.json();

    setSide(data.result);
    setCredits(data.credits);

    if (data.win) {
      setMessage(`Win +${bet}`);
    } else {
      setMessage(`Lost -${bet}`);
    }

    setTimeout(() => setFlipping(false), 1000);
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl w-[420px] space-y-6">
        <h2 className="text-2xl font-bold text-center">Coin Flip</h2>

        <p className="text-center text-zinc-600">Balance: {credits}</p>

        <CoinBetSelector bet={bet} setBet={setBet} />

        <CoinChoice
          playerChoice={playerChoice}
          setPlayerChoice={setPlayerChoice}
          flipping={flipping}
        />

        <CoinAnimation side={side} flipping={flipping} />

        {playerChoice && (
          <CoinButton onClick={handleFlip} flipping={flipping} bet={bet} />
        )}

        <CoinMessage message={message} />
      </div>
    </div>
  );
}

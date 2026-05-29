import { useState } from "react";
import { useSession } from "next-auth/react";
import { useUser } from "../../context/UserContext";

import BetSelector from "../../components/slot/BetSelector";
import SlotReels from "../../components/slot/SlotReels";
import SpinButton from "../../components/slot/SpinButton";
import SlotMessage from "../../components/slot/SlotMessage";
// import SlotMachine from "../../components/slot/SlotMachine";

export default function SlotMachine(props) {
  const [bet, setBet] = useState(5);
  const [message, setMessage] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState(["❓", "❓", "❓"]);

  const { status, data: session } = useSession();
  const { credits, setCreditsLocal } = useUser();

  const getData = async () => {
    if (status !== "authenticated") {
      setMessage("Login required");
      return;
    }
    {
      if (credits < bet || isSpinning) {
        setMessage("Not enough credits!");
        setIsSpinning(false);
        return;
      }
      setIsSpinning(true);
      setMessage("Spinning...");
      setReels(["🔄", "🔄", "🔄"]);

      const res = await fetch(`/api/slot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          bet: bet,
        }),
      });
      const resJson = await res.json();

      setReels(resJson.result.newReels);

      if (resJson.win) {
        setMessage(`You won +${resJson.winAmount}`);
      } else {
        setMessage(`You lost -${bet}`);
      }
      setIsSpinning(false);
      setCreditsLocal(resJson.credits);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-800 px-6 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Slot Machine
            </h2>

            <p className="text-zinc-400 mt-2">
              Current balance:
              <span className="text-white font-medium ml-2">
                {credits} credits
              </span>
            </p>
          </div>

          <BetSelector bet={bet} setBet={setBet} />
          <SlotReels reels={reels} />
          <SpinButton onClick={getData} isSpinning={isSpinning} bet={bet} />
          <SlotMessage message={message} />
        </div>
      </div>
    </div>
  );
}

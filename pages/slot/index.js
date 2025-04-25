import { useState } from "react";
import { useSession } from "next-auth/react";
import SlotMachineTitle from "../../components/SlotMachineTitle";
export default function SlotMachine(props) {
  const [bet, setBet] = useState(5);
  const [message, setMessage] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState(["❓", "❓", "❓"]);
  const { status, data: session } = useSession();

  const getData = async () => {
    if (status === "authenticated") {
      if (props.credits < bet || isSpinning) {
        setMessage("Not enough credits!");
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
      console.log(res.json);
      if (resJson.result.win) {
        setMessage(`🎉 Jackpot! You won ${resJson.winningAmount} credits!`);
      } else {
        setMessage(`💸 Lost ${bet} credits`);
      }
      setIsSpinning(false);
      props.setCredits(resJson.credits);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-600 to-indigo-600 p-4">
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl w-[550px] min-h-[420px] p-6 space-y-6">
        <SlotMachineTitle />

        <p className="text-center text-lg">
          Balance: <span className="font-semibold">{props.credits}</span>{" "}
          credits
        </p>

        <div className="flex justify-center gap-3">
          {[5, 10, 15].map((amount) => (
            <button
              key={amount}
              onClick={() => setBet(amount)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                bet === amount
                  ? "bg-yellow-400 text-black shadow-md"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Bet {amount}
            </button>
          ))}
        </div>

        <div className="flex justify-center items-center gap-3 bg-gray-800 p-4 rounded-xl">
          {reels.map((symbol, idx) => (
            <div
              key={idx}
              className="w-16 h-16 bg-black text-3xl flex items-center justify-center rounded-lg border-2 border-gray-600"
            >
              {symbol}
            </div>
          ))}
        </div>

        <button
          onClick={getData}
          disabled={isSpinning}
          className="w-full py-3 rounded-full font-bold bg-green-500 hover:bg-green-600 disabled:opacity-50 transition"
        >
          Spin
        </button>

        {message && (
          <p className="text-center mt-2 text-sm text-yellow-300">{message}</p>
        )}
      </div>
    </div>
  );
}

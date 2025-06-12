import { useState } from "react";
import { useSession } from "next-auth/react";

const numArr = [5, 10, 50, 100];

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
    if (credits < bet) {
      setMessage("Not enough credits!");
      return;
    }
    //Check stuff

    setFlipping(true);
    setMessage("Throuing up a coin...");
    setSide(null);

    try {
      const res = await fetch("/api/coin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          bet: bet,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSide(data.result);
        setCredits(data.credits);

        if (data.result === playerChoice) {
          setMessage(`🎉 You guessed it right! You won ${bet * 2} credits!`);
        } else {
          setMessage(`💸 You guessed wrong... Lost ${bet} credits`);
        }
      } else {
        setMessage(data.error || "Error!");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server Error!");
    } finally {
      setTimeout(() => setFlipping(false), 1000);
    }
  };

  const handleChoice = (choice) => {
    setPlayerChoice(choice);
    setMessage("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-100 to-blue-600 p-6">
      <div className="bg-white text-gray-800 rounded-3xl shadow-2xl w-[500px] min-h-[500px] p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center">Coin Flip</h2>

        <p className="text-center text-lg">
          Balance: <span className="font-semibold">{credits}</span> credits
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: "12px",
          }}
        >
          {numArr.map((i) => (
            <button
              style={{
                backgroundColor: "RoyalBlue",
                borderRadius: 25,
                color: "white",
              }}
              onClick={() => setBet(i)}
            >
              {i}
            </button>
          ))}
        </div>

        {!flipping && (
          <div className="flex justify-center gap-8">
            <button
              onClick={() => handleChoice("heads")}
              className={`py-2 px-6 rounded-full font-bold transition-all duration-200 transform 
                ${
                  playerChoice === "heads"
                    ? "bg-blue-500 scale-105 shadow-md text-white"
                    : "bg-blue-200 hover:bg-blue-300 text-gray-800"
                }`}
            >
              Heads
            </button>
            <button
              onClick={() => handleChoice("tails")}
              className={`py-2 px-6 rounded-full font-bold transition-all duration-200 transform 
                ${
                  playerChoice === "tails"
                    ? "bg-blue-500 scale-105 shadow-md text-white"
                    : "bg-blue-200 hover:bg-blue-300 text-gray-800"
                }`}
            >
              Tails
            </button>
          </div>
        )}

        <div
          style={{
            width: "150px",
            height: "150px",
            margin: "0 auto",
            perspective: "1000px",
          }}
        >
          <img
            src={`/${side || "heads"}.jpg`}
            alt={side}
            style={{
              width: "100%",
              height: "100%",
              marginTop: 20,
              transition: "transform 1s",
              transform: flipping ? "rotateY(720deg)" : "none",
              borderRadius: "9999px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          />
        </div>

        {playerChoice && (
          <button
            onClick={handleFlip}
            disabled={flipping}
            className="w-full py-3 text-white rounded-full font-bold bg-blue-500 hover:bg-blue-600 disabled:opacity-50 transition"
          >
            {flipping ? "Flipping..." : `Play for ${bet} credits`}
          </button>
        )}
        {message && (
          <p className="text-center mt-2 text-sm text-blue-800">{message}</p>
        )}
      </div>
    </div>
  );
}

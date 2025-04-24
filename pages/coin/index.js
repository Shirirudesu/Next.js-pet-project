import { useState } from "react";
import { useSession } from "next-auth/react";

const numArr = [5, 10, 50, 100];

export default function CoinFlip({ credits, setCredits }) {
  const { data: session, status } = useSession();
  const [flipping, setFlipping] = useState(false);
  const [side, setSide] = useState(null);
  const [message, setMessage] = useState("");

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
    //initiating and resests
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
        setMessage(
          data.win
            ? `🎉 You guessed it right! You won ${bet * 2} credits!`
            : `💸 You guessed wrong... Lost ${bet} credits`
        );
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-100 to-blue-600 p-6">
      <div className="bg-white text-gray-800 rounded-3xl shadow-2xl w-[500px] min-h-[500px] p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center">Coin Flip</h2>
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
                backgroundColor: "blue",
                borderRadius: 25,
                color: "white",
              }}
              onClick={() => setBet(i)}
            >
              {i}
            </button>
          ))}
        </div>

        <p className="text-center text-lg">
          Balance: <span className="font-semibold">{credits}</span> credits
        </p>

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
              transition: "transform 1s",
              transform: flipping ? "rotateY(720deg)" : "none",
              borderRadius: "9999px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          />
        </div>

        <button
          onClick={handleFlip}
          disabled={flipping}
          className="w-full py-3 rounded-full font-bold bg-blue-500 hover:bg-blue-600 disabled:opacity-50 transition"
        >
          {flipping ? "Flipping..." : `Play for ${bet} credits`}
        </button>

        {message && (
          <p className="text-center mt-2 text-sm text-blue-800">{message}</p>
        )}
      </div>
    </div>
  );
}

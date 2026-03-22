import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/User";

const symbols = ["🍒", "🍊", "🍉", "🍇", "🍓", "⭐", "7️⃣", "💎"];

const play = (bet) => {
  const getSymbol = () => {
    if (bet === 200) {
      return Math.random() < 0.02
        ? "💎"
        : symbols[Math.floor(Math.random() * (symbols.length - 1))];
    } else if (bet === 50) {
      return Math.random() < 0.05
        ? "⭐"
        : symbols[Math.floor(Math.random() * (symbols.length - 1))];
    } else {
      return Math.random() < 0.1
        ? "🍒"
        : symbols[Math.floor(Math.random() * symbols.length)];
    }
  };

  const newReels = Array(3).fill(null).map(getSymbol);

  const [a, b, c] = newReels;
  let win = false;
  let winningAmount = 0;

  if (a === b && b === c) {
    win = true;

    switch (a) {
      case "7️⃣":
        winningAmount = bet * 120;
        break;
      case "💎":
        winningAmount = bet * 80;
        break;
      case "⭐":
        winningAmount = bet * 40;
        break;
      case "🍇":
        winningAmount = bet * 20;
        break;
      case "🍓":
        winningAmount = bet * 12;
        break;
      case "🍉":
        winningAmount = bet * 8;
        break;
      case "🍊":
        winningAmount = bet * 5;
        break;
      case "🍒":
        winningAmount = bet * 3;
        break;
      default:
        winningAmount = bet * 2;
    }
  }

  // const win = newReels.every((symbol) => symbol === newReels[0]);
  return { newReels, win, winningAmount };
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, bet } = req.body;

      await connectMongoDB();

      // const resdb = await User.findOne({ email });

      const result = play(bet);
      if (result.win) {
        const totalWin = bet + result.winningAmount;

        const updatedUser = await User.findOneAndUpdate(
          { email },
          { $inc: { credits: totalWin } },
          { new: true },
        );

        // const ant = await User.updateOne(
        //   { email: email },
        //   { $inc: { credits: totalWin } },
        // );

        // return res.status(201).json({
        //   credits: resdb.credits + totalWin,
        //   result,
        //   winningAmount: result.winningAmount,
        // });

        return res.status(201).json({
          credits: updatedUser.credits,
          result,
          winningAmount: result.winningAmount,
        });
      } else {
        const updatedUser = await User.findOneAndUpdate(
          { email },
          { $inc: { credits: -bet } },
          { new: true },
        );
        // const ant = await User.updateOne(
        //   { email: email },
        //   { $inc: { credits: -bet } },
        // );
        // return res.status(201).json({ credits: resdb.credits - bet, result });
        return res.status(201).json({
          credits: updatedUser.credits,
          result,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

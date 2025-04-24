import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/User";

const symbols = ['🍒', '🍊', '🍉', '🍇', '🍓', '⭐']

const play = () => {
    const newReels = Array(3)
      .fill(null)
      .map(() => symbols[Math.floor(Math.random() * symbols.length)])
    const win = newReels.every((symbol) => symbol === newReels[0])
return {newReels, win}
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, bet } = req.body;
      await connectMongoDB();
      const resdb = await User.findOne({ email });
      const result = play()
      if (result.win) {
        const winningAmount = bet * 15
        const ant = await User.updateOne({ email: email }, { $inc: { credits:winningAmount } })
        return res.status(201).json({ credits: resdb.credits + winningAmount, result, winningAmount });
      } else {
        const ant = await User.updateOne({ email: email }, { $inc: { credits: -bet } })
        return res.status(201).json({ credits: resdb.credits - bet, result });
      }
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: "Something went wrong." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

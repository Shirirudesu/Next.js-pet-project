import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/User";
import { playCoinFlip } from "../../../lib/games/coinflip";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { email, bet } = req.body;

    if (!email || !bet) {
      return res.status(400).json({ error: "Missing data" });
    }

    await connectMongoDB();

    const user = await User.findOne({ email });

    if (!user || user.credits < bet) {
      return res.status(400).json({
        error: "Not enough credits",
      });
    }

    const game = playCoinFlip(bet, req.body.choice);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $inc: { credits: game.creditChange } },
      { new: true },
    );

    return res.status(200).json({
      result: game.result,
      win: game.win,
      credits: updatedUser.credits,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Server error" });
  }
}

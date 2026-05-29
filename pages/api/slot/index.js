import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import { playSlot } from "../../../lib/games/slot.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { email, bet } = req.body;

    await dbConnect();

    const result = playSlot(bet);

    let creditChange = 0;

    if (result.win) {
      creditChange = result.winningAmount; // только выигрыш
    } else {
      creditChange = -bet;
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $inc: { credits: creditChange } },
      { new: true },
    );

    return res.status(200).json({
      credits: updatedUser.credits,
      result,
      win: result.win,
      winAmount: result.winningAmount || 0,
      creditChange,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Something went wrong",
    });
  }
}

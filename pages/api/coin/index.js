import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, bet } = req.body;

      if (!email || !bet) {
        return res.status(400).json({ error: "Email and bet are required" });
      }

      await connectMongoDB();

      const user = await User.findOne({ email });

      if (!user || user.credits < bet) {
        return res
          .status(400)
          .json({ error: "Not enough credits or user not found" });
      }
      //0 < 0.5  == true
      //1 < 0.5 == false

      const win = Math.random() < 0.5; // true or false
      const result = win ? "heads" : "tails";

      const creditChange = win ? bet * 2 : -bet;

      await User.updateOne(
        { email: email },
        { $inc: { credits: creditChange } }
      );

      return res.status(200).json({
        result,
        win,
        credits: user.credits + creditChange,
      });
    } catch (err) {
      console.error("Coin flip API error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

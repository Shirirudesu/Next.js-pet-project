import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import User from "../../../models/User";
import { connectDB } from "../../../lib/dbConnect";

export async function POST(req) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await req.json();
  const betAmount = Number(body.betAmount);

  // Проверка допустимой ставки
  if (![5, 50, 200].includes(betAmount)) {
    return new Response(JSON.stringify({ error: "Invalid bet amount" }), {
      status: 400,
    });
  }

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });
  }

  if (user.credits < betAmount) {
    return new Response(JSON.stringify({ error: "Not enough credits" }), {
      status: 400,
    });
  }

  user.credits -= betAmount;

  const win = Math.random() < 0.4;

  if (win) {
    user.credits += betAmount * 2;
  }

  await user.save();

  return new Response(
    JSON.stringify({
      win,
      newCredits: user.credits,
      message: win
        ? `You won! +${betAmount * 2} credits`
        : `You lost! -${betAmount} credits`,
    }),
    { status: 200 },
  );
}

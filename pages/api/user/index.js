import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/User";
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, email } = req.body;
      console.log("Hi 222")
      await connectMongoDB();
      const resdb = await User.create({ name, email, roleId: 0 });
      console.log(resdb)
      return res.status(201).json({ message: "User Registered" });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: "Something went wrong." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

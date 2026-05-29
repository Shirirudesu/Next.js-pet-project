import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import Article from "../../../models/Article";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email } = req.body;
      const unlockId = req.query.id;
      await dbConnect();

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User is not found" });

      if (!unlockId) {
        const articles = await Article.find();

        const unlocked = user.unlockedArticles || [];
        const mapped = articles.map((a) => ({
          id: a._id,
          title: a.title,
          isUnlocked: unlocked.includes(a._id.toString()),
          cost: 10,
        }));

        return res.status(200).json({
          articles: mapped,
          credits: user.credits,
        });
      }

      const articleId = unlockId;
      const isAlreadyUnlocked = user.unlockedArticles?.includes(articleId);

      if (isAlreadyUnlocked) {
        return res.status(200).json({
          newCredits: user.credits,
          message: "Article is already unblocked",
        });
      }

      if (user.credits < 10) {
        return res.status(400).json({ error: "Not enough credits" });
      }

      const updatedUser = await User.findOneAndUpdate(
        { email },
        {
          $inc: { credits: -10 },
          $push: { unlockedArticles: articleId },
        },
        { new: true }
      );

      return res.status(200).json({
        newCredits: updatedUser.credits,
        success: true,
      });
    } catch (error) {
      console.error("API Error:", error);
      return res.status(500).json({ error: "Server Error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const articleId = req.query.id;
      if (!articleId) {
        return res.status(400).json({ error: "Article ID is required" });
      }

      await dbConnect();
      const deleted = await Article.findByIdAndDelete(articleId);
      if (!deleted) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      return res
        .status(200)
        .json({ success: true, message: "Article deleted" });
    } catch (error) {
      console.error("Delete error:", error);
      return res.status(500).json({ error: "Failed to delete article" });
    }
  }
  res.setHeader("Allow", ["POST", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

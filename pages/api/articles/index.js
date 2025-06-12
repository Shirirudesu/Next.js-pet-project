import dbConnect from "../../../lib/dbConnect";
import Article from "../../../models/Article";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const articles = await Article.find({});
        res.status(200).json({ success: true, data: articles });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const article = await Article.create({
          title: req.body.title,
          body: req.body.body,
          author: "Admin",
        });
        res.status(201).json({ success: true, data: article });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
      try {
        const article = await Article.updateOne(
          { _id: req.body.id },
          {
            title: req.body.title,
            body: req.body.body,
          }
        );
        res.status(201).json({ success: true, data: article });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}

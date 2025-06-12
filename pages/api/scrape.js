// pages/api/scrape.js
import { load } from "cheerio";
import User from "../../models/User";
import { connectMongoDB } from "../../lib/mongodb";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не поддерживается" });
  }

  const { url, email } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL не указан" });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = load(html);

    const title = $("h1").first().text();
    const img = $("img").first().attr("src");
    const text = $("p").first().text();
    console.log(text);
    const links = $("a")
      .map((_, el) => $(el).attr("href"))
      .get()
      .filter((href) => href && href.startsWith("http"));
    //const user = await User.findOne({ email: email });
    const ant = await User.updateOne(
      { email: email },
      { $inc: { credits: -5 } }
    );
    res.status(200).json({ title, img, text, links });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при скрейпинге" });
  }
}

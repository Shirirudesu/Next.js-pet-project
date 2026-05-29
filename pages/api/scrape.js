import { load } from "cheerio";
import User from "../../models/User";
import ScraperCache from "../../models/ScraperCache";
import dbConnect from "../../lib/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method is not supported" });
  }

  const { url, email } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is not defined" });
  }

  try {
    await dbConnect();

    let cached = await ScraperCache.findOne({ url });

    if (cached) {
      console.log("FROM CACHE");
      return res.status(200).json(cached);
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.credits < 5) {
      return res.status(400).json({ error: "Not enough credits" });
    }

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

    const publishDate = $(".article-info__publish-date").text().trim();

    const newScrape = await ScraperCache.create({
      url,
      title,
      img,
      text,
      links,
      publishDate,
    });

    user.credits -= 5;
    await user.save();

    res.status(200).json({
      title,
      img,
      text,
      links,
      publishDate,
      credits: user.credits,
    });
  } catch (error) {
    res.status(500).json({ error: "Error during scraping" });
  }
}

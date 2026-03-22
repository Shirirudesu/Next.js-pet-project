import mongoose from "mongoose";

const ScraperCacheSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true }, // чтобы один раз сохранять одну статью
  title: { type: String },
  body: { type: String },
  preview: { type: String },
  img: { type: String },
  links: { type: [String], default: [] },
  publishDate: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ScraperCache ||
  mongoose.model("ScraperCache", ScraperCacheSchema);

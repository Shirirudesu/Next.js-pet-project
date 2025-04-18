import mongoose from 'mongoose'

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: new Date(),
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    reqired: true,
  },
  likes: {
    type: Number,
  },
  dislikes: {
    type: Number,
  },
})

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema)

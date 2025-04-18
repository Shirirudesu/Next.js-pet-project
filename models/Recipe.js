import mongoose from 'mongoose'

const RecipeSchema = new mongoose.Schema({
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

export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema)


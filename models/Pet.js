import mongoose from 'mongoose'

const PetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  emailL:{
    type: String,
    unique:true,
    required:true,
  },
  birthday:{
    type:String,
    unique:true,
    required:false,
  },
  credits:{
    type: Number,
    default: 0,
  },
  owner_name: {
    type: String,
    required: true,
  },
  species: {
    type: String,
    required: true
  },
  age: {
    type: Number,
  },
  poddy_trained: {
    type: Boolean,
  },
  diet: {
    type: Array,
  },
  image_url: {
    required: true,
    type: String,
  },
  likes: {
    type: Array,
  },
  dislikes: {
    type: Array,
  },
})

export default mongoose.models.Pet || mongoose.model('Pet', PetSchema)

// import mongoose from 'mongoose'
// // role 0 - admin
// //role 1 - user
// //role 2 - writer


// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   roleId: {
//     type: Number,
//     required: true
//   },
//   email:{
//     type: String,
//     unique:true,
//     required:true,
//   },
//   credits:{
//     type: Number,
//     default: 0,
//   },
//   image_url: {
//     required: true,
//     type: String,
//   },
//   products: {
//     type: Array,

//   },
//   likes: {
//     type: Array,
//   },
//   dislikes: {
//     type: Array,
//   },
// })

// export default mongoose.models.User || mongoose.model('User', UserSchema)

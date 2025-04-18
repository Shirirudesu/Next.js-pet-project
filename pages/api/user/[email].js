import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/User";

export default async function handler(req, res) {
  const {
    query: { email },
    method,
  } = req

  await connectMongoDB()

  switch (method) {
    case 'GET' :
      try {
        console.log("im here")
        const pet = await User.findOne({email:email})
        console.log(pet)
        if (!pet) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: pet })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'PUT' /* Edit a model by its ID */:
      try {
        const pet = await User.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        })
        if (!pet) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: pet })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'DELETE' /* Delete a model by its ID */:
      try {
        const deletedPet = await User.deleteOne({ _id: id })
        if (!deletedPet) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: {} })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    default:
      res.status(400).json({ success: false })
      break
  }
}

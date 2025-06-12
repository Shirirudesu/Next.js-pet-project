// role 0 - admin
//role 1 - user
//role 2 - writer
import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      default: 0,
    },
    roleId: {
      type: Number,
      required: true,
    },
    unlockedArticles: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);
export default mongoose.models.User || mongoose.model("User", UserSchema);

import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  role: {
    type: String,
    required: [true, "Type of role is required"],
    default: "User",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Role = mongoose.model("Role", roleSchema);

export default Role;

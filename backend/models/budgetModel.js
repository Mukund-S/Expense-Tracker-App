import mongoose from "mongoose";

let Budget;

try {
  Budget = mongoose.model("Budget");
} catch (error) {
  const budgetSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    Grocery: {
      type: Number,
      required: [true, "Budget amount is required"],
      default: 0,
    },
    Utility: {
      type: Number,
      required: [true, "Budget amount is required"],
      default: 0,
    },
    Food: {
      type: Number,
      required: [true, "Budget amount is required"],
      default: 0,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  });

  Budget = mongoose.model("Budget", budgetSchema);
}

export default Budget;

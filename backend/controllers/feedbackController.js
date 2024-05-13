// feedbackController.js

import Feedback from "../models/feedbackModel.js";
import User from "../models/UserSchema.js";

export const createFeedback = async (req, res) => {
  try {
    const { user_id, feedback, rating } = req.body;
    const newFeedback = await Feedback.create({
      user_id,
      review: feedback,
      rating,
    });
    res.status(201).json({ success: true, data: newFeedback });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get All Feedback
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate("user_id", "name email");
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get Feedback by User ID
export const getFeedbackByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const feedback = await Feedback.find({ user_id: userId });
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update Feedback
export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    }
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete Feedback
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

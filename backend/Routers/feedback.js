// feedbackRouter.js

import express from "express";
import {
  createFeedback,
  getAllFeedback,
  getFeedbackByUserId,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/", createFeedback);
router.get("/", getAllFeedback);
router.get("/:userId", getFeedbackByUserId);
router.put("/:id", updateFeedback);
router.delete("/:id", deleteFeedback);

export default router;

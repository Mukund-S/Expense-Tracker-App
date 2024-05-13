import express from "express";
import {
  createBudgetController,
  getBudgetByUserController,
  deleteBudgetController,
  updateBudgetController,
} from "../controllers/budgetController.js";

const router = express.Router();

router.post("/", createBudgetController);
router.post("/user", getBudgetByUserController);
router.delete("/:id", deleteBudgetController);
router.post("/update", updateBudgetController);

export default router;

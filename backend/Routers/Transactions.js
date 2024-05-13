import express from "express";
import {
  addTransactionController,
  deleteTransactionController,
  getAllTransactionController,
  updateTransactionController,
  getTransactionsByGroup,
  getTotalExpensesAndCreditsController,
} from "../controllers/transactionController.js";
import {
  getTransactionsByValue,
  getUsersExceedingBudgetController,
} from "../controllers/transactionController.js";
import { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/addTransaction").post(addTransactionController);

router.route("/getTransaction").post(getAllTransactionController);

router.route("/deleteTransaction/:id").post(deleteTransactionController);

router.route("/updateTransaction/:id").put(updateTransactionController);

router.route("/transactions/:currency").get(getTransactionsByValue);

router.route("/exceedingbudget").get(getUsersExceedingBudgetController);

router.get("/transactions/groupwise/:groupId", getTransactionsByGroup);

router.post("/total-expenses-credits", getTotalExpensesAndCreditsController);

export default router;

import Budget from "../models/budgetModel.js";
// Grocery, utility, food
export const createBudgetController = async (req, res) => {
  try {
    const { Grocery, Utility, Food, userId } = req.body;

    if (!Grocery || !userId || !Utility || !Food) {
      return res.status(400).json({
        success: false,
        message: "Please provide amount and user ID for the budget",
      });
    }
    const bud = await Budget.findOne({ user_id: userId });
    if (!bud) {
      const newBudget = await Budget.create({
        Grocery,
        Utility,
        Food,
        user_id: userId,
      });
      return res.status(201).json({
        success: true,
        message: "Budget created successfully",
        budget: newBudget,
      });
    } else {
      bud.Grocery = Grocery;
      bud.Utility = Utility;
      bud.Food = Food;

      await bud.save();
      return res.status(200).json({
        success: true,
        message: "Budget updated successfully",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getBudgetByUserController = async (req, res) => {
  try {
    const { userId } = req.body;
    const gbudget = await Budget.findOne({ user_id: userId });
    if (!gbudget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found for the specified user",
      });
    }

    return res.status(200).json({
      success: true,
      budget: gbudget,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteBudgetController = async (req, res) => {
  try {
    const budgetId = req.params.id;

    const deletedBudget = await Budget.findByIdAndDelete(budgetId);

    if (!deletedBudget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
      budget: deletedBudget,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateBudgetController = async (req, res) => {
  try {
    const { Grocery, Utility, Food, userId } = req.body;
    const details = await Budget.find({ user_id: userId });
    const updatedBudget = await Budget.findByIdAndUpdate(
      details[0]._id,
      { $set: { Grocery, Utility, Food } },
      { new: true }
    );
    if (!updatedBudget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Budget updated successfully",
      budget: updatedBudget,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

import Transaction from "../models/TransactionModel.js";
import User from "../models/UserSchema.js";
import Location from "../models/locationModel.js";
import Budget from "../models/budgetModel.js";
import Group from "../models/groupModel.js";

import moment from "moment";

export const addTransactionController = async (req, res) => {
  try {
    const {
      title,
      amount,
      description,
      date,
      category,
      userId,
      transactionType,
      group,
    } = req.body;

    console.log(
      title,
      amount,
      description,
      date,
      category,
      userId,
      transactionType,
      group
    );

    if (
      !title ||
      !amount ||
      !description ||
      !date ||
      !category ||
      !transactionType ||
      !group
    ) {
      return res.status(408).json({
        success: false,
        messages: "Please Fill all fields",
      });
    }

    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    let newTransaction = await Transaction.create({
      title: title,
      amount: amount,
      category: category,
      description: description,
      date: date,
      user: userId,
      transactionType: transactionType,
      Group_id: group,
    });

    //user.transactions.push(newTransaction);
    if (transactionType === "credit") {
      // Update budget for the user by adding the transaction amount
      const budget = await Budget.findOneAndUpdate(
        { user_id: userId },
        { $inc: { amount: amount } }, // Increment budget amount by the transaction amount
        { new: true, upsert: true } // Create a new budget if it doesn't exist
      );
    }
    //user.save();

    return res.status(200).json({
      success: true,
      message: "Transaction Added Successfully",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};

export const getAllTransactionController = async (req, res) => {
  try {
    const { userId, type, frequency, startDate, endDate, groupId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Create a query object with the user, type, and group conditions
    const query = {
      user: userId,
    };

    if (type !== "all") {
      query.transactionType = type;
    }

    if (groupId) {
      query.Group_id = groupId;
    }
    console.log(query);
    // Add date conditions based on 'frequency' and 'custom' range
    if (frequency !== "custom") {
      query.date = {
        $gt: moment().subtract(Number(frequency), "days").toDate(),
      };
    } else if (startDate && endDate) {
      query.date = {
        $gte: moment(startDate).toDate(),
        $lte: moment(endDate).toDate(),
      };
    }
    console.log(query);
    const transactions = await Transaction.find(query);

    const currentBudget = await Budget.findOne({ user_id: userId });

    return res.status(200).json({
      success: true,
      transactions: transactions,
      budget: currentBudget,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};

export const deleteTransactionController = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const userId = req.body.userId;

    // console.log(transactionId, userId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const transactionElement = await Transaction.findByIdAndDelete(
      transactionId
    );

    if (!transactionElement) {
      return res.status(400).json({
        success: false,
        message: "transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Transaction successfully deleted`,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};

export const updateTransactionController = async (req, res) => {
  try {
    const transactionId = req.params.id;

    const {
      title,
      amount,
      description,
      date,
      category,
      transactionType,
      transgroup,
    } = req.body;

    const transactionElement = await Transaction.findById(transactionId);

    if (!transactionElement) {
      return res.status(400).json({
        success: false,
        message: "transaction not found",
      });
    }

    if (title) {
      transactionElement.title = title;
    }

    if (description) {
      transactionElement.description = description;
    }

    if (amount) {
      transactionElement.amount = amount;
    }

    if (category) {
      transactionElement.category = category;
    }
    if (transactionType) {
      transactionElement.transactionType = transactionType;
    }
    if (transgroup) {
      transactionElement.Group_id = transgroup;
    }

    if (date) {
      transactionElement.date = date;
    }

    await transactionElement.save();

    // await transactionElement.remove();

    return res.status(200).json({
      success: true,
      message: `Transaction Updated Successfully`,
      transaction: transactionElement,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};

export const getTransactionsByGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const transactions = await Transaction.find({ Group_id: groupId })
      .populate("Group_id", "Group_Name")
      .populate("user", "name email")
      .select("title amount category description transactionType date user");

    if (!transactions) {
      return res.status(404).json({
        success: false,
        message: "No transactions found for the specified group ID",
      });
    }

    res.json({
      success: true,
      transactions: transactions,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getTransactionsByValue = async (req, res) => {
  try {
    const currency = req.params.currency;
    // Fetch country from Location table
    const loc = await Location.findOne({ currency });
    if (!loc) {
      return res.status(404).json({
        success: false,
        message: "Country not found for the specified currency",
      });
    }
    // Fetch users from UserSchema table based on country
    const users = await User.find({ country: loc.country });
    // Extract user IDs
    const userIds = users.map((user) => user._id);
    // Fetch transactions associated with the retrieved user IDs
    const transactions = await Transaction.find({ user: { $in: userIds } });

    // Prepare transactions with user names
    const transactionsWithNames = await Promise.all(
      transactions.map(async (transaction) => {
        // Find user name based on user ID
        const user = await User.findById(transaction.user);
        // Construct new transaction object with user name
        const transactionWithUserName = {
          ...transaction.toJSON(),
          userName: user ? user.name : "Unknown",
        };
        return transactionWithUserName;
      })
    );

    return res.status(200).json({
      success: true,
      transactions: transactionsWithNames,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getUsersExceedingBudgetController = async (req, res) => {
  try {
    // Fetch category-wise sum of transactions for each user
    const categorySumPerUser = await Transaction.aggregate([
      {
        $group: {
          _id: "$user",
          Grocery: {
            $sum: {
              $cond: [{ $eq: ["$category", "Groceries"] }, "$amount", 0],
            },
          },
          Utility: {
            $sum: {
              $cond: [{ $eq: ["$category", "Utilities"] }, "$amount", 0],
            },
          },
          Food: {
            $sum: { $cond: [{ $eq: ["$category", "Food"] }, "$amount", 0] },
          },
        },
      },
    ]);

    // Array to store user IDs who exceed their budget
    const usersExceedingBudgetIds = [];
    // Compare category-wise sum of transactions with user budgets
    for (const userSum of categorySumPerUser) {
      const userBudget = await Budget.findOne({ user_id: userSum._id });

      if (!userBudget) {
        continue; // Skip if user has no budget
      }
      console.log(userSum);
      console.log(userBudget);
      if (
        userSum.Grocery > userBudget.Grocery ||
        userSum.Utility > userBudget.Utility ||
        userSum.Food > userBudget.Food
      ) {
        usersExceedingBudgetIds.push(userSum._id);
      }
    }

    // Fetch usernames for users who exceed their budget
    const usersExceedingBudget = await User.find(
      { _id: { $in: usersExceedingBudgetIds } },
      "name"
    );

    return res.status(200).json({
      success: true,
      usersExceedingBudget,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getTotalExpensesAndCreditsController = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch all transactions for the user
    const transactions = await Transaction.find({ user: userId });

    // Initialize variables to store total expenses and credits
    let totalExpenses = 0;
    let totalCredits = 0;

    // Iterate through transactions and sum up amounts based on transaction type
    transactions.forEach((transaction) => {
      if (transaction.transactionType === "expense") {
        totalExpenses += transaction.amount;
      } else if (transaction.transactionType === "credit") {
        totalCredits += transaction.amount;
      }
    });

    return res.status(200).json({
      success: true,
      totalExpenses,
      totalCredits,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

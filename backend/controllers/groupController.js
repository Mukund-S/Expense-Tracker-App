import Group from "../models/groupModel.js";
import User from "../models/UserSchema.js";
import Budget from "../models/budgetModel.js";

export const createGroupController = async (req, res) => {
  try {
    const { Group_Name, user } = req.body;
    const creatorId = user; //req.user.id; // Assuming you have user information stored in req.user

    if (!Group_Name) {
      return res.status(400).json({
        success: false,
        message: "Please provide Group_Name",
      });
    }

    const creator = await User.findById(creatorId);
    if (!creator) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newGroup = await Group.create({
      user: creatorId,
      Group_Name,
      Group_Members: [creator.email], // Add the creator's email as a member
    });

    return res.status(201).json({
      success: true,
      message: "Group created successfully",
      group: newGroup,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllGroupsController = async (req, res) => {
  try {
    const groups = await Group.find();

    return res.status(200).json({
      success: true,
      groups: groups,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteGroupController = async (req, res) => {
  try {
    const groupId = req.params.id;

    const deletedGroup = await Group.findByIdAndDelete(groupId);

    if (!deletedGroup) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Group deleted successfully",
      group: deletedGroup,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateGroupController = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { Group_Name } = req.body;

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { Group_Name },
      { new: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Group updated successfully",
      group: updatedGroup,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const joinGroupController = async (req, res) => {
  try {
    const { Group_Name, userId } = req.body;
    // const groupId = req.params.id;
    // const userId = req.body.userId; // Assuming the user ID is provided in the request body

    // const group = await Group.findOne({ Group_Name });
    const group = await Group.findById(Group_Name);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (group.Group_Members.includes(user.email)) {
      return res.status(400).json({
        success: false,
        message: "User already a member of this group",
      });
    }

    group.Group_Members.push(user.email);
    await group.save();

    return res.status(200).json({
      success: true,
      message: "User joined the group successfully",
      group: group,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GroupController.js

export const getGroupDetailsByUserController = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by userId to get their email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userEmail = user.email;

    // Find all groups where the user's email is in the Group_Members array
    const groups = await Group.find({ Group_Members: userEmail });

    return res.status(200).json({
      success: true,
      message: "Group details fetched successfully",
      groups: groups,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GroupController.js

export const getJoinedGroupsController = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user by userId to get their email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userEmail = user.email;

    // Find all groups where the user's email is in the Group_Members array
    const groups = await Group.find({ Group_Members: userEmail });

    // Extract only the group names from the groups array
    //const groupNames = groups.map(group => group.Group_Name);

    return res.status(200).json({
      success: true,
      message: "Joined group names fetched successfully",
      groups: groups,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getGroupBudget = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    // Find the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Find user IDs corresponding to group members' emails
    const groupMembersEmails = group.Group_Members;
    const groupMembers = await User.find({
      email: { $in: groupMembersEmails },
    });
    const userIds = groupMembers.map((user) => user._id);

    // Calculate individual budgets for each item (Grocery, Utility, Food)
    const groupBudget = await Budget.aggregate([
      {
        $match: { user_id: { $in: userIds } },
      },
      {
        $group: {
          _id: null,
          totalGrocery: { $sum: "$Grocery" },
          totalUtility: { $sum: "$Utility" },
          totalFood: { $sum: "$Food" },
        },
      },
    ]);

    if (!groupBudget || groupBudget.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No budget found for the group",
      });
    }

    res.json({
      success: true,
      groupName: group.Group_Name,
      groupBudget: {
        totalGrocery: groupBudget[0].totalGrocery,
        totalUtility: groupBudget[0].totalUtility,
        totalFood: groupBudget[0].totalFood,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

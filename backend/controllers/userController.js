import User from "../models/UserSchema.js";
import Role from "../models/roleModel.js";

import bcrypt from "bcrypt";

export const registerControllers = async (req, res, next) => {
  try {
    const { name, email, password, country } = req.body;

    console.log(name, email, password, country);

    if (!name || !email || !password || !country) {
      return res.status(400).json({
        success: false,
        message: "Please enter All Fields",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({
        success: false,
        message: "User already Exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      country,
    });

    // Create default role for the new user
    const userRole = await Role.create({
      user_id: newUser._id,
      role: "User",
    });

    return res.status(200).json({
      success: true,
      message: "User Created Successfully",
      user: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const loginControllers = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // console.log(email, password);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter All Fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Email or Password",
      });
    }

    delete user.password;

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}`,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const allUsers = async (req, res, next) => {
  try {
    const user = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "_id",
    ]);

    return res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find();

    // Create an array to store promises for populating roles
    const populatePromises = users.map(async (user) => {
      // Fetch role for each user
      const role = await Role.findOne({ user_id: user._id });

      // Create a new user object with all properties plus the role
      const newUser = {
        ...user._doc, // Spread the properties of the original user object
        role: role ? role.role : "No role assigned", // Assign role if found, otherwise assign "No role assigned"
      };

      return newUser; // Return the new user object
    });

    // Resolve all promises
    const populatedUsers = await Promise.all(populatePromises);

    return res.status(200).json({ success: true, users: populatedUsers });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

// controllers/userControllers.js

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const roleDetails = await Role.findOne({ user_id: userId });
    console.log(roleDetails);
    // Find the user by ID and delete
    const deletedUser = await User.findByIdAndDelete(userId);
    const deletedRole = await Role.findOneAndDelete({ user_id: userId });

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (!deletedRole) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const editUserDetails = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedFields = req.body;

    // Find the user by ID and update the fields
    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });

    const roleDetail = await Role.findOneAndUpdate(
      { user_id: userId },
      { role: updatedFields.role }, // Assuming 'role' is the field to be updated
      { upsert: true, new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

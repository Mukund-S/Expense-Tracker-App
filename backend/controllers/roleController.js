import Role from "../models/roleModel.js";

export const createRoleController = async (req, res) => {
  try {
    const { user_id, role } = req.body;

    if (!user_id && !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide title for the role",
      });
    }

    const newRole = await Role.create({
      user_id,
      role
    });

    return res.status(201).json({
      success: true,
      message: "Role created successfully",
      role: newRole,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllRolesController = async (req, res) => {
  try {
    const roles = await Role.find();

    return res.status(200).json({
      success: true,
      roles: roles,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteRoleController = async (req, res) => {
  try {
    const roleId = req.params.id;

    const deletedRole = await Role.findByIdAndDelete(roleId);

    if (!deletedRole) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Role deleted successfully",
      role: deletedRole,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateRoleController = async (req, res) => {
  try {
    const roleId = req.params.id;
    const { title, description } = req.body;

    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      { title, description },
      { new: true }
    );

    if (!updatedRole) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      role: updatedRole,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

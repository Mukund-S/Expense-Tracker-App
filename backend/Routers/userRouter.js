import express from "express";
import {
  loginControllers,
  registerControllers,
  getAllUsers,
  deleteUser,
  editUserDetails,
} from "../controllers/userController.js";

const router = express.Router();

console.log("Entered Controller File.");

router.route("/register").post(registerControllers);

router.route("/login").post(loginControllers);

router.route("/").get(getAllUsers);

router.delete("/:id", deleteUser);

router.put("/:id", editUserDetails);

router.patch("/:id", editUserDetails);

export default router;

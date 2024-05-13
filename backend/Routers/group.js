import express from "express";
import {
  createGroupController,
  getAllGroupsController,
  deleteGroupController,
  updateGroupController,
  joinGroupController,
  getGroupDetailsByUserController,
  getJoinedGroupsController,
  getGroupBudget,
} from "../controllers/groupController.js";

const router = express.Router();

router.post("/", createGroupController);
router.get("/", getAllGroupsController);
router.delete("/:id", deleteGroupController);
router.put("/:id", updateGroupController);
router.post("/join", joinGroupController);
router.get("/user", getGroupDetailsByUserController);
router.post("/joined", getJoinedGroupsController);
router.get("/budget/:groupId", getGroupBudget);

export default router;

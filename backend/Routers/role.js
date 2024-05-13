import express from 'express';
import {
  createRoleController,
  getAllRolesController,
  deleteRoleController,
  updateRoleController,
} from '../controllers/roleController.js';

const router = express.Router();

router.post('/', createRoleController);
router.get('/', getAllRolesController);
router.delete('/:id', deleteRoleController);
router.put('/:id', updateRoleController);

export default router;

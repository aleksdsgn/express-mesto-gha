import { Router } from 'express';

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatarUser,
} from '../controllers/users.js';

export const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatarUser);

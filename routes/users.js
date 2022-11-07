import { Router } from 'express';

import {
  getUsers,
  getUserById,
  updateUser,
  updateAvatarUser,
} from '../controllers/users.js';

export const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatarUser);

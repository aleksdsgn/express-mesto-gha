import { Router } from 'express';

import {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatarUser,
} from '../controllers/users.js';

export const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.get('/me', getCurrentUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatarUser);

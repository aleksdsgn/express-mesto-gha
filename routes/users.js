import { Router } from 'express';
import {
  celebrateParamsRouteMe,
  celebrateBodyProfile,
  celebrateBodyAvatar,
} from '../validators/users.js';

import {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatarUser,
} from '../controllers/users.js';

export const router = Router();

// получить всех пользователей
router.get('/', getUsers);

// получить конкретного пользователя
router.get('/:userId', celebrateParamsRouteMe, getUserById);

// получить данные текущего пользователя
router.get('/me', celebrateParamsRouteMe, getCurrentUser);

// обновить данные текущего пользователя
router.patch('/me', celebrateBodyProfile, updateUser);

// обновить аватар текущего пользователя
router.patch('/me/avatar', celebrateBodyAvatar, updateAvatarUser);

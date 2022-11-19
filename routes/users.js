import { Router } from 'express';
import {
  celebrateParamsRouteMe,
  celebrateBodyProfile,
  celebrateBodyAvatar,
} from '../validators/users.js';

import {
  getUsers,
  getCurrentUser,
  getOneUser,
  updateUser,
  updateAvatarUser,
} from '../controllers/users.js';

export const router = Router();

// получить всех пользователей
router.get('/', getUsers);

// получить текущего пользователя
router.get('/me', getCurrentUser);

// получить конкретного пользователя в том числе текущего
router.get('/:userId', celebrateParamsRouteMe, getOneUser);

// обновить данные текущего пользователя
router.patch('/me', celebrateBodyProfile, updateUser);

// обновить аватар текущего пользователя
router.patch('/me/avatar', celebrateBodyAvatar, updateAvatarUser);

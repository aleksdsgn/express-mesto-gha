import { Router } from 'express';
import {
  celebrateBodyAuth,
  celebrateBodyUser,
} from '../validators/users.js';
import { router as userRouter } from './users.js';
import { router as cardRouter } from './cards.js';
import { login, register } from '../controllers/users.js';
import { auth } from '../middlewares/auth.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export const router = Router();

// роуты, не требующие авторизации
router.post('/signin', celebrateBodyAuth, login);
router.post('/signup', celebrateBodyUser, register);

// роуты, которым авторизация нужна
router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

// обработка неправильного пути
router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Путь не найден'));
});

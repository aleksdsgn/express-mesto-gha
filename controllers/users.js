import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { ServerError } from '../errors/ServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import { ConflictError } from '../errors/ConflictError.js';

// получить всех пользователей
export const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      next(new ServerError(err.message));
    });
};

// получить информацию о текущем пользователе
export const getCurrentUser = (req, res, next) => {
  // const userId = (req.params.userId === 'me') ? req.user._id : req.params.userId;
  console.log('getCurrentUser');
  User.findById(req.user._id)
    .then((user) => {
      console.log('getCurrentUser');
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundError('Пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(err.message));
      } else {
        next(new ServerError(err.message));
      }
    });
};

// получить информацию о текущем пользователе или любом другом
export const getOneUser = (req, res, next) => {
  // const userId = (req.params.userId === 'me') ? req.user._id : req.params.userId;

  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundError('Пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(err.message));
      } else {
        next(new ServerError(err.message));
      }
    });
};

// добавить нового пользователя
export const register = (req, res, next) => {
  // сохранение в БД захешированного пароля пришедшего от пользователя
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      // замена пароля на хэш
      req.body.password = hash;
      // создание пользователя
      return User.create(req.body);
    })
    // пользователь возвращается как документ
    .then((document) => {
      const user = document.toObject();
      delete user.password;
      // возвращем пользователя без пароля
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
        // проверка на пользователя с существующим email в БД
      } else if (err.code === 11000) {
        next(new ConflictError(err.message));
      } else {
        next(new ServerError(err.message));
      }
    });
};

// вход для существующего пользователя
export const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const { JWT_SALT } = req.app.get('config');
      const token = jwt.sign({ _id: user._id }, JWT_SALT, { expiresIn: '7d' });

      // отправим токен, браузер сохранит его в куках
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ token });
    })
    .catch((err) => {
      // ошибка аутентификации
      next(new UnauthorizedError(err.message));
    });
};

// обновить текстовые данные пользователя
export const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundError('Пользователь не найден.'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(new ServerError(err.message));
      }
    });
};

// обновить аватар пользователя
export const updateAvatarUser = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundError('Пользователь не найден.'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(new ServerError(err.message));
      }
    });
};

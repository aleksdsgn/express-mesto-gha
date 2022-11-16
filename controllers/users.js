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

// получить одного пользователя по id
export const getUserById = (req, res, next) => {
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
export const createUser = (req, res, next) => {
  // const {
  //   name,
  //   about,
  //   avatar,
  //   email,
  //   password,
  // } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((userDocument) => {
      const user = userDocument.toObject();
      delete user.password;
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

// обновить текстовые данные пользователя
export const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  // Model.findByIdAndUpdate(id, { name: 'jason bourne' }, options, callback)
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

// вход для существующего пользователя
export const login = (req, res, next) => {
  console.log('вызываем логин');
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // console.log('вызываем логин');

      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      // res.send({ token });
      // отправим токен, браузер сохранит его в куках
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      // ошибка аутентификации
      next(new UnauthorizedError(err.message));
    });
};

// получить информацию о текущем пользователе
export const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
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

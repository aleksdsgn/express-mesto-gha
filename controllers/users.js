import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { constants } from 'http2';
import { User } from '../models/user.js';

// ошибка запроса
const responseBadRequestError400 = (res) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send({
    message: 'Некорректные данные для пользователя.',
  });

// ошибка авторизации
const responseUnauthorized401 = (res) => res
  .status(constants.HTTP_STATUS_UNAUTHORIZED)
  .send({
    message: 'Неправильные почта или пароль.',
  });

// ошибка поиска по id
// const responseNotFoundError404 = (res, message) => res
//   .status(constants.HTTP_STATUS_NOT_FOUND)
//   .send({
//     message: `Пользователь не найден. ${message}`,
//   });

// ошибка сервера
const responseServerError500 = (res) => res
  .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
  .send({
    message: 'На сервере произошла ошибка.',
  });

// получить всех пользователей
export const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      responseServerError500(res, err.message);
    });
};

// получить одного пользователя по id
export const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({
            message: 'Пользователь не найден.',
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        responseBadRequestError400(res, err.message);
      } else {
        responseServerError500(res, err.message);
      }
    });
};

// добавить нового пользователя
export const createUser = (req, res) => {
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
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseBadRequestError400(res, err.message);
      } else {
        responseServerError500(res, err.message);
      }
    });
};

// обновить текстовые данные пользователя
export const updateUser = (req, res) => {
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
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({
            message: 'Пользователь не найден.',
          });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseBadRequestError400(res, err.message);
      } else {
        responseServerError500(res, err.message);
      }
    });
};

// обновить аватар пользователя
export const updateAvatarUser = (req, res) => {
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
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({
            message: 'Пользователь не найден.',
          });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseBadRequestError400(res, err.message);
      } else {
        responseServerError500(res, err.message);
      }
    });
};

// вход для существующего пользователя
export const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
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
      responseUnauthorized401(res, err.message);
    });
};

// получить информацию о текущем пользователе
export const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({
            message: 'Пользователь не найден.',
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        responseBadRequestError400(res, err.message);
      } else {
        responseServerError500(res, err.message);
      }
    });
};

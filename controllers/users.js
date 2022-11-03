import { constants } from 'http2';
import { User } from '../models/user.js';

// ошибка запроса
const responseBadRequestError = (res, message) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send({
    message: 'Некорректные данные для пользователя.',
  });

// ошибка поиска по id
// const responseNotFoundError = (res, message) => res
//   .status(constants.HTTP_STATUS_NOT_FOUND)
//   .send({
//     message: `Пользователь не найден. ${message}`,
//   });

// ошибка сервера
const responseServerError = (res, message) => res
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
      responseServerError(res, err.message);
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
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

// добавить нового пользователя
export const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.message);
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
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.message);
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
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

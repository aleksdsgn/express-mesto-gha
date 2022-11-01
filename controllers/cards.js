import { constants } from 'http2';
import { Card } from '../models/card.js';

// ошибка запроса
const responseBadRequestError = (res, message) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send({
    message: `Некорректные данные карточкм. ${message}`,
  });

// ошибка поиска по id
// const responseNotFoundError = (res, message) => res
//   .status(constants.HTTP_STATUS_NOT_FOUND)
//   .send({
//     message: `Карточка не найдена. ${message}`,
//   });

// ошибка сервера
const responseServerError = (res, message) => res
  .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
  .send({
    message: `На сервере произошла ошибка. ${message}`,
  });

// получить все карточки
export const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      responseServerError(res, err.message);
    });
};

// создать новую карточку
export const createCard = (req, res) => {
  const { name, link } = req.body;
  const newCard = { name, link, owner: req.user._id };
  Card.create(newCard)
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseBadRequestError(res, err.message);
      } else {
        responseServerError(res, err.message);
      }
    });
};

// удаление карточки
export const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({
            message: 'Карточка не найдена.',
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

// поставить лайк карточке
export const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({
            message: 'Карточка не найдена.',
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

// убрать лайк с карточки
export const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // удалить _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({
            message: 'Карточка не найдена.',
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

import { Card } from '../models/card.js';
import { ServerError } from '../errors/ServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';

// получить все карточки
export const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      next(new ServerError('Произошла ошибка на сервере'));
    });
};

// создать новую карточку
export const createCard = (req, res, next) => {
  console.log('запуск createCard');
  const { name, link } = req.body;
  const newCard = { name, link, owner: req.user._id };
  console.log(newCard);

  Card.create(newCard)
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new ServerError('Произошла ошибка на сервере'));
      }
    });
};

// удаление карточки
export const deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((document) => {
      if (document) {
        const card = document.toObject();
        if (card.owner.toString() === req.user._id) {
          document.remove()
            .then(() => {
              res.send({ data: card });
            })
            .catch(next);
        } else next(new ForbiddenError('Удалить можно только свои карточки'));
      } else next(new NotFoundError('Карточка не найдена'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new ServerError('Произошла ошибка на сервере'));
      }
    });
};

// удаление карточки
// export const deleteCardById = (req, res, next) => {
//   Card.findById(req.params.cardId)
//     .then((card) => {
//       if (!card) {
//         throw new NotFoundError('Карточка не найдена');
//       } if (req.user._id !== String(card.owner)) {
//         throw new ForbiddenError('Удалить можно только свои карточки');
//       }
//       return Card.findByIdAndRemove(req.params.cardId)
//         .then(() => res.send({ message: 'Карточка удалена' }));
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError(err.message));
//       } else {
//         next(new ServerError(err.message));
//       }
//     });
// };

// поставить лайк карточке
export const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        next(new NotFoundError('Карточка не найдена.'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new ServerError('Произошла ошибка на сервере'));
      }
    });
};

// убрать лайк с карточки
export const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // удалить _id из массива
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        next(new NotFoundError('Карточка не найдена.'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new ServerError('Произошла ошибка на сервере'));
      }
    });
};

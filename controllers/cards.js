import { Card } from '../models/card.js';

export const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Произошла ошибка' });
    });
};

export const createCard = (req, res) => {
  const { name, link } = req.body;
  const newCard = { name, link, owner: req.user._id };
  Card.create(newCard)
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(400)
        .send({ message: 'Произошла ошибка' });
    });
};

export const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      res.send({ data: card });
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Произошла ошибка' });
    });
};

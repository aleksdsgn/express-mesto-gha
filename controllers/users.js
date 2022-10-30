import { User } from '../models/user.js';

export const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Произошла ошибка' });
    });
};

export const getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Произошла ошибка' });
    });
};

export const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(400)
        .send({ message: 'Произошла ошибка' });
    });
};

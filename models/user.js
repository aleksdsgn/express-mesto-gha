import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
// import { schemeAvatar, schemeEmail } from '../validators/user.js';

const avatarRegex = /^https?:\/\/.+$/;
const emailRegex = /^.+@.+$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      // валидация через Joi
      // validator: (value) => !schemeAvatar.validate(value).error,
      // message: (props) => `${props.value} Проверьте корректность ссылки`,
      // проверка регуяркой
      validator: (value) => avatarRegex.test(value),
      message: (props) => `${props.value} Проверьте корректность ссылки`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      // валидация через Joi
      // validator: (value) => !schemeEmail.validate(value).error,
      // message: (props) => `${props.value} Проверьте правильность написания почты`,
      // проверка регуяркой
      validator: (value) => emailRegex.test(value),
      message: (props) => `${props.value} Проверьте правильность написания почты`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  // ищем пользователя по почте
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

export const User = mongoose.model('user', userSchema);

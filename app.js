import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { constants } from 'http2';
import { router as userRouter } from './routes/users.js';
import { router as cardRouter } from './routes/cards.js';

const { PORT = 3000 } = process.env;

// обработка необработанных ошибок
process.on('unhandledRejection', (err) => {
  // логирование
  console.error(err);
  // выход из приложения с ошибкой
  process.exit(1);
});

const app = express();

app.use(bodyParser.json());

// временно захардкодили авторизацию
app.use((req, res, next) => {
  req.user = {
    _id: '635e70b108c00e097deabfca',
  };

  // псевдоавторизация
  if (Object.prototype.hasOwnProperty.call(req.headers, 'authorization')) {
    req.user._id = req.headers.authorization;
  }

  // в оригинале было так
  // if (req.headers.hasOwnProperty('authorization')) {
  //   req.user._id = req.headers['authorization'];
  // }

  // или
  // if (req.headers['Authorization'] || req.headers['authorization']) {
  //   req.user._id = req.headers['Authorization'] || req.headers['authorization'];
  // }

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

// обработка неправильного пути
app.use((req, res) => {
  res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Путь не найден' });
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const server = app.listen(PORT, () => {
  console.log(`Приложение прослушивает порт ${PORT}`);
});

// намеренная остановка сервера
const stop = async () => {
  await mongoose.connection.close();
  server.close();
  // выход из приложения без ошибки
  process.exit(0);
};

process.on('SIGTERM', stop);
process.on('SIGINT', stop);

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { constants } from 'http2';
import { router as userRouter } from './routes/users.js';
import { router as cardRouter } from './routes/cards.js';
import { login, createUser } from './controllers/users.js';
import { auth } from './middlewares/auth.js';

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

// роуты, не требующие авторизации
app.post('/signin', login);
app.post('/signup', createUser);

// роуты, которым авторизация нужна
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

// обработка неправильного пути
app.use((req, res) => {
  res
    .status(constants.HTTP_STATUS_NOT_FOUND)
    .send({ message: 'Путь не найден' });
  // res
  //   .status(constants.HTTP_STATUS_UNAUTHORIZED)
  //   .send({ message: 'Неправильные почта или пароль.' });
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

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
// import { constants } from 'http2';
import { errors } from 'celebrate';
import {
  celebrateBodyAuth,
  celebrateBodyUser,
} from './validators/users.js';
import { router as userRouter } from './routes/users.js';
import { router as cardRouter } from './routes/cards.js';
import { login, createUser } from './controllers/users.js';
import { auth } from './middlewares/auth.js';
import { NotFoundError } from './errors/NotFoundError.js';

// const { PORT = 3000 } = process.env;

// обработка необработанных ошибок
process.on('unhandledRejection', (err) => {
  // логирование
  console.error(err);
  // выход из приложения с ошибкой
  process.exit(1);
});

const config = dotenv.config({ path: path.resolve('.env.common') }).parsed;

const app = express();

app.set('config', config);
app.use(bodyParser.json());

// роуты, не требующие авторизации
app.post('/signin', celebrateBodyAuth, login);
app.post('/signup', celebrateBodyUser, createUser);

// роуты, которым авторизация нужна
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

// обработка неправильного пути
app.use('*', (req, res, next) => {
  next(new NotFoundError('Путь не найден'));
});

// перехватывает ошибки и передает их наружу
app.use(errors());

// app.use((err, req, res, next) => {
//   res.status(err.statusCode).send({ message: err.message });
//   next();
// });
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = status === 500 ? 'Ошибка на сервере' : err.message;
  res.status(status).send({ message });
  next();
});

mongoose.connect(config.DB_URL);

const server = app.listen(config.PORT, () => {
  console.log(`Приложение прослушивает порт ${config.PORT}`);
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

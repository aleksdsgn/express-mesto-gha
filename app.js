import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { errors } from 'celebrate';
import { router } from './routes/index.js';

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

// подключение всех роутов
app.use(router);

// перехватывает ошибки и передает их наружу
app.use(errors());

// централизованный обработчик ошибок
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
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

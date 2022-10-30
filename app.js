import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { router as userRouter } from './routes/users.js';

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use('/users', userRouter);

app.use((req, res, next) => {
  req.user = {
    _id: '635e70b108c00e097deabfca',
  };
  next();
});

app.listen(PORT, () => {
  console.log(`Приложение прослушивает порт ${PORT}`);
});

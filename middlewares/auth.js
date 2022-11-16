import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

export const auth = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // пытаемся верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new UnauthorizedError('Токен не верифицирован'));
  }
  // записываем пейлоуд в объект запроса
  req.user = payload;

  // пропускаем запрос дальше
  next();
};

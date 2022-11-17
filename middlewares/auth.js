import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

export const auth = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization = '' } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization) {
  // if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(`Необходима авторизация ${authorization}`);
    // throw new UnauthorizedError('Необходима авторизация');
  }

  // извлечём токен
  const token = authorization.replace(/^Bearer*\s*/i, '');
  let payload;

  const { JWT_SALT } = req.app.get('config');
  try {
    // пытаемся верифицировать токен
    payload = jwt.verify(token, JWT_SALT);
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new UnauthorizedError('Токен не верифицирован 12'));
  }
  // записываем пейлоуд в объект запроса
  req.user = payload;

  // пропускаем запрос дальше
  next();
};

// Способ наставника Сергея
// export const auth = (req, res, next) => {
//   // достаём авторизационный заголовок
//   const { authorization = '' } = req.headers;

//   // убеждаемся, что он есть или начинается с Bearer
//   if (!authorization) {
//     next(new UnauthorizedError('Необходима авторизация'));
//   } else {
//     // извлечём токен
//     const token = authorization.replace(/^Bearer*\s*/i, '');
//     const { JWT_SALT } = req.app.get('config');
//     try {
//       // пытаемся верифицировать токен
//       const decoder = jwt.verify(token, JWT_SALT);
//       req.user = { _id: decoder._id };
//       next();
//     } catch (err) {
//       // отправим ошибку, если не получилось
//       next(new UnauthorizedError('Токен не верифицирован 12'));
//     }
//   }
// };

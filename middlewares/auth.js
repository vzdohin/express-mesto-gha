/* eslint-disable no-unused-expressions */
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/errors');

// const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    () => next(new UnauthorizedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    // eslint-disable-next-line no-unused-vars
    payload = jwt.verify(token, 'super-strong-secret-key');
    req.user = payload;
  } catch (err) {
    () => next(new UnauthorizedError('Ошибка авторизации'));
  }
  return next();
};

const jwt = require('jsonwebtoken');
const {
  ERROR_UNAUTHORIZED,
} = require('../errors/errors');

// const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return res.status(ERROR_UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    // eslint-disable-next-line no-unused-vars
    payload = jwt.verify(token, 'super-strong-secret-key');
    next();
  } catch (err) {
    return res.status(ERROR_UNAUTHORIZED).send({ message: 'Ошибка авторизации' });
  }
  req.user = payload;
  return next();
};

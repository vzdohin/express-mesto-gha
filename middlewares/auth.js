const jwt = require('jsonwebtoken');
const {
  ERROR_BAD_REQUEST,
} = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return res.status(ERROR_BAD_REQUEST).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer', '');
  let payload;
  try {
    // eslint-disable-next-line no-unused-vars
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    req.user = payload;
    next();
  } catch (err) {
    return res.status(ERROR_BAD_REQUEST).send({ message: 'Необходима авторизация' });
  }
};

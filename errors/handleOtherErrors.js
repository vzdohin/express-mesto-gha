const { ERROR_INTERNAL_SERVER_ERROR } = require('./errors');

module.exports.handleOtherErrors = (err, req, res, next) => {
  const { statusCode = ERROR_INTERNAL_SERVER_ERROR, message } = err;
  res
    .status(ERROR_INTERNAL_SERVER_ERROR)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};

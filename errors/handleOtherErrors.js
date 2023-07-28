const { ERROR_INTERNAL_SERVER_ERROR } = require('./errors');

module.exports.handleOtherErrors = (err, req, res, next) => {
  const { statusCode = ERROR_INTERNAL_SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === ERROR_INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};

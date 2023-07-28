module.exports.handleOtherErrors = (err, req, res) => {
  const { statusCode = 500, message } = err;
  res
    .status(500)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
};

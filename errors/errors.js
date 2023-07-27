/* eslint-disable max-classes-per-file */
const STATUS_CODE_OK = 200;
const STATUS_CODE_CREATED = 201;
const ERROR_BAD_REQUEST = 400;
const ERROR_UNAUTHORIZED = 401;
const ERROR_FORBIDDEN = 403;
const ERROR_NOT_FOUND = 404;
const ERROR_CONFLICT_REQUEST = 409;
const ERROR_INTERNAL_SERVER_ERROR = 500;

// module.exports = {
//   STATUS_CODE_OK,
//   STATUS_CODE_CREATED,
//   ERROR_BAD_REQUEST,
//   ERROR_UNAUTHORIZED,
//   ERROR_FORBIDDEN,
//   ERROR_NOT_FOUND,
//   ERROR_CONFLICT_REQUEST,
//   ERROR_INTERNAL_SERVER_ERROR,
// };

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_BAD_REQUEST;
  }
}
class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_FORBIDDEN;
  }
}
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_NOT_FOUND;
  }
}
class ConfictRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CONFLICT_REQUEST;
  }
}
class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_UNAUTHORIZED;
  }
}

function handleOtherErrors(err, req, res) {
  const { statusCode = 500, message } = err;
  res
    .status(ERROR_INTERNAL_SERVER_ERROR)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
}
module.exports = {
  STATUS_CODE_OK,
  STATUS_CODE_CREATED,
  ERROR_BAD_REQUEST,
  ERROR_UNAUTHORIZED,
  ERROR_FORBIDDEN,
  ERROR_NOT_FOUND,
  ERROR_CONFLICT_REQUEST,
  ERROR_INTERNAL_SERVER_ERROR,
  handleOtherErrors,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ConfictRequestError,
  UnauthorizedError,
};

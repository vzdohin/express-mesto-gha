/* eslint-disable consistent-return */
const User = require('../models/user');
const {
  STATUS_CODE_OK,
  STATUS_CODE_CREATED,
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER_ERROR,
} = require('../errors/errors');

// создать пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CODE_CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastomError' || err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некоректные данные' });
      } return res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// получить всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_CODE_OK).send({ data: users }))
    .catch((err) => {
      if (err.name === 'CastomError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некоректные данные' });
      } return res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// получить пользователя по айди
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      res.status(STATUS_CODE_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastomError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некоректные данные' });
      } return res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// обновить информацию профиля
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(STATUS_CODE_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastomError' || err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некоректные данные' });
      } return res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// обновить аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((ava) => res.status(STATUS_CODE_OK).send({ data: ava }))
    .catch((err) => {
      if (err.name === 'CastomError' || err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некоректные данные' });
      } return res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

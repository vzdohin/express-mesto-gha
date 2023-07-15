/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const Card = require('../models/card');
const {
  STATUS_CODE_OK,
  STATUS_CODE_CREATED,
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER_ERROR,
} = require('../errors/errors');

// создать карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  // const owner = req.user._id;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CODE_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некоректные данные' });
      } return res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// получить все карточки
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(STATUS_CODE_OK).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некоректные данные' });
      } return res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// удалить карточку
module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      res.status(STATUS_CODE_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некоректные данные' });
      } return res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// лайк
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      res.status(STATUS_CODE_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некоректные данные' });
      } return res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// убрать лайк
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      res.status(STATUS_CODE_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некоректные данные' });
      } return res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

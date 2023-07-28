/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const Card = require('../models/card');
const {
  STATUS_CODE_OK,
  STATUS_CODE_CREATED,
  ERROR_BAD_REQUEST,
  ERROR_FORBIDDEN,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER_ERROR,
} = require('../errors/errors');

const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ConfictRequestError,
  UnauthorizedError,
} = require('../errors/errors');

// создать карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  console.log(req);
  // const owner = req.user._id;
  Card.create({ name, link, owner: req.user.userId })
    .then((card) => res.status(STATUS_CODE_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некоректные данные'));
      }
      next(err);
    });
};

// получить все карточки
module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(STATUS_CODE_OK).send({ data: cards }))
    .catch((err) => {
      // if (err.name === 'CastError' || err.name === 'ValidationError') {
      //   next(new BadRequestError('Переданы некоректные данные'));
      // }
      next(err);
    });
};

// // удалить карточку
module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      if (card.userId.toString() !== userId.toString()) {
        next(new ForbiddenError('У Вас нет прав для удаления этой карточки'));
      }
      res.status(STATUS_CODE_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некоректные данные'));
      }
      next(err);
    });
};

// лайк
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      res.status(STATUS_CODE_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некоректные данные'));
      }
      next(err);
    });
};

// убрать лайк
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      res.status(STATUS_CODE_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некоректные данные'));
      }
      next(err);
    });
};

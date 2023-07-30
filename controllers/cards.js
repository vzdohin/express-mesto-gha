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
} = require('../errors/errors');

// создать карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  // const owner = req.user._id;
  Card.create({ name, link, owner: req.user.userId })
    .then((card) => res.status(STATUS_CODE_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некоректные данные'));
      }
      next(err);
    });
};

// получить все карточки
module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(STATUS_CODE_OK).send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

// // удалить карточку
module.exports.deleteCardById = (req, res, next) => {
  // const { cardId } = req.params;
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (card.owner.toString() !== req.user.userId) {
        return next(new ForbiddenError('У Вас нет прав для удаления этой карточки'));
      }

      Card.findByIdAndRemove(req.params.cardId)
        .then(() => {
          res.status(STATUS_CODE_OK).send({ message: 'Карточка удалена' });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new BadRequestError('Переданы некоректные данные'));
          }
          next(err);
        });
    });
};

// лайк
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.userId } },
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
        return next(new BadRequestError('Переданы некоректные данные'));
      }
      next(err);
    });
};

// убрать лайк
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.userId } },
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
        return next(new BadRequestError('Переданы некоректные данные'));
      }
      next(err);
    });
};

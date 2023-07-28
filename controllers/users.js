/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  STATUS_CODE_OK,
  STATUS_CODE_CREATED,
  BadRequestError,
  NotFoundError,
  ConfictRequestError,
  UnauthorizedError,
} = require('../errors/errors');

// const { NODE_ENV, JWT_SECRET } = process.env;

// логин
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      // console.log(userId);
      const token = jwt.sign({ userId }, 'super-strong-secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .status(STATUS_CODE_OK)
        .send({
          // _id: user._id,
          // name: user.name,
          // about: user.about,
          // avatar: user.avatar,
          // email: user.email,
          token,
        });
    })
    .catch(() => next(new UnauthorizedError('Неправильные почта или пароль')));
};

// создать пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => {
      res.status(STATUS_CODE_CREATED).send({
        data: {
          name,
          about,
          avatar,
          email,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConfictRequestError('Email уже используется'));
      }
      // if (err.name === 'ValidationError') {
      //   next(new BadRequestError('Переданы некоректные данные'));
      // }
      next(err);
    });
};

// получить всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    // .orFail(() => {
    //   throw new NotFoundError('Пользователи не найдены');
    // })
    .then((users) => res.status(200).send({ users }))
    // .catch((err) => {
    //   if (err.name === 'CastError') {
    //     next(new BadRequestError('Переданы некоректные данные'));
    //   }
    //   next(err);
    // });
    .catch(next);
};

// получить пользователя по айди
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.user;

  User.findById(userId)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      if (user) { res.status(STATUS_CODE_OK).send({ user }); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некоректные данные'));
      } next(err);
    });
};
// // получить данные профиля
module.exports.getMyProfile = (req, res, next) => {
  const { userId } = req.user;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } return res.status(STATUS_CODE_OK).send(user);
    })
    .catch(next);
};

// обновить информацию профиля
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  console.log(req);
  User.findByIdAndUpdate(req.user.userId, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.status(STATUS_CODE_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некоректные данные'));
      }
      next(err);
    });
};

// обновить аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user.userId, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((ava) => res.status(STATUS_CODE_OK).send({ data: ava }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некоректные данные'));
      }
      next(err);
    });
};

/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const { NotFoundError } = require('./errors/errors');
const { handleOtherErrors } = require('./errors/handleOtherErrors');
const {
  createUser,
  login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

// набор мидлвееров для защиты
app.use(helmet());

// лимитер запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Превышено количество запросов.',
});
app.use(limiter);

// мидлвэр обработки JSON
app.use(express.json());

// мидлвэры авторизации и создания пользователя
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern(/^(http|https):\/\/(?:www\.)?[a-zA-Z0-9\.\-]+\/[a-zA-Z0-9\.\-_~:\/?#\[\]@!$&'()*+,;=]+/),
  }),
}), createUser);

// авторизация
app.use(auth);
app.use(require('./routes/users'));
app.use(require('./routes/cards'));

// eslint-disable-next-line no-unused-vars
app.use('*', (req, res) => {
  throw new NotFoundError('Страница не найдена');
});

// мидлвэр боди парсер
app.use(bodyParser.json());

// соединение с сервером
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Подключилось к MongoDB');
  })
  .catch((err) => {
    console.error('Ошибка подключения к MongoDB:', err.message);
  });

// обработчик ошибок
app.use(errors());
app.use(handleOtherErrors);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

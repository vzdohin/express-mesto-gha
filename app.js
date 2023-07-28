/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const { ERROR_NOT_FOUND } = require('./errors/errors');
const { handleOtherErrors } = require('./errors/handleOtherErrors');
const {
  createUser,
  login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

// мидлвэр обработки JSON
app.use(express.json());

// app.use((req, res, next) => {
//   res.setHeader('Content-Type', 'application/json');
//   next();
// });
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

app.use('*', (req, res) => {
  res.status(ERROR_NOT_FOUND).json({ message: 'Страница не найдена' });
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

// app.use((req, res, next) => {
//   res.setHeader('Content-Type', 'application/json');
//   next();
// });
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

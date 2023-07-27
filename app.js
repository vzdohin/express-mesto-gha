/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { ERROR_NOT_FOUND, handleOtherErrors } = require('./errors/errors');
const {
  createUser,
  login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

// мидлвэр обработки JSON
app.use(express.json());
// мидлвэры авторизации и создания пользователя

app.post('/signin', login);
app.post('/signup', createUser);

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

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { ERROR_NOT_FOUND } = require('./errors/errors');

const { PORT = 3000 } = process.env;

const app = express();

// мидлвэр временной авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '64b180906df6694f258372ce',
  };
  next();
});

// мидлвэр обработки JSON
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

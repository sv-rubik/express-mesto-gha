const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000, BASE_PATH = 'localhost' } = process.env;
const { ERROR_CODE_404_NOT_FOUND } = require('./utils/server-response-codes');

const app = express();
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

// В карточке есть поле owner для хранения её автора.
// Но в запросе клиент передаёт только имя карточки и ссылку на картинку.
// Временное решение авторизации
app.use((req, res, next) => {
  req.user = { _id: '64cdf81b492eaaf0ec5d54f8' };
  next();
});

// Добавляем middleware для разбора JSON, сначала установив body-parser
app.use(express.json());

// eslint-disable-next-line max-len
// users указывает на базовый путь для всех маршрутов, определенных внутри userRouter из файла rsoutes/users.js
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => {
  res.status(ERROR_CODE_404_NOT_FOUND).send({ message: 'Такой страницы не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on ${BASE_PATH}:${PORT}`);
});

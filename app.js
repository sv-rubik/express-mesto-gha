const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { PORT = 3000, BASE_PATH = 'localhost' } = process.env;

// защита приложения
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();
const errorsHandler = require('./middlewares/errorsHandler');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./utils/errors/NotFoundError');
const {
  validateCreateUser,
  validateLogin,
} = require('./middlewares/celebrateValidation');

app.use(helmet());
app.use(limiter);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

// Добавляем middleware для разбора JSON, сначала установив body-parser
app.use(express.json());

// Регистрация и логин (с валидацией Celebrate)
app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

// eslint-disable-next-line max-len
// users указывает на базовый путь для всех маршрутов, определенных внутри userRouter из файла routes/users.js
// auth - middleware для авторизации
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

// важно ставить обработчик ошибок после остальных midllewares и маршрутов
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on ${BASE_PATH}:${PORT}`);
});

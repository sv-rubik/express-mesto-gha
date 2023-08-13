// eslint-disable-next-line max-len
// требует импорта и использования в app.js - const { errors } = require('celebrate'); app.use(errors());
const { celebrate, Joi } = require('celebrate');

const regExp = /(www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,})/;

const validateLogin = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regExp),
    email: Joi.string().required().email().min(4)
      .max(50),
    password: Joi.string().required(),
  }),
});

// userId - это идентификатор пользователя, который в MongoDB
// представляется в виде 24-символьной шестнадцатеричной строки.
// Использование .hex() с Joi.string() гарантирует, что значение параметра userId будет представлять
// собой правильное шестнадцатеричное значение и иметь длину 24 символа.
const validateUserID = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(4)
      .max(30),
    password: Joi.string().required(),
  }),
});

const validateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(4).pattern(regExp),
  }),
});

// /////////////////////////////////////////////////////
const validateCardID = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regExp),
  }),
});

module.exports = {
  validateLogin,
  validateUserID,
  validateCreateUser,
  validateUserProfile,
  validateUserAvatar,
  validateCardID,
  validateCreateCard,
};

// файл со схемой для юзера в базе данных и экспортом модели по данной схеме
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    minlength: 4,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (correct) => validator.isURL(correct),
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (stringFromUser) => validator.isEmail(stringFromUser),
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // чтобы API не возвращал хеш пароля
  },
});

// в случае аутентификации хеш пароля нужен. Чтобы это реализовать, после вызова метода модели,
// нужно добавить вызов метода select, передав ему строку +password:
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((currentUser) => {
      if (!currentUser) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, currentUser.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return currentUser;
        });
    });
};

module.exports = mongoose.model('user', userSchema);

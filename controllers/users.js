const mongoose = require('mongoose');
// импорт модели user, сделанной по схеме userSchema
const User = require('../models/user');
const {
  ERROR_CODE_400_BAD_REQUEST,
  ERROR_CODE_404_NOT_FOUND,
  ERROR_CODE_500_SERVER,
} = require('../utils/server-response-codes');

// Получить список всех юзеров
// метод send принимает только один аргумент (обычно это строка или объект)
const getUserList = (req, res) => {
  User.find({})
    .then((usersList) => res.send({ data: usersList }))
    .catch((err) => res.status(ERROR_CODE_500_SERVER).send({ message: `Произошла ошибка ${err}` }));
};

// Получить юзера по ID
// orFail() гарантирует, что если юзер не найден, будет выброшена ошибка, а не null
const getUserByID = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((currentUser) => res.status(200).send({ data: currentUser }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(ERROR_CODE_400_BAD_REQUEST).send({ message: 'Некорректный id' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(ERROR_CODE_404_NOT_FOUND).send({ message: `Пользователь не найден ${err}` });
      } else {
        res.status(ERROR_CODE_500_SERVER).send({ message: `Произошла ошибка ${err}` });
      }
    });
};

// Создать юзера (в ответе .then((userData) => res.send({ data: userData })) вернем созданного юзера
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((userData) => res.status(200).send({ data: userData }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_CODE_400_BAD_REQUEST).send({ message: `Переданы некорректные данные ${err}` });
      } else {
        res.status(ERROR_CODE_500_SERVER).send({ message: `Произошла ошибка ${err}` });
      }
    });
};

// Обновить профиль юзера
// Параметр { new: true }, чтобы ответ возвращал обновленные данные
// Параметр {runValidators: true} запустит валидацию схемы при обновлении данных
const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((updatedUserData) => res.status(200).send({ data: updatedUserData }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_CODE_400_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(ERROR_CODE_404_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(ERROR_CODE_500_SERVER).send({ message: `Произошла ошибка ${err}` });
      }
    });
};

// Обновить аватар юзера
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((updatedUserAvatar) => res.status(200).send({ data: updatedUserAvatar }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_CODE_400_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(ERROR_CODE_404_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(ERROR_CODE_500_SERVER).send({ message: `Произошла ошибка ${err}` });
      }
    });
};

module.exports = {
  getUserList, getUserByID, createUser, updateUserProfile, updateUserAvatar,
};

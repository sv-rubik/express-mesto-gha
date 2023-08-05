// импорт модели card, сделанной по схеме cardSchema
const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  ERROR_CODE_400_BAD_REQUEST,
  ERROR_CODE_404_NOT_FOUND,
  ERROR_CODE_500_SERVER,
} = require('../utils/server-response-codes');

// Получить список всех карточек
const getCardsList = (req, res) => {
  Card.find({})
    .then((cardsList) => res.status(200).send({ data: cardsList }))
    .catch((err) => {
      res.status(ERROR_CODE_500_SERVER).send({ message: `Произошла ошибка сервера ${err}` });
    });
};

// Создать новую карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cardData) => res.send({ data: cardData }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_CODE_400_BAD_REQUEST).send({ message: `Переданы некорректные данные ${err}` });
      } else {
        res.status(ERROR_CODE_500_SERVER).send({ message: `Произошла ошибка ${err}` });
      }
    });
};

// Удалить карточку
const deleteCardByID = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((currentCard) => res.send({ data: currentCard }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_CODE_404_NOT_FOUND).send({ message: `Карточка не найдена ${err}` });
      } else {
        res.status(ERROR_CODE_500_SERVER).send({ message: `Произошла ошибка ${err}` });
      }
    });
};

// Поставить карточке лайк
const likeCardByID = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((currentCard) => res.send({ data: currentCard }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_CODE_400_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(ERROR_CODE_404_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.status(ERROR_CODE_500_SERVER).send({ message: `Произошла ошибка ${err}` });
      }
    });
};

// Удалить лайк с карточки
const deleteLikeFromCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((currentCard) => res.send({ data: currentCard }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_CODE_400_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(ERROR_CODE_404_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.status(ERROR_CODE_500_SERVER).send({ message: `Произошла ошибка ${err}` });
      }
    });
};

module.exports = {
  getCardsList, createCard, deleteCardByID, likeCardByID, deleteLikeFromCard,
};

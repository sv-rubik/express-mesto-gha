// импорт модели card, сделанной по схеме cardSchema
const mongoose = require('mongoose');
const Card = require('../models/card');

const BadRequestError = require('../utils/errors/BadRequestError'); // 400
const ForbiddenError = require('../utils/errors/ForbiddenError'); // 403
const NotFoundError = require('../utils/errors/NotFoundError'); // 404

// Получить список всех карточек
const getCardsList = (req, res, next) => {
  Card.find({})
    .then((cardsList) => res.status(200).send({ data: cardsList }))
    .catch((err) => next(err));
};

// Создать новую карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cardData) => res.send({ data: cardData }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else { next(err); }
    });
};

// Удалить карточку
const deleteCardByID = (req, res, next) => {
  Card.findById(req.params.cardId)
    // .orFail()
    .then((currentCard) => {
      if (!currentCard) { return next(new NotFoundError('Карточка не найдена')); }
      if (!currentCard.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Удалить можно только свою карточку'));
      }
      return Card.findByIdAndDelete(req.params.cardId)
        .orFail(() => new Error('Карточка не найдена'))
        .then(() => { res.send({ message: 'Карточка удалена' }); });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Передан некорректный ID'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка не найдена'));
      } else { next(err); }
    });
};

// Поставить карточке лайк
const likeCardByID = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    // .orFail()
    .then((currentCard) => {
      if (currentCard) {
        res.send({ data: currentCard });
      } else { next(new NotFoundError('Карточка не найдена')); }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Передан некорректный ID'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка не найдена'));
      } else { next(err); }
    });
};

// Удалить лайк с карточки
const deleteLikeFromCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((currentCard) => res.send({ data: currentCard }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Передан некорректный ID'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка не найдена'));
      } else { next(err); }
    });
};

module.exports = {
  getCardsList, createCard, deleteCardByID, likeCardByID, deleteLikeFromCard,
};

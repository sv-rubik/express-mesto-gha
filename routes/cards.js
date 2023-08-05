const cardRouter = require('express').Router();

const {
  getCardsList, createCard, deleteCardByID, likeCardByID, deleteLikeFromCard,
} = require('../controllers/cards');

// require('./routes/cards') в файле app.js указывает на файл cards.js в папке routes.
// Поэтому, когда внутри cards.js определяем маршруты,
// начинающиеся с /cards, мы уже находимся в контексте этого подпути и в path не нужен '/cards'
cardRouter.get('/', getCardsList); // GET запрос будет обращаться к http://localhost:3000/cards
cardRouter.post('/', createCard); // POST запрос будет обращаться к http://localhost:3000/cards
cardRouter.delete('/:cardId', deleteCardByID); // запрос на удаление карточки будет обращаться к http://localhost:3000/cards/1
cardRouter.put('/:cardId/likes', likeCardByID); // поставить лайк по ID карточки http://localhost:3000/cards/1/likes
cardRouter.delete('/:cardId/likes', deleteLikeFromCard); // поставить лайк по ID карточки http://localhost:3000/cards/1/likes

module.exports = cardRouter;

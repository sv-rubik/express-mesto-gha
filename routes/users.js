const userRouter = require('express').Router();

const {
  getUserList, getUserByID, createUser, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

// require('./routes/users') в файле app.js указывает на файл users.js в папке routes.
// Поэтому, когда внутри users.js определяем маршруты,
// начинающиеся с /users, мы уже находимся в контексте этого подпути и в path не нужен '/users'
userRouter.get('/', getUserList); // GET запрос будет обращаться к http://localhost:3000/users
userRouter.get('/:userId', getUserByID); // GET запрос будет обращаться к http://localhost:3000/users/1
userRouter.post('/', createUser); // POST запрос будет обращаться к http://localhost:3000/users
userRouter.patch('/me', updateUserProfile);
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;

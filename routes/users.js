const userRouter = require('express').Router();

const {
  getUserList, getUserByID, updateUserProfile, updateUserAvatar, getUserProfile,
} = require('../controllers/users');

const {
  validateUserID,
  validateUserProfile,
  validateUserAvatar,
} = require('../middlewares/celebrateValidation');

// require('./routes/users') в файле app.js указывает на файл users.js в папке routes.
// Поэтому, когда внутри users.js определяем маршруты,
// начинающиеся с /users, мы уже находимся в контексте этого подпути и в path не нужен '/users'
userRouter.get('/', getUserList); // GET запрос будет обращаться к http://localhost:3000/users
userRouter.get('/:userId', validateUserID, getUserByID); // GET запрос будет обращаться к http://localhost:3000/users/1
userRouter.get('/me', getUserProfile);
// userRouter.post('/', createUser); // POST запрос будет обращаться к http://localhost:3000/users
userRouter.patch('/me', validateUserProfile, updateUserProfile);
userRouter.patch('/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = userRouter;

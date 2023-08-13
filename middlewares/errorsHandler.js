// Централизованнная обработка ошибок
// Импортируется в app.js
// из пришедшего объекта ошибки err забираем message и statusCode, а если его нет, то ставим 500
module.exports = (err, req, res, next) => {
  const { statusCode = err.status || 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    }); // проверяем статус и выставляем сообщение в зависимости от него
  next();
};

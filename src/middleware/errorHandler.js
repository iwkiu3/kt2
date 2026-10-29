const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Файл слишком большой (максимум 2 МБ)',
    });
  }

  if (err.message === 'Допустимы только JPEG и PNG изображения') {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Внутренняя ошибка сервера',
  });
};

module.exports = errorHandler;
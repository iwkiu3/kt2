const express = require('express');
const path = require('path');
const productsRouter = require('./routes/products');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const { config } = require('./config');

const app = express();

app.use(express.json());
app.use(logger);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/products', productsRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Сервер запущен на порту ${config.port}`);
});
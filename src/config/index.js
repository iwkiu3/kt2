const path = require('path');

const config = {
  port: process.env.PORT || 3000,
  uploadDir: path.join(__dirname, '../../uploads/products'),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 2 * 1024 * 1024,
};

const products = [];
let nextId = 1;

module.exports = { config, products, getNextId: () => nextId++ };
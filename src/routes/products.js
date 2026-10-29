const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { products, getNextId, config } = require('../config');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  price: Joi.number().greater(0).required(),
  category: Joi.string().valid('electronics', 'clothing', 'food', 'other').required(),
  stock: Joi.number().integer().min(0).default(0),
  description: Joi.string().max(500).allow('', null),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  price: Joi.number().greater(0),
  category: Joi.string().valid('electronics', 'clothing', 'food', 'other'),
  stock: Joi.number().integer().min(0),
  description: Joi.string().max(500).allow('', null),
});

router.get('/', (req, res) => {
  let result = [...products];

  if (req.query.category) {
    result = result.filter((p) => p.category === req.query.category);
  }

  if (req.query.minPrice) {
    result = result.filter((p) => p.price >= parseFloat(req.query.minPrice));
  }
  if (req.query.maxPrice) {
    result = result.filter((p) => p.price <= parseFloat(req.query.maxPrice));
  }

  const total = result.length;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const start = (page - 1) * limit;
  const data = result.slice(start, start + limit);

  res.json({ data, total, page, limit });
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Товар не найден' });
  }

  res.json({ success: true, data: product });
});

router.post('/', validate(createProductSchema), (req, res) => {
  const product = {
    id: getNextId(),
    ...req.body,
    imageUrl: null,
    createdAt: new Date().toISOString(),
  };

  products.push(product);
  res.status(201).json({ success: true, data: product });
});

router.put('/:id', validate(createProductSchema), (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Товар не найден' });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    id,
    createdAt: products[index].createdAt,
  };

  res.json({ success: true, data: products[index] });
});

router.patch('/:id', validate(updateProductSchema), (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Товар не найден' });
  }

  Object.assign(product, req.body);
  res.json({ success: true, data: product });
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Товар не найден' });
  }

  products.splice(index, 1);
  res.json({ success: true, message: 'Товар удалён' });
});

router.post('/:id/image', upload.single('image'), (req, res, next) => {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Товар не найден' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Файл не загружен' });
  }

  product.imageUrl = `/uploads/products/${req.file.filename}`;
  res.json({ success: true, data: product });
});

module.exports = router;
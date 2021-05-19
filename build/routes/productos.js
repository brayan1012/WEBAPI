"use strict";

var _Product = _interopRequireDefault(require("../models/Product"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  async
} = require('regenerator-runtime');

const router = require('express').Router();

router.get('/productos', async (req, res) => {
  const product = await _Product.default.find().sort({
    date: 'desc'
  }).lean();

  for (let i = 0; i < product.length; i++) {
    product[i].price = formatterPeso.format(product[i].price);
  }

  res.render('productos/all-product', {
    productox: product
  });
});
router.get('/sesionoff', async (req, res) => {
  req.flash('error_msg', 'Se ha Cerrado la Sesion');
  res.redirect('/');
});
const formatterPeso = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0
});
router.get('/users/logout', async (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
router.get('/productos/add', (req, res) => {
  res.render('productos/new-product');
});
router.get('/products/edit/:id', async (req, res) => {
  const product = await _Product.default.findById(req.params.id).lean();
  res.render('productos/edit-product', {
    productox: product
  });
});
router.delete('/products/delete/:id', async (req, res) => {
  const product = await _Product.default.findById(req.params.id).lean();
  res.redirect('productos/edit-product', {
    productox: product
  });
});
module.exports = router;
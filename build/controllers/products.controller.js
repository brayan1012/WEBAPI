"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteProductById = exports.verificarntidad = exports.updateProductById = exports.getProductById = exports.getProducts = exports.createProduct = void 0;

var _express = require("express");

var _Product = _interopRequireDefault(require("../models/Product"));

var _Categoria = _interopRequireDefault(require("../models/Categoria"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)();

const createProduct = async (req, res) => {
  const {
    name,
    category,
    price,
    imgURL,
    cantidad
  } = req.body;
  var cuanti = 1;

  if (cantidad < 1) {
    cantidad = 1;
  }

  const estado = 1;
  const newProduct = new _Product.default({
    name,
    category,
    price,
    imgURL,
    cantidad
  });
  const totalproduc = await _Product.default.findOne({
    name: name,
    category: category,
    price: price
  }, {
    name: name,
    price: price,
    cantidad: cantidad
  });

  if (totalproduc) {
    console.log('entramos al if');
    console.log(totalproduc);
    totalproduc.cantidad = totalproduc.cuanti + cantidad;
    console.log(totalproduc.cantidad);
    await _Product.default.updateOne({
      name: name
    }, {
      cantidad: totalproduc.cantidad
    });
    req.flash('success_msg', 'Se guardo con exito');
    res.json({
      status: ok
    });
  }

  console.log(newProduct);
  const buscar = await _Categoria.default.findOne({
    category: category
  });

  if (!buscar) {
    const newCate = new _Categoria.default({
      estado,
      category
    });
    await newCate.save();
  }

  const productSaved = await newProduct.save();
  req.flash('success_msg', 'Se guardo con exito');
  res.json({
    status: 'ok',
    data: 'Proceso Exitoso'
  });
};

exports.createProduct = createProduct;
router.get('/productos', async (req, res) => {
  const productosx = await _Product.default.find().sort({
    date: 'desc'
  });
  res.render('productos/all-product', {
    productosx
  });
});

const getProducts = async (req, res) => {
  const products = await _Product.default.find();
  res.json("get products");
};

exports.getProducts = getProducts;

const getProductById = async (req, res) => {
  const product = await _Product.default.findById(req.params.productId);
  res.status(200).json(product);
};

exports.getProductById = getProductById;

const updateProductById = async (req, res) => {
  const updatedProduct = await _Product.default.findByIdAndUpdate(req.params.producttId, req.body, {
    new: true
  });
  console.log(updatedProduct);
  req.flash('success_msg', 'Producto Actualizado Correctamente', updatedProduct.name);
  res.redirect('/productos');
};

exports.updateProductById = updateProductById;

const verificarntidad = async (req, res) => {
  const {
    name,
    category,
    price,
    imgURL,
    cantidad
  } = req.body;

  if (cantidad < 1) {
    cantidad = 1;
    await _Product.default.findByIdAndDelete(req.params.producttId);
    req.flash('success_msg', 'Producto Comprado');
    res.redirect('/productos');
  }
};

exports.verificarntidad = verificarntidad;

const deleteProductById = async (req, res) => {
  console.log("llegamos al delete", req.params.producttId);
  await _Product.default.findByIdAndDelete(req.params.producttId);
  req.flash('success_msg', 'Producto Comprado');
  res.redirect('/productos');
};

exports.deleteProductById = deleteProductById;
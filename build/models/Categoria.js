"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const CategoriaSchema = new _mongoose.Schema({
  estado: Number,
  category: String
}, {
  timestamps: true,
  versionKey: false
});

var _default = (0, _mongoose.model)('Categoria', CategoriaSchema);

exports.default = _default;
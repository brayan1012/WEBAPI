"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mongo_uri = 'mongodb+srv://admin:lnjhinLLdDEJ1OlZ@compraventa.enu95.mongodb.net/compraventa';

_mongoose.default.connect(mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true
}).then(db => console.log("DB is connected")).catch(error => console.log(error));
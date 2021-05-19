"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userSchema = new _mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxlength: 50,
    unique: true
  },
  email: {
    type: String,
    maxlength: 70,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: "Role"
  }],
  estado: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true,
  versionKey: false
});

userSchema.statics.encryptPassword = async password => {
  const salt = await _bcryptjs.default.genSalt(10);
  return await _bcryptjs.default.hash(password, salt);
};

userSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await _bcryptjs.default.compare(password, receivedPassword);
};

var _default = (0, _mongoose.model)('User', userSchema);

exports.default = _default;
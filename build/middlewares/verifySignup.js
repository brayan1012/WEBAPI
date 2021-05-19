"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkRolesExisted = exports.checkDuplicateUsernameOrEmail = void 0;

var _Role = require("../models/Role");

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const email = await _User.default.findOne({
      email: req.body.email
    });

    if (email) {
      req.flash("error_msg", "El email ya esta registrado");
      res.redirect('/users/signup');
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({
      message: error
    });
  }
};

exports.checkDuplicateUsernameOrEmail = checkDuplicateUsernameOrEmail;

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.lengh; i++) {
      if (!_Role.ROLES.includes(req.body.roles[i])) {
        return res.status(400).json({
          message: `Role ${req.body.roles[i]} no existe`
        });
      }
    }
  }

  next();
};

exports.checkRolesExisted = checkRolesExisted;
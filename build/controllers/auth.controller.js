"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signin = exports.renderSigninForm = exports.renderproductos = exports.signup = exports.renderSignUpForm = void 0;

var _User = _interopRequireDefault(require("../models/User"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../config"));

var _Role = _interopRequireDefault(require("../models/Role"));

var _passport = _interopRequireDefault(require("passport"));

var _jsCookie = _interopRequireDefault(require("js-cookie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const renderSignUpForm = (req, res) => res.render("users/signup");

exports.renderSignUpForm = renderSignUpForm;

const signup = async (req, res) => {
  const errors = [];
  const {
    username,
    email,
    password,
    Confirmpassword,
    roles
  } = req.body;

  if (username.length <= 0 || password.length <= 0 || email.length <= 0) {
    errors.push({
      text: "Campos Vacios"
    });
  }

  if (password != Confirmpassword) {
    errors.push({
      text: "Contraseñas no coinciden"
    });
  }

  if (password.length < 4) {
    errors.push({
      text: "La Contraseñas debe tener almenos 4 caracteres"
    });
  }

  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      username,
      email,
      password,
      Confirmpassword,
      roles
    });
  } else {
    const emailUser = await _User.default.findOne({
      email: email
    });

    if (emailUser) {
      req.flash("error_msg", "Este Correo Ya Esta En Uso.");
      res.redirect("/users/signup");
    } else {
      const newUser = new _User.default({
        username,
        email,
        password: await _User.default.encryptPassword(password)
      });

      if (roles) {
        const foundRoles = await _Role.default.find({
          name: {
            $in: roles
          }
        });
        newUser.roles = foundRoles.map(role => role._id);
      } else {
        const role = await _Role.default.findOne({
          name: "user"
        });
        newUser.roles = [role._id];
      }

      const savedUser = await newUser.save();
      console.log(savedUser);

      const token = _jsonwebtoken.default.sign({
        id: savedUser._id
      }, _config.default.SECRET, {
        expiresIn: 86400 // 24 horas

      });

      console.log(token);
      res.redirect("/productos");
    }
  }
};

exports.signup = signup;

const renderproductos = (req, res) => res.render("/productos");

exports.renderproductos = renderproductos;

const renderSigninForm = (req, res) => res.render("users/signin");

exports.renderSigninForm = renderSigninForm;

const signin = async (req, res) => {
  const userFound = await _User.default.findOne({
    email: req.body.email
  }).populate("roles");

  if (!userFound) {
    req.flash("error_msg", "Usuario no encontrado");
    return res.json({
      status: "off"
    });
  } else {
    const matchPassword = await _User.default.comparePassword(req.body.password, userFound.password);

    if (!matchPassword) {
      req.flash("error_msg", "password incorrecto");
      return res.json({
        status: "off"
      });
    }

    const token = _jsonwebtoken.default.sign({
      id: userFound._id
    }, _config.default.SECRET, {
      expiresIn: 86400
    });

    req.session.mail = token;
    console.log(req.session.mail);
    return res.json({
      status: "ok",
      data: token
    });
  }
};

exports.signin = signin;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAdmin = exports.isModerator = exports.verifyToken = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../config"));

var _User = _interopRequireDefault(require("../models/User"));

var _Role = _interopRequireDefault(require("../models/Role"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const verifyToken = async (req, res, next) => {
  const token = req.session.mail;
  console.log(token);

  if (!token) {
    req.flash("error_msg", "Su sesion ha cerrado");
    return res.json({
      status: "off",
      data: 'Vuelva a Ingresar Porfavor.'
    });
  } else {
    try {
      const decoded = _jsonwebtoken.default.verify(token, _config.default.SECRET);

      req.userId = decoded.id;
      const user = await _User.default.findById(req.userId, {
        password: 0
      }).lean();
      if (!user) return res.json({
        status: "off",
        data: 'Usuario no Registra En BD'
      });
      return next();
    } catch (error) {
      return res.json({
        status: "off",
        data: 'Token no encontrado'
      });
    }
  }
};

exports.verifyToken = verifyToken;

const isModerator = async (req, res, next) => {
  const user = await _User.default.findById(req.userId).lean();
  const roles = await _Role.default.find({
    _id: {
      $in: user.roles
    }
  });
  console.log('usuario', user, "con rol en ", roles);

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "moderator") {
      next();
      return;
    }
  }

  return res.json({
    status: "off",
    data: 'El Usuario no es un Moderador'
  });
};

exports.isModerator = isModerator;

const isAdmin = async (req, res, next) => {
  const user = await _User.default.findById(req.userId).lean();
  const roles = await _Role.default.find({
    _id: {
      $in: user.roles
    }
  });

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "admin") {
      next();
      return;
    }
  }

  return res.status(403).json({
    message: "Se requieren privilegios"
  });
};

exports.isAdmin = isAdmin;
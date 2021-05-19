"use strict";

var _passport = _interopRequireDefault(require("passport"));

var _passportLocal = require("passport-local");

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_passport.default.use(new _passportLocal.Strategy({
  usernameField: 'email'
}, async (email, password, done) => {
  console.log("primera entrada");
  const user = await _User.default.findOne({
    email: email
  }).find();
  console.log("encontramos al user", user);

  if (!user) {
    return done(null, false, {
      message: 'Usuario No Encontrado'
    });
  } else {
    const match = await user.comparePassword(password);
    console.log("asdasdasdasdas", match);

    if (match) {
      return done(null, user);
    } else {
      return done(null, false, {
        message: 'Contraseña Incorrecta'
      });
    }
  }

  return;
}));

_passport.default.serializeUser((user, done) => {
  done(null, user.id);
});

_passport.default.deserializeUser((id, done) => {
  _User.default.findById(id, (err, user) => {
    done(err, user);
  });
});
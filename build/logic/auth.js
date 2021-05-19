"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsCookie = _interopRequireDefault(require("js-cookie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  setUserLogged(userLogged) {
    _jsCookie.default.set("userLogged", userLogged);
  },

  getUserLogged() {
    return _jsCookie.default.get("userLogged");
  }

};
exports.default = _default;
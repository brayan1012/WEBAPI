"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRoles = void 0;

var _Role = _interopRequireDefault(require("../models/Role"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createRoles = async () => {
  try {
    const count = await _Role.default.estimatedDocumentCount();
    if (count > 0) return;
    const values = await Promise.all([new _Role.default({
      name: "user"
    }).save(), new _Role.default({
      name: "moderator"
    }).save(), new _Role.default({
      name: "admin"
    }).save()]);
    console.log(values);
  } catch (error) {
    console.error(error);
  }
};

exports.createRoles = createRoles;
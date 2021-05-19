"use strict";

var _User = _interopRequireDefault(require("../models/User"));

var _Role = _interopRequireDefault(require("../models/Role"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = require("express").Router();

router.get("/users/signin", (req, res) => {
  res.render("users/signin");
});
router.get("/users/signup", (req, res) => {
  res.render("users/signup");
});
router.get("/users/usuarios", async (req, res) => {
  const usuario = await _User.default.find().sort({
    date: "desc"
  }).lean();
  const escrito = "activo";
  console.log("sus usuarios", usuario);

  for (let i = 0; i < usuario.length; i++) {
    const roles = await _Role.default.find({
      _id: {
        $in: usuario[i].roles
      }
    });
    console.log(roles);

    for (let j = 0; j < roles.length; j++) {
      usuario[i].rol = roles[j].name;
      console.log(usuario[i].rol);
    }

    if (usuario[i].estado < 1) {
      usuario[i].estadoz = "Inactivo";
    } else {
      usuario[i].estadoz = "Activo";
    }
  }

  res.render("users/editor", {
    usuario
  });
});
module.exports = router;
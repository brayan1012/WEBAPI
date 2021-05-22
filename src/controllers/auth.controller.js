import User from "../models/User";
import jwt from "jsonwebtoken";
import config from "../config";
import Role from "../models/Role";
import passport from "passport";
import Cookies from "js-cookie";
import {authjwt} from '../middlewares'
export const renderSignUpForm = (req, res) => res.render("users/signup");

export const signup = async (req, res) => {
  const errors = [];
  const { username, email, password, Confirmpassword, roles } = req.body;

  if (username.length <= 0 || password.length <= 0 || email.length <= 0) {
    errors.push({ text: "Campos Vacios" });
  }

  if (password != Confirmpassword) {
    errors.push({ text: "Contraseñas no coinciden" });
  }
  if (password.length < 4) {
    errors.push({ text: "La Contraseñas debe tener almenos 4 caracteres" });
  }
  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      username,
      email,
      password,
      Confirmpassword,
      roles,
    });
  } else {
    email2= email.toLowerCase(); 
    const emailUser = await User.findOne({ email: email2 });
    if (emailUser) {
      req.flash("error_msg", "Este Correo Ya Esta En Uso.");
      res.redirect("/users/signup");
    } else {
      const newUser = new User({
        username,
        email: email2,
        password: await User.encryptPassword(password),
      });
      if (roles) {
        const foundRoles = await Role.find({ name: { $in: roles } });
        newUser.roles = foundRoles.map((role) => role._id);
      } else {
        const role = await Role.findOne({ name: "Cliente" });
        newUser.roles = [role._id];
      }
      const savedUser = await newUser.save();
      console.log(savedUser);
      const token = jwt.sign({ id: savedUser._id }, config.SECRET, {
        expiresIn: 86400, // 24 horas
      });
      req.session.mail= token;
      console.log(token);
      authjwt.verifyToken
      authjwt.isAdmin
      res.redirect("/productos");
    }
  }
};
export const renderproductos = (req, res) => res.render("/productos");

export const renderSigninForm = (req, res) => res.render("users/signin");


export const signin = async (req, res) => {
  const userFound = await User.findOne({ email: req.body.email.toLowerCase() }).populate(
    "roles"
  );
  if (!userFound) {
    req.flash("error_msg", "Usuario no encontrado");
    return res.json({ status: "off"})
  } else {
    const matchPassword = await User.comparePassword(
      req.body.password,
      userFound.password
    );
    if(userFound.estado===0){
      req.flash("error_msg", "Cuenta Inactiva");
      return res.json({ status: "off"})
    }
    if (!matchPassword) {
      req.flash("error_msg", "password incorrecto");
      return res.json({ status: "off"})
    }
    const token = jwt.sign({ id: userFound._id }, config.SECRET, {
      expiresIn: 86400,
    });
    req.session.mail= token;
    const decoded = jwt.verify(token, config.SECRET);
    req.userId = decoded.id;
    const user = await User.findById(req.userId).lean();
    const roles = await Role.find({ _id: { $in: user.roles } });
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "Administrador") {
        req.session.rol= "Adm";
      }
      if(roles[i].name === "Vendedor"){
        req.session.rols= "Ven"
      }
    }
    return res.json({ status: "ok", data: token });
  }
};

import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/User";
import role from "../models/Role";


export const verifyToken = async (req, res, next) => {
  const  token  = req.session.mail;
  if (!token){
    req.flash("error_msg", "Su sesion ha cerrado");
    return res.json({ status: "off", data: 'Vuelva a Ingresar Porfavor.' });
  }else{
    try {
        const decoded = jwt.verify(token, config.SECRET);
        req.userId = decoded.id;
        const user = await User.findById(req.userId, { password: 0 }).lean();
        if (!user) return res.json({ status: "off", data: 'Usuario no Registra En BD' });
        return next();
    } catch (error) {
      return res.json({ status: "off", data: 'Token no encontrado' });
    }
  }

};

export const isModerator = async (req, res, next) => {
  const user = await User.findById(req.userId).lean();
  const roles = await role.find({ _id: { $in: user.roles } });
  console.log('usuario',user,"con rol en ", roles)
  for (let i = 0; i < roles.length; i++) {
    if(roles[i].name==="Administrador"){
      next();
      return;
    }else{
      if (roles[i].name === "Vendedor") {
        req.session.role= "Ven";
        next();
        return;
      }
    }

  }
  return res.json({ status: "off", data: 'El Usuario no tiene privilegios' });
};

export const isAdmin = async (req, res, next) => {
  console.log("first time here");
  const user = await User.findById(req.userId).lean();
  const roles = await role.find({ _id: { $in: user.roles } });
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "Administrador") {
      req.session.role= "Adm";
      next();
      return;
    }
  }
  return res.status(403).json({ message: "Se requieren privilegios" });
};

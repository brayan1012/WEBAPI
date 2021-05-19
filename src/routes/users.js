const router = require("express").Router();

import Role from "../models/Role";
import { ROLES } from "../models/Role";
import User from "../models/User";
import usuariox from "../models/User"
import PDF from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { Console } from "console";

router.get("/users/signin", (req, res) => {
  res.render("users/signin");
});
router.get("/users/signup", (req, res) => {
  res.render("users/signup");
});
router.get("/users/usuarios", async (req, res) => {
  const usuario = await usuariox.find().sort({ date: "desc" }).lean();
  for (let i = 0; i < usuario.length; i++) {
    const roles = await Role.find({ _id: { $in: usuario[i].roles } });
    console.log(roles);
    usuario[i].turno=i;
    for (let j = 0; j < roles.length; j++) {
      usuario[i].rol= roles[j].name;
      console.log(usuario[i].rol)
    }
    if (usuario[i].estado < 1) {
      usuario[i].estadoz = "Inactivo";
    } else {
      usuario[i].estadoz = "Activo";
    }
  }
  
  res.render("users/editor", { usuario });
});

router.post("/users/usupdf", async(req,res)=>{
  const usuario = await usuariox.find({},{"_id":0}).sort({ date: "desc" }).lean();
  console.log(usuario);
  const invoiceName= 'Usuarios.pdf';

  const pdfDoc = new PDF();
  res.setHeader('Content-Type','application/pdf');
  res.setHeader(
    'Content-Disposition',
    'inline; filename="'+invoiceName+'"'
  );

  pdfDoc.pipe(res);
  pdfDoc.font('Times-Roman');
  pdfDoc.fontSize(48);
  pdfDoc.image('src/public/img/logo.png', 10, 50, {
    align: 'left',
    width: 200, 
    height: 100
  }).text('Usuarios', 320, 100, {underline:true, strike:true});
  pdfDoc.font('Times-Roman', 13);
  pdfDoc.text("No.",40, 170, {
    underline:true,
    strike: true
  });
  var EjeY=170;
  for (let i = 1; i <= usuario.length; i++) {
    EjeY=EjeY+30;
    pdfDoc.text(i, 40, EjeY,);
  }
  pdfDoc.text("Nombre.", 80, 170, {
    underline:true,
    strike:true
  });
  EjeY = 170;
  for (let i = 0; i < usuario.length; i++) {
    const Nombre = usuario[i].username;
    EjeY = EjeY+30;
    pdfDoc.text(Nombre, 80 ,EjeY ,{width: 120, height: 40});
  }
  pdfDoc.text("Correo.", 200, 170, { underline:true, strike:true});
  EjeY=170;
  for (let i = 0; i < usuario.length; i++) {
    const correo = usuario[i].email;
    EjeY=EjeY+30;
    pdfDoc.text(correo, 200, EjeY,{width:160, height:40});
  }
  pdfDoc.text("Fecha de Creación.", 360, 170, { underline:true, strike:true});
  EjeY=170;
  for (let i = 0; i < usuario.length; i++) {
    const creacion = usuario[i].createdAt;
    EjeY=EjeY+30;
    pdfDoc.text(creacion, 360, EjeY,{width:120,height:40});
  }
  EjeY=170;
  pdfDoc.text("Estado.", 500,170,{ underline:true, strike:true});
  for (let i = 0; i < usuario.length; i++) {
    const estado = usuario[i].estado;
    var Texto = "";
    if(estado===1){
      Texto= "Activo";
    }else{
      Texto= "Inactivo";
    }
    EjeY = EjeY +30;
    pdfDoc.text(Texto, 500, EjeY,{width:120, height:40});   
  }
  pdfDoc.end();
  const usuario2 = await usuariox.find().sort({ date: "desc" }).lean();
  for (let i = 0; i < usuario2.length; i++) {
    const roles = await Role.find({ _id: { $in: usuario2[i].roles } });
    usuario2[i].turno=i;
    for (let j = 0; j < roles.length; j++) {
      usuario2[i].rol= roles[j].name;
    
    }
    if (usuario2[i].estado < 1) {
      usuario2[i].estadoz = "Inactivo";
    } else {
      usuario2[i].estadoz = "Activo";
    }
  }
  res.render("users/editor", { usuario2 });
});

router.post("/users/usuarioss", async (req, res) => {
  var busque = req.body.search;
const usuario = await usuariox.find({"username": new RegExp(req.body.search,'i')}).sort({ date: "desc" }).lean();

  for (let i = 0; i < usuario.length; i++) {
    const roles = await Role.find({ _id: { $in: usuario[i].roles } });
    console.log(roles);
    usuario[i].turno=i;
    for (let j = 0; j < roles.length; j++) {
      usuario[i].rol= roles[j].name;
      console.log(usuario[i].rol)
    }
    if (usuario[i].estado < 1) {
      usuario[i].estadoz = "Inactivo";
    } else {
      usuario[i].estadoz = "Activo";
    }
  }
  res.render("users/editor", { usuario });
});
router.post("/users/actualizar/:producttId", async(req,res)=>{
  const { email, password, username, roles, Cpassword} = req.body;
  if(password!==""){
    console.log("entramos en la opt1");
    req.body.password= await User.encryptPassword(password);
  }else{
    req.body.password= Cpassword;
  }
    const foundRoles = await Role.find({ name: { $in: roles } });
    console.log("lo obtenido de: ",foundRoles);
    req.body.roles = foundRoles.map((role) => role._id);
    console.log(req.body);
    const updatedUser = await User.findByIdAndUpdate(req.params.producttId, req.body, {
      new:true
  })
  res.redirect('/users/usuarios');

});
router.get("/users/actuEST/:producttId", async(req,res)=>{
  const { email, password, username, roles, Cpassword} = req.body;
    const estado = await User.findById(req.params.producttId, {"estado":1}).lean()
    if(estado.estado===0){
      const updatedUser = await User.findByIdAndUpdate(req.params.producttId, {estado:1}).lean()

    }else{
      const updatedUser = await User.findByIdAndUpdate(req.params.producttId, {estado:0}).lean()
    }
  res.redirect('/users/usuarios');

});
module.exports = router;

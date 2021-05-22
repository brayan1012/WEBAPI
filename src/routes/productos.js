const { async } = require('regenerator-runtime');
import jwt from "jsonwebtoken";
import productoz from '../models/Product'
import User from "../models/User";
import config from "../config";
import Ventas from "../models/Venta";
import Venta from "../models/Venta";

const router = require('express').Router();

router.get('/productos', async (req,res)=>{
    const product = await productoz.find().sort({date: 'desc'}).lean();
    const  token  = req.session.mail;
    const decoded = jwt.verify(token, config.SECRET);
    req.userId = decoded.id;
    const user = await User.findById(req.userId).lean();
    for (let i = 0; i < product.length; i++) {
        product[i].number=i;
        product[i].price1 = formatterPeso.format(product[i].price);
        if(product[i].email===user.email){
            product[i].existe="SI";
        }
        product[i].userx=user.username;
        product[i].emailx=user.email;
    } 
    
    res.render('productos/all-product', {productox: product});
});
router.get('/sesionoff', async (req,res)=>{
    req.flash('error_msg', 'Se ha Cerrado la Sesion');
    res.redirect('/');
});
const formatterPeso = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  });
router.get('/users/logout', async (req,res)=>{
    req.session.destroy();
    res.redirect('/');
});

router.get('/productos/add',(req, res)=>{
    res.render('productos/new-product');
});

router.get('/products/edit/:id', async (req, res)=>{
    const product = await productoz.findById(req.params.id).lean();
    res.render('productos/edit-product', {productox: product});
});

router.delete('/products/delete/:id', async(req,res)=>{
    const product = await productoz.findById(req.params.id).lean();
    res.redirect('productos/edit-product', {productox: product});
});
router.post('/products/buy', async(req,res)=>{
    console.log("hola");
    const { Vendedor, Cliente, Total, Cantidad, idprod, Nomprod, Precio} = req.body;
    var Numero =0 ;
    var serie='';
    var NTotal = Total.slice(7);
    
    const vent = await Venta.find().sort({date: 'desc'}).lean();
    if(vent){
        Numero = vent.length+1; 
        serie = "F"+Numero.toString();
    }else{
        Numero = 1;
        serie = "F"+Numero.toString();
    }
    var Ntotal2= NTotal.replace(/\./g, '');
    var Ntotal3= parseInt(Ntotal2);
    console.log('1;',NTotal,'2:',Ntotal2,'3:',Ntotal3);
    console.log(Vendedor, Cliente, Ntotal3, Cantidad);
    const newVenta = new Venta({
        Usuario: Vendedor,
        Cliente: Cliente,
        SComprobante: serie,
        NComprobante: Numero,
        Total: Ntotal3
    });
    newVenta.Detalles=[{
        _id:idprod,
        name:Nomprod, 
        cantidad:Cantidad, 
        price: Precio}];
    newVenta.save(function(err) {
        if (err) throw err;
    });
    var cantidad = Cantidad;
    const producto = await productoz.findById(idprod);
    if(cantidad<producto.cantidad){
        cantidad = producto.cantidad - cantidad;
        await productoz.findByIdAndUpdate(idprod,{cantidad:cantidad});
    }else{
        await productoz.findByIdAndDelete(idprod)
    }
    req.flash('success_msg', 'Factura generada con éxito');
    return res.json({ status: "ok" });       


})
module.exports = router;
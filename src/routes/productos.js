const { async } = require('regenerator-runtime');
import jwt from "jsonwebtoken";
import productoz from '../models/Product'
import User from "../models/User";
import config from "../config";
const router = require('express').Router();

router.get('/productos', async (req,res)=>{
    const product = await productoz.find().sort({date: 'desc'}).lean();
    const  token  = req.session.mail;
    const decoded = jwt.verify(token, config.SECRET);
    req.userId = decoded.id;
    const user = await User.findById(req.userId).lean();
    for (let i = 0; i < product.length; i++) {
        product[i].number=i;
        product[i].price = formatterPeso.format(product[i].price);
        if(product[i].email===user.email){
            product[i].existe="SI";
        }
    } 

    res.render('productos/all-product', {productox: product });
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
module.exports = router;
import { Router } from 'express'
const router = Router();
import jwt from "jsonwebtoken";
import config from "../config";
import Product from '../models/Product'
import User from "../models/User";
import Categoria from '../models/Categoria'
export const createProduct = async (req,res)=>{
        const { name, category, price, imgURL, cantidad} = req.body; 
        console.log("el category que llega del form ",category);
        const  token  = req.session.mail;  
        var cuanti =1; 
        if(cantidad<1){
            cantidad=1;
        }
        const decoded = jwt.verify(token, config.SECRET);
        req.userId = decoded.id;
        const user = await User.findById(req.userId).lean();
        const estado =1;
        const usuario = user.username;
        const email= user.email;
        const newProduct = new Product({name, category, price, imgURL, cantidad, usuario, email});
        const totalproduc = await Product.findOne({name:name, category:category, price:price, email:email},{name:name, price:price, cantidad:cantidad});
        if(totalproduc){
            totalproduc.cantidad = totalproduc.cuanti+cantidad;
            await Product.updateOne({name: name},{cantidad: totalproduc.cantidad});
            req.flash('success_msg','Se guardo con exito');
            res.json({status:ok})
        }
        console.log(newProduct);
        const buscar = await Categoria.findOne({ category: category});
        console.log('lo encontrado de la categoria es: ',buscar);
        if(!buscar){
            
            const newCate= new Categoria({categoria: category});
            console.log(newCate);
            const CategoriaSaved= await newCate.save();
            console.log(CategoriaSaved);
        }
        const productSaved = await newProduct.save();
        req.flash('success_msg','Se guardo con exito');
        res.json({status: 'ok', data: 'Proceso Exitoso'});
}
router.get('/productos',async (req,res)=>{
        const productosx = await Product.find().sort({date: 'desc'});
        res.render('productos/all-product',{productosx});
    });
export const getProducts = async (req,res)=>{
    const products = await Product.find();

    res.json("get products");
}
export const getProductById = async (req,res)=>{
    const product = await Product.findById(req.params.productId);
    res.status(200).json(product)
}
export const updateProductById = async (req,res)=>{
    
    const updatedProduct = await Product.findByIdAndUpdate(req.params.producttId, req.body, {
        new:true
    })
    console.log(updatedProduct);
    req.flash('success_msg', 'Producto Actualizado Correctamente', updatedProduct.name);
    res.redirect('/productos');
}
export const verificarntidad = async(req,res)=>{
    const { name, category, price, imgURL, cantidad} = req.body;  
    if(cantidad<1){
        
        cantidad = 1;
        await Product.findByIdAndDelete(req.params.producttId)
        req.flash('success_msg', 'Producto Comprado');
        res.redirect('/productos'); 
    }
}
export const buyProductById = async(req,res)=>{
    
    req.flash('success_msg', 'Producto Comprado');
    res.redirect('/productos'); 
}

export const deleteProductById = async(req,res)=>{
    var cantidad = req.body.cantidad;
    const producto = await Product.findById(req.params.producttId)
    if(cantidad<producto.cantidad){
        cantidad = producto.cantidad - cantidad;
        await Product.findByIdAndUpdate(req.params.producttId,{cantidad:cantidad});
    }else{
        await Product.findByIdAndDelete(req.params.producttId)
    }
    req.flash('success_msg', 'Producto Eliminado');
    res.redirect('/productos'); 
}
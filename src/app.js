import express from 'express';
import exphbs from 'express-handlebars';
import morgan from 'morgan';
import pkg from '../package.json';
import flash from 'connect-flash';
import session from 'express-session';
import methodOverride from 'method-override';
import passport from "passport";
import path from 'path';
import cookieparser from 'cookie-parser'
import {createRoles} from './libs/initialSetup';
import productsRoutes from './routes/products.routes';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/user.routes';
import index from './routes';
import Chart from 'chart.js';
import killport from 'killport'
import "./config/passport"
import PDF from 'pdfkit';
import fs from 'fs';
import { kill } from 'process';
//iniciacion app
const app = express();
createRoles();

//settings
app.set('pkg', pkg);

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
})
);
app.set('view engine','.hbs');
//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.json());
//Global Variables
app.use((req,res,next)=>{
    res.locals.success_msg= req.flash('success_msg');
    res.locals.error_msg =req.flash('error_msg');
    res.locals.user = req.session.mail;
    res.locals.rol = req.session.rol;
    res.locals.rols = req.session.rols;
    next();
});

//Static Files
app.use(express.static(path.join(__dirname,'public')));

//Server is listenning

// Welcome Routes
app.use(require('./routes/index'));
app.use(require('./routes/productos'));
app.use(require('./routes/users'));
//Routes
app.use('/api/products', productsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

export default app;
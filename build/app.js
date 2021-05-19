"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressHandlebars = _interopRequireDefault(require("express-handlebars"));

var _morgan = _interopRequireDefault(require("morgan"));

var _package = _interopRequireDefault(require("../package.json"));

var _connectFlash = _interopRequireDefault(require("connect-flash"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _methodOverride = _interopRequireDefault(require("method-override"));

var _passport = _interopRequireDefault(require("passport"));

var _path = _interopRequireDefault(require("path"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _initialSetup = require("./libs/initialSetup");

var _products = _interopRequireDefault(require("./routes/products.routes"));

var _auth = _interopRequireDefault(require("./routes/auth.routes"));

var _user = _interopRequireDefault(require("./routes/user.routes"));

var _routes = _interopRequireDefault(require("./routes"));

require("./config/passport");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//iniciacion app
const app = (0, _express.default)();
(0, _initialSetup.createRoles)(); //settings

app.set('pkg', _package.default);
app.set('port', process.env.PORT || 8080);
app.set('views', _path.default.join(__dirname, 'views'));
app.engine('.hbs', (0, _expressHandlebars.default)({
  defaultLayout: 'main',
  layoutsDir: _path.default.join(app.get('views'), 'layouts'),
  partialsDir: _path.default.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));
app.set('view engine', '.hbs'); //Middlewares

app.use((0, _morgan.default)('dev'));
app.use(_express.default.urlencoded({
  extended: false
}));
app.use((0, _methodOverride.default)('_method'));
app.use((0, _expressSession.default)({
  secret: 'mysecretapp',
  resave: true,
  saveUninitialized: true
}));
app.use(_passport.default.initialize());
app.use(_passport.default.session());
app.use((0, _connectFlash.default)());
app.use(_express.default.json()); //Global Variables

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.session.mail;
  res.locals.rol = req.session.rol;
  next();
}); //Static Files

app.use(_express.default.static(_path.default.join(__dirname, 'public'))); //Server is listenning
// Welcome Routes

app.use(require('./routes/index'));
app.use(require('./routes/productos'));
app.use(require('./routes/users')); //Routes

app.use('/api/products', _products.default);
app.use('/api/auth', _auth.default);
app.use('/api/users', _user.default);
var _default = app;
exports.default = _default;
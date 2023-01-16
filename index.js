(async () => {
  require('dotenv').config();
  secureEnv = require('secure-env');                                                                          //Use Secure-env
  global.env = secureEnv(secureEnvSecret);
  var PublicPath = __dirname + '/public';
  var handlebars = require('express-handlebars').create({ defaultLayout: layoutPage, helpers: helpers });

  //Production Logger
  const logger = require('./settings.js').logger

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var app = require('express')();

  app.use(require('./settings.js').enforceSSL);                                                               //Enforce SSL
  app.use(function (req, res, next) {  /*    Pre-run logic here     */  next(); });                           //Initial logic
  app.use((req, res, next) => { require('on-headers')(res, () => { /*     */ }); next(); })                   //Manipulate response header before sending
  app.use(require('express-session')({                                                                        //Initialize Session
    Cookie: { path: '/', httpOnly: true, secure: true, sameSite: true, maxAge: maxage },
    store: Store,
    name: 'Session Store',
    secret: Secret,
    resave: true,
    saveUninitialized: true,
    genid: function Gen(req) { return require('uuid').v5(req.ip + req.headers['user-agent'], UUID_NAMESPACE); }
  }));
  app.use(express.urlencoded({ extended: true }));                                                            //Parse request
  app.use(express.json());                                                                                    //Parse request
  app.use(require('morgan')('dev'));                                                                          //Dev Logger
  app.disable('etag');                                                                                        //Disable Etag
  app.disable('x-powered-by');                                                                                //Disable Powered By
  app.engine('handlebars', handlebars.engine);                                                                //Set view engine
  app.set('view engine', 'handlebars');                                                                       //Set view engine
  app.use(require('compression')({ level: 6, strategy: require('node:zlib').constants.Z_DEFAULT_STRATEGY })); //Compression default values
  app.use((req, res, next) => { res.locals.noncecsp = require('nonce')()(); next() })                         //Use nonce
  app.use(require('helmet')());                                                                               //Default helmet settings
  app.use(require('express-sanitizer')());                                                                    //Initialize Input Sanitizer utility 

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //Routing
  
  app.get('/', require('./route_handlers.js').home)                                                           //Import route handler
  require('./routes/404.js')(app)                                                                             //404
  app.use(require('./routes/500.js')(logger))                                                                 //500
  app.use(require('join-io')({ dir: PublicPath, prefix: '/J',    /* default */ }));                           //Reduce request count, join static assets 
  app.use(express.static(PublicPath, { dotfiles: 'ignore', etag: false }));                                   //Static resources
  
  app.listen();

})()
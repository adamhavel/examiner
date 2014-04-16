var express = require('express'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    sessionStore = require('connect-mongo')(session),
    fs = require('fs'),
    config = require('./global');

module.exports = function(app, passport, db) {

   app.use(compression());
   app.use(express.static(config.root + '/../public'));

   // for sourcemaps to work
   if (process.env.NODE_ENV === 'development') {
      app.use('/client', express.static(config.root + '/../client'));
   }

   app.use(bodyParser.json());

   // setup session store
   app.use(cookieParser());
   app.use(session({
      secret: config.sessionSecret,
      store: new sessionStore({
         db: db.connection.db,
         collection: config.sessionCollection
      })
   }));

   app.use(passport.initialize());
   app.use(passport.session());

   var regexPublic;

   if (process.env.NODE_ENV === 'development') {
      regexPublic = /^(?!\/api\/|\/client\/).*/;
   } else {
      regexPublic = /^(?!\/api\/).*/;
   }

   app.all(regexPublic, function(req, res, next) {
      res.sendfile('index.html', { root: config.root + '/../public' });
   });

   // load routes
   var routesDir = config.root + '/routes';
   fs.readdirSync(routesDir).forEach(function(route) {
      require(routesDir + '/' + route)(app, passport);
   });

};
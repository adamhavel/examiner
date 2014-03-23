var express = require('express'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    sessionStore = require('connect-mongo')(session),
    fs = require('fs'),
    config = require('./global');

module.exports = function(app, db) {

   app.use(compression());
   app.use(express.static(config.root + '/../public'));

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

   // load routes
   var routesDir = config.root + '/routes';
   fs.readdirSync(routesDir).forEach(function(route) {
      require(routesDir + '/' + route)(app);
   });

};
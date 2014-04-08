var express = require('express'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    passport = require('passport');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/global');

// load models
fs.readdirSync('./models').forEach(function(model) {
   require('./models/' + model);
});

console.log('Connectiong to ' + config.db);

var db = mongoose.connect(config.db);

require('./config/passport')(passport);

var app = express();
require('./config/express')(app, passport, db);

var port = process.env.PORT || config.port;
app.listen(port);
console.log('Listening on port ' + port);
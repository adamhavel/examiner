var express = require('express'),
    fs = require('fs'),
    mongoose = require('mongoose');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/global');

// load models
fs.readdirSync('./models').forEach(function(model) {
   require('./models/' + model);
});

var db = mongoose.connect(config.db);

var app = express();
require('./config/express')(app, db);

var port = process.env.PORT || config.port;
app.listen(port);
console.log('Listening on port ' + port);
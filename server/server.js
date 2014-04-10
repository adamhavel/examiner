var express = require('express'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    _ = require('lodash');

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
var server = app.listen(port);
console.log('Listening on port ' + port);

var io = require('socket.io').listen(server);

var users = [];

io.sockets.on('connection', function(socket) {

   socket.emit('init', _.map(users, function(user) {
      return {
         name: user.name,
         id: user.id
      };
   }));

   socket.on('identify', function(data) {
      var user = _.find(users, function(user) {
         return user.id === data.id;
      });
      if (user && user.socket !== socket) {
         user.socket = socket;
         socket.join(user.examId);
      }
   });

   socket.on('finished', function(data) {
      var user = _.remove(users, function(user) {
         return user.id === data.id;
      });
      if (user.length) {
         socket.leave(user[0].examId);
      }
   });

   socket.on('register', function(user) {
      user.socket = socket;
      users.push(user);
      socket.join(user.examId);
      console.log(users);
      socket.broadcast.to(user.examId).emit('user:registered', {
         name: user.name,
         id: user.id
      });
   });

});
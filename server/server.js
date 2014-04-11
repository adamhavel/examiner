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
var exams = [];

io.sockets.on('connection', function(socket) {

   socket.on('user:identify', function(data) {
      var user = _.find(users, function(user) {
         return user.id === data.id;
      });
      if (user && user.socket !== socket) {
         user.socket = socket;
         socket.join(user.examId);
      }
      if (data.role === 'teacher') {
         var students = _.filter(users, function(user) {
            return user.role === 'student';
         });
         socket.emit('send:students', _.map(students, function(student) {
            return {
               name: student.name,
               id: student.id
            };
         }));
      }
   });

   socket.on('user:leave', function(data) {
      var user = _.remove(users, function(user) {
         return user.id === data.id;
      });
      if (user.length) {
         socket.leave(user[0].examId);
      }
      if (data.role === 'student') {
         socket.broadcast.to(data.examId).emit('student:left', data.id);
      }
   });

   socket.on('user:register', function(user) {
      user.socket = socket;
      users.push(user);
      socket.join(user.examId);
      console.log(users);
      if (user.role === 'student') {
         socket.broadcast.to(user.examId).emit('student:registered', {
            name: user.name,
            id: user.id
         });
         var exam = _.find(exams, function(exam) {
            return exam.id === user.examId;
         });
         if (exam) {
            socket.emit('exam:started', exam);
         }
      }
   });

   socket.on('exam:start', function(data) {
      var exam = {
         id: data.examId,
         start: new Date().getTime(),
         duration: data.duration
      }
      exams.push(exam);
      io.sockets.in(data.examId).emit('exam:started', exam);

   });

   socket.on('exam:finish', function(id) {
      socket.broadcast.to(id).emit('exam:finished');
   });

});
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

var db = mongoose.connect(config.db, function() {

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

      console.log(socket.handshake);

      function sendStudentList(examId) {
         var students = _.filter(users, function(user) {
            return user.role === 'student' && user.examId === examId;
         });
         socket.emit('send:students', _.map(students, function(student) {
            return {
               name: student.name,
               id: student.id
            };
         }));
      }

      socket.on('user:identify', function(data) {
         var user = _.find(users, function(user) {
            return user.id === data.id;
         });
         if (!user) {
            socket.emit('exam:finished');
         }
         if (user && user.socket !== socket) {
            user.socket = socket;
            socket.join(user.examId);
         }
         if (data.role === 'teacher') {
            sendStudentList(data.examId);
         }
      });

      socket.on('user:leave', function(data) {
         var user = _.remove(users, function(user) {
            return user.id === data.id;
         })[0];
         if (user) {
            socket.leave(data.examId);
         }
         if (data.role === 'student') {
            socket.broadcast.to(data.examId).emit('student:left', data);
         }
      });

      socket.on('user:register', function(user) {
         user.socket = socket;
         users.push(user);
         socket.join(user.examId);
         if (user.role === 'student') {
            socket.broadcast.to(user.examId).emit('student:registered', {
               name: user.name,
               id: user.id
            });
         } else {
            sendStudentList(user.examId);
         }
         var exam = _.find(exams, function(exam) {
            return exam.id === user.examId;
         });
         if (exam) {
            socket.emit('exam:started', {
               start: exam.start,
               duration: exam.duration
            });
         }
      });

      socket.on('exam:start', function(data) {
         var exam = {
            id: data.examId,
            start: Date.now(),
            duration: data.duration,
            clock: setInterval(function() {
               exam.timeLeft = exam.duration - (Date.now() - exam.start);
               if (exam.timeLeft <= 0) {
                  if (io.sockets.clients(exam.id).length) {
                     io.sockets.in(exam.id).emit('exam:finished');
                  } else {
                     clearInterval(exam.clock);
                     _.remove(exams, function(item) {
                        return item.id === exam.id;
                     });
                  }
               }
            }, 1000)
         };
         exams.push(exam);
         io.sockets.in(data.examId).emit('exam:started', {
            start: exam.start,
            duration: exam.duration
         });
      });

      socket.on('student:distracted', function(student) {
         var teachers = _.filter(users, function(user) {
            return user.role === 'teacher' && user.examId === student.examId;
         });
         _.forEach(teachers, function(teacher) {
            teacher.socket.emit('student:distracted', student);
         });
      });

      socket.on('student:resized', function(data) {
         var teachers = _.filter(users, function(user) {
            return user.role === 'teacher' && user.examId === data.student.examId;
         });
         _.forEach(teachers, function(teacher) {
            teacher.socket.emit('student:resized', data);
         });
      });

      socket.on('exam:finish', function(examId) {
         var exam = _.remove(exams, function(exam) {
            return exam.id === examId;
         })[0];
         if (exam) {
            clearInterval(exam.clock);
         }
         socket.broadcast.to(examId).emit('exam:finished');
      });

   });

});
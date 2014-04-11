'use strict';

angular.module('app.exams.take')

   .controller('ExamTakeController',
   ['$scope', '$stateParams', '$state', 'Blueprint', 'ExamTake', 'Modal', 'Socket', 'User',
   function($scope, $stateParams, $state, Blueprint, ExamTake, Modal, Socket, User) {

      var fingerprint = {
         role: User.data.role,
         name: User.data.name,
         id: User.data.id,
         examId: $stateParams.subject
      }

      $scope.user = User.data;
      $scope.isStudent = User.data.role === 'student';

      if (User.data.role === 'teacher') {

         $scope.students = [];

         Socket.on('send:students', function(students) {
            $scope.students = students;
         });

         Socket.on('student:registered', function(student) {
            $scope.students.push(student);
         });

         Socket.on('student:left', function(id) {
            _.remove($scope.students, function(student) {
               return student.id === id;
            });
         });

         $scope.start = function() {
            Modal.open('setDuration', null, function(duration) {
               if (duration) {
                  Socket.emit('exam:start', {
                     examId: fingerprint.examId,
                     duration: duration
                  });
               }
            });
         };

         $scope.finish = function() {
            Modal.open('confirm', 'Are you sure you want to end the exam early? There is no going back.', function(confirm) {
               if (confirm) {
                  Socket.emit('exam:finish', fingerprint.examId);
                  Socket.emit('user:leave', fingerprint);
                  ExamTake.reset();
                  $state.go('home');
               }
            }, 'Collect');
         };

         $scope.leave = function() {
            Socket.emit('user:leave', fingerprint);
            ExamTake.reset();
            $state.go('home');
         };

         $scope.toggleSolution = function(answer) {
            var temp = answer.content;
            answer.content = answer.solution;
            answer.solution = temp;
         };

      } else {

         window.addEventListener('blur', function() {
         });

         $scope.$on('$destroy', function() {

         });

      }

      Socket.emit('user:identify', fingerprint);

      Socket.on('exam:started', function(exam) {
         Modal.open('alert', 'Exam started! It will take ' + exam.duration + ' minutes.', function() {
            $scope.exam.started = true;
            console.log(exam);
         });
      });

      Socket.on('exam:finished', function() {
         Socket.emit('user:leave', fingerprint);
         Modal.open('alert', 'The exam has been ended early.', function() {
            $state.go('home');
            ExamTake.reset();
         });
      });

      $scope.exam = ExamTake.data;
      if (!ExamTake.isOngoing) {
         Socket.emit('user:register', fingerprint);
         ExamTake.data = Blueprint.get({
            subject: $stateParams.subject,
            date: $stateParams.date,
            lang: $stateParams.lang
         }, function() {
            $scope.exam = ExamTake.data;
            ExamTake.isOngoing = true;
         }, function(err) {

         });
      }

      $scope.store = function() {
         Modal.open('confirm', 'Do you want to hand in the exam early? There is no going back.', function(confirmed) {
            if (confirmed) {
               Socket.emit('user:leave', fingerprint);
               ExamTake.reset();
               $state.go('home');
            }
         }, 'Hand in');
      };

   }]);
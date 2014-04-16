'use strict';

angular.module('app.exams.take')

   .controller('ExamTakeController',
   ['$scope', '$stateParams', '$state', '$interval', 'Blueprint', 'ExamTake', 'Modal', 'Timer', 'Socket', 'User',
   function($scope, $stateParams, $state, $interval, Blueprint, ExamTake, Modal, Timer, Socket, User) {

      var fingerprint = {
         name: User.data.name,
         id: User.data.id,
         role: User.data.role,
         examId: $stateParams.subject + '/' + $stateParams.date
      };

      $scope.user = User;
      $scope.timer = Timer;

      function checkViewportUse() {
         // console.log('resolution: ' + window.screen.availWidth + 'x' + window.screen.availHeight);
         // console.log('browser: ' + window.outerWidth + 'x' + window.outerHeight);
         var pixelsAvailable = window.screen.availWidth * window.screen.availHeight;
         var pixelsUsed = window.outerWidth * window.outerHeight;
         var viewportUse = pixelsUsed / pixelsAvailable;
         if (viewportUse < 1) {
            var data = {
               student: fingerprint,
               viewportUse: viewportUse
            };
            Socket.emit('student:resized', data);
         }
      }

      if (!User.isStudent()) {

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

         Socket.on('student:distracted', function(student) {
            Modal.open('shadyStudent', student.name + ' might have strayed on the wrong path.');
         });

         Socket.on('student:resized', function(data) {
            Modal.open('shadyStudent', data.student.name + '\'s browser covers only ' + Math.round(data.viewportUse * 100) + '% of the screen. Something\'s fishy!');
         });

         $scope.start = function() {
            Modal.open('setDuration', 'The exam will automatically end in exactly', function(minutes) {
               if (minutes) {
                  Socket.emit('exam:start', {
                     examId: fingerprint.examId,
                     duration: (parseInt(minutes) * 60000)
                  });
               }
            });
         };

         $scope.finish = function() {
            Modal.open('confirm', 'Are you sure you want to end the exam early? There is no going back.', function(confirm) {
               if (confirm) {
                  Socket.emit('exam:finish', fingerprint.examId);
                  Timer.stop();
                  Socket.emit('user:leave', fingerprint);
                  ExamTake.reset();
                  $state.go('exams');
               }
            }, 'Collect');
         };

         $scope.leave = function() {
            if ($scope.students.length) {
               Socket.emit('exam:finish', fingerprint.examId);
            }
            Socket.emit('user:leave', fingerprint);
            ExamTake.reset();
            $state.go('exams');
         };

         $scope.adjustTimer = function() {
            // Modal.open('setDuration', 'The exam will automatically end in exactly', function(duration) {
            //    if (duration) {
            //       duration: parseInt(duration) * 60000
            //    }
            // });
         };

         $scope.showStudents = function() {
            Modal.open('studentsList', $scope.students);
         };

         $scope.toggleSolution = function(answer) {
            var temp = answer.content;
            answer.content = answer.solution;
            answer.solution = temp;
         };

      } else {

         var distractionHandler = function() {
            if ($scope.exam.started) {
               Socket.emit('student:distracted', fingerprint);
            }
         };

         var resizeHandler = function() {
            if ($scope.exam.started) {
               checkViewportUse();
            }
         };

         window.addEventListener('blur', distractionHandler);

         window.addEventListener('resize', _.debounce(resizeHandler, 1000));

         $scope.$on('$destroy', function() {
            window.removeEventListener('blur', distractionHandler);
            window.removeEventListener('resize', resizeHandler);
         });

      }

      Socket.emit('user:identify', fingerprint);

      Socket.on('exam:started', function(exam) {
         Timer.start(exam.start, exam.duration);
         var endTime = moment(exam.start).add(exam.duration);
         var prompt = 'The exam has begun. It will end at exactly ' + endTime.format('HH:mm') + '.';
         if (User.isStudent()) {
            prompt += ' Good luck!';
         }
         Modal.open('examStarted', prompt, function() {
            $scope.exam.started = true;
            if (User.isStudent()) {
               checkViewportUse();
            }
         });
      });

      Socket.on('exam:finished', function() {
         Timer.stop();
         Socket.emit('user:leave', fingerprint);
         Modal.open('examFinished', 'The exam has ended.', function() {
            if (User.isStudent()) {
               ExamTake.store();
            } else {
               ExamTake.reset();
               $state.go('exams');
            }
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
            if (User.isStudent()) {
               ExamTake.data.student = {
                  name: User.data.name,
                  id: User.data.id
               };
            }
         }, function(err) {

         });
      }

      $scope.handIn = function() {
         Modal.open('confirm', 'Do you want to hand in the exam early? There is no going back.', function(confirmed) {
            if (confirmed) {
               Timer.stop();
               Socket.emit('user:leave', fingerprint);
               ExamTake.store();
            }
         }, 'Hand in');
      };

   }]);
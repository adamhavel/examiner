'use strict';

angular.module('app.exams.take')

   .controller('ExamTakeController',
   ['$scope', '$stateParams', '$state', 'Blueprint', 'ExamTake', 'Modal', 'Socket', 'User',
   function($scope, $stateParams, $state, Blueprint, ExamTake, Modal, Socket, User) {

      var fingerprint = {
         role: User.role,
         name: User.name,
         id: User.id,
         examId: $stateParams.subject
      }

      $scope.users = [];

      Socket.on('init', function(users) {
         $scope.users = users;
         Socket.emit('identify', fingerprint);
      });

      Socket.on('user:registered', function(user) {
         $scope.users.push(user);
      });

      window.addEventListener('blur', function() {
      });

      $scope.$on('$destroy', function() {

      });

      $scope.store = function() {
         Modal.open('confirm', 'Do you want to hand in the exam early? There is no going back.', function(confirmed) {
            if (confirmed) {
               Socket.emit('finished', fingerprint);
               ExamTake.reset();
               $state.go('home');
            }
         }, 'Hand in');
      };

      $scope.exam = ExamTake.data;
      if (!ExamTake.isOngoing) {
         Socket.emit('register', fingerprint);
         ExamTake.data = Blueprint.get({
            subject: $stateParams.subject,
            date: $stateParams.date,
            lang: $stateParams.lang
         }, function() {
            $scope.exam = ExamTake.data;
            $scope.exam.student = {
               name: User.name,
               id: User.id
            };
            ExamTake.isOngoing = true;
         }, function(err) {

         });
      }

   }]);
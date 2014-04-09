'use strict';

angular.module('app.exams.take')

   .controller('ExamTakeController',
   ['$scope', '$stateParams', '$state', 'Blueprint', 'ExamTake', 'Modal', 'Socket',
   function($scope, $stateParams, $state, Blueprint, ExamTake, Modal, Socket) {

      Socket.on('init', function(data) {
         console.log(data);
      });

      Socket.on('send:message', function(message) {
         console.log(message);
      });

      window.addEventListener('blur', function() {
      });

      $scope.exam = Blueprint.get({
         subject: $stateParams.subject,
         date: $stateParams.date,
         lang: $stateParams.lang
      }, function(blueprint) {

      }, function() {
         //$state.go('blueprints');
      });

      $scope.exam = ExamTake.data;
      if (!ExamTake.isOngoing()) {
         ExamTake.data = Blueprint.get({
            subject: $stateParams.subject,
            date: $stateParams.date,
            lang: $stateParams.lang
         }, function(blueprint) {
            $scope.exam.ongoing = true;
            $scope.exam.student = 'Adam Havel';
         }, function() {
            //$state.go('blueprints');
         });
      }

   }]);
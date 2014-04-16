'use strict';

angular.module('app.exams')

   .controller('ExamsController',
   ['$scope', '$stateParams', '$state', 'Blueprints', 'Modal', 'User',
   function($scope, $stateParams, $state, Blueprints, Modal, User) {

      $scope.subject = $stateParams.subject;

      $scope.examTerms = Blueprints.query({
         subject: $scope.subject
      }, function(examTerms) {

         if ($scope.subject) {
            $scope.items = examTerms;
         } else {
            $scope.items = _.uniq(_.pluck(examTerms, 'subject'));
         }

      });

   }]);
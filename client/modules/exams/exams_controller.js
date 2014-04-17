'use strict';

angular.module('app.exams')

   .controller('PendingExamsController',
   ['$scope', '$stateParams', '$state', 'Blueprints', 'Modal', 'User',
   function($scope, $stateParams, $state, Blueprints, Modal, User) {

      $scope.subject = $stateParams.subject;

      Blueprints.query({
         subject: $scope.subject
      }, function(examTerms) {

         examTerms = _.groupBy(examTerms, function(examTerm) {
            return examTerm.subject;
         });

         var subjects = _.keys(examTerms);

         if (subjects.length === 1) {
            $scope.subject = subjects[0];
         }

         if ($scope.subject) {
            $scope.items = examTerms[$scope.subject];
         } else {
            $scope.items = subjects;

         }

      });

   }])

   .controller('PastExamsController',
   ['$scope', '$stateParams', '$state', 'Exams', 'Modal',
   function($scope, $stateParams, $state, Exams, Modal) {

      $scope.subject = $stateParams.subject;

      Exams.query({
         subject: $scope.subject
      }, function(exams) {

         exams = _.groupBy(exams, function(exam) {
            return exam.subject;
         });

         var subjects = _.keys(exams);

         if (subjects.length === 1) {
            $scope.subject = subjects[0];
         }

         if ($scope.subject) {
            $scope.items = exams[$scope.subject];
         } else {
            $scope.items = [];
            _.forEach(subjects, function(subject) {
               var item = {
                  subject: subject,
               };
               item.urgent = _.some(exams[subject], function(exam) {
                  return !exam.evaluated;
               });
               $scope.items.push(item);
            });
         }

      });

   }]);
'use strict';

angular.module('app.exams')

   .controller('PendingExamsController',
   ['$scope', '$stateParams', '$state', 'Blueprints', 'Modal', 'User',
   function($scope, $stateParams, $state, Blueprints, Modal, User) {

      $scope.subject = $stateParams.subject;

      Blueprints.query({
         fields: 'subject,date,lang'
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
      $scope.date = $stateParams.date;

      Exams.query({
         fields: 'subject,date,lang,evaluated,student'
      }, function(exams) {

         exams = _.groupBy(exams, function(exam) {
            return exam.subject;
         });

         var subjects = _.keys(exams);

         _.forEach(subjects, function(subject) {
            exams[subject] = _.groupBy(exams[subject], function(exam) {
               return exam.date;
            });
         });

         if (subjects.length === 1) {
            $scope.subject = subjects[0];
         }

         var dates = [];
         if ($scope.subject) {
            dates = _.keys(exams[$scope.subject]);
            if (dates.length === 1) {
               $scope.date = dates[0];
            }
         }

         if ($scope.date && $scope.subject) {
            $scope.items = exams[$scope.subject][$scope.date];
         } else if ($scope.subject) {
            $scope.items = [];
            _.forEach(dates, function(date) {
               var item = {
                  subject: $scope.subject,
                  date: date
               };
               item.urgent = _.some(exams[$scope.subject][date], function(exam) {
                  return exam.evaluated === null;
               });
               $scope.items.push(item);
            });
         } else {
            $scope.items = [];
            _.forEach(subjects, function(subject) {

               var item = {
                  subject: subject
               };

               item.urgent = _.some(_.values(exams[subject]), function(date) {
                  return _.some(date, function(exam) {
                     return exam.evaluated === null;
                  });
               });

               $scope.items.push(item);
            });
         }

      });

   }]);
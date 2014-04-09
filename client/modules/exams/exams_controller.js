'use strict';

angular.module('app.exams')

   .controller('ExamsController',
   ['$scope', '$stateParams', '$state', 'ExamTerms', 'Modal',
   function($scope, $stateParams, $state, ExamTerms, Modal) {

      $scope.examTerms = ExamTerms;

      $scope.takeExam = function(examTerm) {
         Modal.open('confirm', 'Are you sure?', function(confirm) {
            if (confirm) {
               $state.go('takeExam', {
                  subject: examTerm.subject,
                  date: examTerm.date,
                  lang: 'en'
               });
            }
         });
      };

   }]);
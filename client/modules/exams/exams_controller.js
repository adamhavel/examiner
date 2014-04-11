'use strict';

angular.module('app.exams')

   .controller('ExamsController',
   ['$scope', '$stateParams', '$state', 'ExamTerms', 'ExamTake', 'Modal',
   function($scope, $stateParams, $state, ExamTerms, ExamTake, Modal) {

      if (ExamTake.isOngoing) {
         $state.go('exam', {
            subject: ExamTake.data.subject,
            date: ExamTake.data.date,
            lang: ExamTake.data.lang
         });
      }

      $scope.examTerms = ExamTerms;

      $scope.takeExam = function(examTerm) {
         Modal.open('confirm', 'Are you sure?', function(confirm) {
            if (confirm) {
               $state.go('exam', {
                  subject: examTerm.subject,
                  date: examTerm.date,
                  lang: 'en'
               });
            }
         });
      };

   }]);
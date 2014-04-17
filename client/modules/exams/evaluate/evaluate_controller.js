'use strict';

angular.module('app.exams.evaluate')

   .controller('ExamEvaluateController',
   ['$scope', '$stateParams', '$state', 'Exam', 'ExamEvaluation', 'Modal',
   function($scope, $stateParams, $state, Exam, ExamEvaluation, Modal) {

      $scope.discard = function() {
         Modal.open('confirm', 'Do you want to hold off the evaluation for another time? All work in-progress will be lost.', function(confirmed) {
            if (confirmed) {
               ExamEvaluation.reset();
               $state.go('pastExams');
            }
         }, 'Hold off');
      };

      $scope.exam = ExamEvaluation.data;
      $scope.blueprint = ExamEvaluation.data._blueprint;

      if (!ExamEvaluation.isOngoing) {
         ExamEvaluation.data = Exam.get({
            subject: $stateParams.subject,
            date: $stateParams.date,
            lang: $stateParams.lang,
            uid: $stateParams.uid
         }, function() {
            $scope.exam = ExamEvaluation.data;
            $scope.blueprint = ExamEvaluation.data._blueprint;
            ExamEvaluation.isOngoing = true;
         });
      }

   }]);
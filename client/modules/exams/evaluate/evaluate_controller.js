'use strict';

angular.module('app.exams.evaluate')

   .controller('ExamEvaluateController',
   ['$scope', '$stateParams', '$state', 'Exam', 'ExamEvaluation', 'Modal',
   function($scope, $stateParams, $state, Exam, ExamEvaluation, Modal) {

      $scope.discard = function() {
         Modal.open('confirm', 'Are you sure about leaving the ongoing evaluation? All work in-progress will be lost.', function(confirmed) {
            if (confirmed) {
               var directions = {
                  subject: $stateParams.subject,
                  date: $stateParams.date
               };
               ExamEvaluation.reset();
               $state.go('pastExams', directions);
            }
         }, 'Leave');
      };

      $scope.store = function() {
         Modal.open('save', 'You are about to finish the evaluation. You can edit it anytime later. Do you want to continue?', function(confirmed) {
            if (confirmed) {
               ExamEvaluation.store();
            }
         });
      };

      $scope.reevaluate = function() {
         ExamEvaluation.isOngoing = true;
         ExamEvaluation.save();
      };

      $scope.raisePoints = function(section, question) {
         if (question.answer.points < question.points) {
            question.answer.points++;
            section.points++;
         }
      };

      $scope.lowerPoints = function(section, question) {
         question.answer.points--;
         section.points--;
      };

      $scope.toggleSolution = function(answer) {
         var temp = answer.content;
         answer.content = answer.solution;
         answer.solution = temp;
      };

      if (ExamEvaluation.isOngoing) {
         $scope.exam = ExamEvaluation.data;
         $scope.blueprint = ExamEvaluation.data._blueprint;
      } else {
         ExamEvaluation.data = Exam.get({
            subject: $stateParams.subject,
            date: $stateParams.date,
            lang: $stateParams.lang,
            uid: $stateParams.uid
         }, function() {
            $scope.exam = ExamEvaluation.data;
            $scope.blueprint = $scope.exam._blueprint;
            _.forEach($scope.blueprint.sections, function(section) {
               section.maxPoints = section.points;
            });
            ExamEvaluation.linkAnswers();
            if ($scope.exam.evaluated === null) {
               ExamEvaluation.isOngoing = true;
               ExamEvaluation.save();
            }
         });
      }

   }]);
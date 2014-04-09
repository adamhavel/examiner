'use strict';

angular.module('app.examterms')

   .controller('ExamTermsController',
   ['$scope', '$stateParams', '$state', 'ExamTerms', 'NewBlueprint', 'Modal',
   function($scope, $stateParams, $state, ExamTerms, NewBlueprint, Modal) {

      $scope.blueprint = NewBlueprint.data;
      if (NewBlueprint.isOngoing()) {
         $state.go('newBlueprint', {
            subject: $scope.blueprint.subject,
            date: $scope.blueprint.date,
            lang: $scope.blueprint.lang
         });
      }

      $scope.examTerms = ExamTerms;

      $scope.createBlueprint = function(examTerm) {
         Modal.open('chooseLanguage', 'Please choose the language of the exam.', function(lang) {
            $state.go('newBlueprint', {
               subject: examTerm.subject,
               date: examTerm.date,
               lang: lang
            });
         });
      };

   }]);
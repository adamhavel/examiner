'use strict';

angular.module('app.examterms')

   .controller('ExamTermsController',
   ['$scope', '$stateParams', '$state', 'ExamTerms', 'Modal',
   function($scope, $stateParams, $state, ExamTerms, Modal) {

      $scope.examTerms = ExamTerms;

      $scope.createBlueprint = function(examTerm) {
         Modal.open('chooseLanguage', 'The exam can be taken in the following languages – please pick one.', function(lang) {
            $state.go('newBlueprint', {
               subject: examTerm.subject,
               date: examTerm.date,
               lang: lang
            });
         });
      };

   }]);
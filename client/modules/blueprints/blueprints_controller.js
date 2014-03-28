'use strict';

angular.module('app.blueprints')

   .controller('BlueprintsController', ['$scope', 'Blueprints', 'dateFilter',
   function($scope, Blueprints, dateFilter) {

      $scope.blueprints = Blueprints.query({
         subject: 'mi-mdw',
         date: '2014-02-10',
         lang: 'en'
      });

      $scope.dateFilter = dateFilter;

   }])

   .controller('BlueprintController', ['$scope', '$stateParams', '$state', 'Blueprint',
   function($scope, $stateParams, $state, Blueprint) {

      $scope.blueprint = Blueprint.get({
         subject: $stateParams.subject,
         date: $stateParams.date,
         lang: $stateParams.lang
      }, function(blueprint) {
         blueprint.sections.forEach(function(section, i) {
            section.name = section.name || 'Section ' + (i+1);
            section.questions.forEach(function(question, j) {
               question.name = question.name || 'Question ' + (i+1) + '.' + (j+1);
            });
         });
      }, function(err) {
         $state.go('blueprints');
      });

      $scope.activeQuestion = 0;
      $scope.activeSection = 0;

   }]);
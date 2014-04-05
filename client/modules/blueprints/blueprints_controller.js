'use strict';

angular.module('app.blueprints')

   .controller('BlueprintsController',
   ['$scope', '$stateParams', '$state', 'Blueprints', 'dateFilter',
   function($scope, $stateParams, $state, Blueprints, dateFilter) {

      var filter = $stateParams.filter.substr(1).split('/') || null;
      $scope.subject = filter[0] || null;
      $scope.date = filter[1] || null;
      $scope.lang = filter[2] || null;

      if ($scope.subject) {
         $scope.level = 'date';
      } else {
         $scope.level = 'subject';
      }

      $scope.subjects = [];
      $scope.dates = [];

      $scope.blueprints = Blueprints.query({
         subject: $scope.subject,
         date: $scope.date,
         lang: $scope.lang
      }, function(blueprints) {
         blueprints.forEach(function(blueprint) {
            var subject = blueprint.subject;
            if ($scope.subjects.indexOf(subject) === -1) {
               $scope.subjects.push(blueprint.subject);
            }
         });
      }, function() {
         $state.go('blueprints');
      });

      $scope.dateFilter = dateFilter;

   }])

   .controller('BlueprintViewController', ['$scope', '$stateParams', '$state', 'Blueprint',
   function($scope, $stateParams, $state, Blueprint) {

      $scope.blueprint = Blueprint.get({
         subject: $stateParams.subject,
         date: $stateParams.date,
         lang: $stateParams.lang
      }, function(blueprint) {

      }, function() {
         $state.go('blueprints');
      });

   }]);
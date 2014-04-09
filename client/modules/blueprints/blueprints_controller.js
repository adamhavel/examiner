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

   .controller('BlueprintController',
   ['$scope', '$stateParams', '$state', 'Blueprint', 'NewBlueprint',
   function($scope, $stateParams, $state, Blueprint, NewBlueprint) {

      function adjustForTimezone(date) {
         var offset = date.getTimezoneOffset();
         return new Date(date.getTime() + offset*60000);
      }

      $scope.blueprint = Blueprint.get({
         subject: $stateParams.subject,
         date: $stateParams.date,
         lang: $stateParams.lang
      }, function(blueprint) {
         $scope.editable = adjustForTimezone(new Date(blueprint.date)) > new Date();
      }, function() {
         $state.go('blueprints');
      });

      $scope.copyQuestion = function(question) {
         var sections = NewBlueprint.data.sections;
         sections[sections.length - 1].questions.push(question);
      };

      $scope.clone = function() {
         var directions = {
            subject: NewBlueprint.data.subject,
            date: NewBlueprint.data.date,
            lang: NewBlueprint.data.lang
         };
         NewBlueprint.data = angular.fromJson(angular.toJson($scope.blueprint));
         NewBlueprint.data.subject = directions.subject;
         NewBlueprint.data.date = directions.date;
         NewBlueprint.data.lang = directions.lang;
         NewBlueprint.data.ongoing = true;
         $state.go('newBlueprint', directions);
      };

   }]);
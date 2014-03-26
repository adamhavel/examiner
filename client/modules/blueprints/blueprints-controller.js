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

   .controller('BlueprintController', ['$scope', '$stateParams', '$anchorScroll', '$location', 'Blueprint',
   function($scope, $stateParams, $anchorScroll, $location, Blueprint) {

      $scope.blueprint = Blueprint.get({
         subject: $stateParams.subject,
         date: $stateParams.date,
         lang: $stateParams.lang
      });

      $scope.scrollTo = function(id) {
         $location.hash(id);
         $anchorScroll();
      };

   }]);
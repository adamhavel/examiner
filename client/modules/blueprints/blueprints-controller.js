'use strict';

angular.module('app.blueprints').controller('BlueprintsController', ['$scope', 'Blueprints', function($scope, Blueprints) {

   $scope.blueprints = Blueprints.query({
      subject: 'mi-mdw',
      date: '2014-02-10',
      lang: 'en'
   });

}]);
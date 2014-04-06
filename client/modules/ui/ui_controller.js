angular.module('app.ui')

   .controller('UIController',
   ['$scope', '$state', 'Modal', 'NewBlueprint',
   function($scope, $state, Modal, NewBlueprint) {

      $scope.state = $state;

      $scope.modal = Modal;

      $scope.newBlueprint = NewBlueprint;

   }]);
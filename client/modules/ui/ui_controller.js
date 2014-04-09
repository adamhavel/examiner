angular.module('app.ui')

   .controller('UIController',
   ['$scope', '$state', 'Modal', 'NewBlueprint', 'User',
   function($scope, $state, Modal, NewBlueprint, User) {

      $scope.state = $state;

      $scope.modal = Modal;

      $scope.newBlueprint = NewBlueprint;

      $scope.user = User;

   }]);
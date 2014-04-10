angular.module('app.ui')

   .controller('UIController',
   ['$scope', '$state', 'Modal', 'NewBlueprint', 'ExamTake', 'User',
   function($scope, $state, Modal, NewBlueprint, ExamTake, User) {

      $scope.state = $state;

      $scope.modal = Modal;

      $scope.blueprint = NewBlueprint;

      $scope.examTake = ExamTake;

      $scope.user = User;

   }]);
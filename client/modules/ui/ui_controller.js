angular.module('app.ui')

   .controller('UIController',
   ['$scope', '$state', 'Modal', 'NewBlueprint', 'ExamTake', 'Timer', 'User',
   function($scope, $state, Modal, NewBlueprint, ExamTake, Timer, User) {

      $scope.state = $state;

      $scope.modal = Modal;

      $scope.newBlueprint = NewBlueprint;

      $scope.examTake = ExamTake;

      $scope.timer = Timer;

      $scope.user = User;

   }]);
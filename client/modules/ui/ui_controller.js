angular.module('app.ui')

   .controller('UIController',
   ['$scope', '$state', 'Modal', 'ExamEvaluation', 'NewBlueprint', 'ExamTake', 'Timer', 'User',
   function($scope, $state, Modal, ExamEvaluation, NewBlueprint, ExamTake, Timer, User) {

      $scope.state = $state;

      $scope.modal = Modal;

      $scope.evaluation = ExamEvaluation;

      $scope.newBlueprint = NewBlueprint;

      $scope.examTake = ExamTake;

      $scope.timer = Timer;

      $scope.user = User;

   }]);
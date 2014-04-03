angular.module('app.ui')

   .controller('UIController', ['$scope', 'Modal', function($scope, Modal) {

      $scope.modalContent = null;
      $scope.modalCallback = null;

      $scope.openModal = function(type, prompt, callback) {
         $scope.modalType = type;
         $scope.modalPrompt = prompt;
         $scope.modalCallback = callback;
      };

   }]);
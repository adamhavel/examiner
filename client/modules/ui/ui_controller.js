angular.module('app.ui')

   .controller('UIController', ['$scope', 'Modal', function($scope, Modal) {

      $scope.modalContent = null;

      $scope.openModal = function(content) {
         $scope.modalContent = 'partials/test.html';
      };

      $scope.closeModal = function() {
         $scope.modalContent = null;
      };

   }]);
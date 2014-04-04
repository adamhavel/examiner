angular.module('app.ui')

   .controller('UIController', ['$scope', 'Modal', function($scope, Modal) {

      $scope.modal = null;

      $scope.openModal = function(type, prompt, callback, secondaryActionLabel, primaryActionLabel) {
         $scope.modal = {
            type: type,
            prompt: prompt,
            primaryActionLabel: primaryActionLabel || null,
            secondaryActionLabel: secondaryActionLabel || null,
            callback: callback
         }
      };

   }]);
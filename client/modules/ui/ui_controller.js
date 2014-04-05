angular.module('app.ui')

   .controller('UIController', ['$scope', 'Modal', function($scope, Modal) {

      $scope.modal = Modal;

   }]);
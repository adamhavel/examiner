'use strict';

angular.module('app.user')

   .controller('UserController',
      ['$scope', '$stateParams', '$state', 'Modal', 'User',
      function($scope, $stateParams, $state, Modal, User) {

         $scope.login = function() {
            User.login($scope.uid, $scope.password).then(function() {
                  $state.go('exams');
            }, function(err) {
               console.log('yay');
            });
         };

      }]);
'use strict';

angular.module('app')

   .directive('contenteditable', function() {
      return {
         restrict: 'A',
         require: '?ngModel',
         link: function($scope, $element, attrs, ngModel) {

            if (!ngModel) {
              return;
            }

            $element.on('keydown', function(e) {
               if (e.keyCode === 9 || e.keyCode === 13) {
                  e.preventDefault();
               }
            });

            $element.on('input', function() {
               $scope.$apply(function() {
                  ngModel.$setViewValue($element.text());
               });
            });

            ngModel.$render = function() {
               $element.html(ngModel.$viewValue || '');
            };

         }
      };
   });
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
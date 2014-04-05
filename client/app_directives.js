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
                  ngModel.$setViewValue($element.html());
               });
            });

            ngModel.$render = function() {
               $element.html(ngModel.$viewValue || '');
            };

         }
      };
   })

   .directive('ngSwitchable', function() {
      return {
         restrict: 'C',
         link: function($scope, $element) {

            function getElements(selector, parent) {
               parent = parent || document;
               var elements = parent.querySelectorAll(selector),
                   arr = [];
               for (var i = elements.length; i--; arr.unshift(elements[i]));
               return arr;
            }

            $element.on('click', function() {

               if ($element.hasClass('ng-active')) {

                  $element.removeClass('ng-active');

               } else {

                  var items = getElements('.ng-switchable', $element.parent().parent()[0]);

                  items.forEach(function(item) {
                     item.classList.remove('ng-active');
                  });

                  $element.addClass('ng-active');

               }

            });

         }
      };
   });
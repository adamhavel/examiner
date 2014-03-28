'use strict';

angular.module('app')

   .directive('ngSmoothScroll', function() {

      var elemOffset;

      function smoothScroll() {
         var currentOffset = window.pageYOffset;
         var difference = elemOffset - currentOffset;
         if (difference !== 0) {
            var step = difference / 5;
            var targetOffset = currentOffset + (difference > 0 ? Math.ceil(step) : Math.floor(step));
            window.scrollTo(0, targetOffset);
            requestAnimationFrame(smoothScroll);
         }
      }

      return {
         restrict: 'A',
         scope: {
            href: '@',
         },
         link: function(scope, element) {

            element.on('click', function(e) {
               e.preventDefault();
               var target = scope.href.substr(scope.href.indexOf('#'));
               elemOffset = document.querySelector(target).offsetTop - 10;
               requestAnimationFrame(smoothScroll);
            });
         }
      };
   });
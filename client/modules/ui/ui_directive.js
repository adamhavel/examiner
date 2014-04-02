angular.module('app.ui')

   .directive('smoothScroll', function() {

      var elemOffset,
          previousOffset;

      function smoothScroll() {
         var currentOffset = window.pageYOffset;
         var difference = elemOffset - currentOffset;
         if (difference !== 0 && previousOffset !== currentOffset) {
            var step = difference / 5;
            var targetOffset = currentOffset + (difference > 0 ? Math.ceil(step) : Math.floor(step));
            window.scrollTo(0, targetOffset);
            requestAnimationFrame(smoothScroll);
            previousOffset = currentOffset;
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
               previousOffset = null;
               requestAnimationFrame(smoothScroll);
            });
         }
      };
   })

   .directive('modal', function() {
      return {
         restrict: 'E',
         scope: {
            content: '@'
         },
         templateUrl: 'partials/modal.html'
      };
   });
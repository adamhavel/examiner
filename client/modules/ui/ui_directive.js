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
         link: function($scope, $element) {

            $element.on('click', function(e) {
               e.preventDefault();
               var target = $scope.href.substr($scope.href.indexOf('#'));
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
            type: '=',
            callback: '=',
            prompt: '='
         },
         templateUrl: 'partials/modal.html',
         controller: ['$scope', '$q', function($scope, $q) {

            $scope.close = function() {
               $scope.type = null;
               $scope.callback = null;
               $scope.prompt = null;
               $scope.input = null;
            };

            function isImage(src) {

               var deferred = $q.defer();

               var image = new Image();
               image.addEventListener('error', function() {
                    deferred.resolve(false);
               });
               image.addEventListener('load', function() {
                    deferred.resolve(true);
               });
               image.src = src;
               image = null;

               return deferred.promise;
            }


            $scope.submitImage = function() {
               isImage($scope.input).then(function(passed) {
                  // TODO:
                  // provide loading visuals
                  if (passed) {
                     $scope.callback($scope.input);
                     $scope.close();
                  } else {
                     //document.querySelector('.modal').querySelector('input').setCustomValidity("Ray is wack!");
                  }
               });
            };

         }]
      };
   });
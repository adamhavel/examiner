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
               elemOffset = document.querySelector(target).offsetTop;
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
            modal: '=content'
         },
         templateUrl: 'partials/modal.html',
         controller: ['$scope', '$timeout', 'ImageHandler', 'Modal', function($scope, $timeout, ImageHandler, Modal) {

            $scope.close = function() {
               Modal.close();
               if (Modal.queue.length) {
                  $timeout(function() {
                     Modal.content = Modal.queue.shift();
                  }, 400);
               }
            };

            $scope.confirm = function() {
               var callback = $scope.modal.callback;
               if (callback) {
                  $timeout(function() {
                     callback(callback.value || true);
                  }, 200);
               }
               $scope.close();
            };

            $scope.submitImage = function() {
               var callback = $scope.modal.callback;
               $scope.loading = true;
               ImageHandler.isImage(callback.value).then(function(passed) {
                  // TODO:
                  // provide loading visuals
                  $scope.loading = false;
                  if (Modal.content) {
                     if (passed) {
                        callback(callback.value);
                        $scope.close();
                     } else {
                        //document.querySelector('.modal').querySelector('input').setCustomValidity("Ray is wack!");
                     }
                  }
               });
            };

         }]
      };
   });
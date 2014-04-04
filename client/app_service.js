'use strict';

angular.module('app')

   .factory('ImageHandler', ['$q', function($q) {

      var api = {

         isImage: function(src) {

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

      }

      return api;
   }]);
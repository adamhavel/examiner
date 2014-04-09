'use strict';

angular.module('app')

   .factory('Socket', ['$rootScope', function($rootScope) {
      var socket = io.connect();
      return {

         on: function (eventName, callback) {
            socket.on(eventName, function() {
               var args = arguments;
               $rootScope.$apply(function() {
                  callback.apply(socket, args);
               });
            });
         },

         emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
               var args = arguments;
               $rootScope.$apply(function() {
                  if (callback) {
                     callback.apply(socket, args);
                  }
               });
            })
         }

      };
   }])

   .factory('ImageHandler', ['$q', function($q) {

      return {

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

      };

   }]);
'use strict';

angular.module('app.blueprints')

   .factory('Blueprints', ['$resource', function($resource) {
      return $resource('blueprints/:subject/:date/:lang', null);
   }])

   .factory('Blueprint', ['$resource', function($resource) {
      return $resource('blueprint/:subject/:date/:lang', null);
   }]);
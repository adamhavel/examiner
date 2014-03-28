'use strict';

angular.module('app.blueprints')

   .factory('Blueprints', ['$resource', function($resource) {
      return $resource('api/blueprints/:subject/:date/:lang', null);
   }])

   .factory('Blueprint', ['$resource', function($resource) {
      return $resource('api/blueprint/:subject/:date/:lang', null);
   }]);
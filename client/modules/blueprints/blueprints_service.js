'use strict';

angular.module('app.blueprints')

   .factory('Blueprint', ['$resource', function($resource) {
      return $resource('api/blueprint/:subject/:date/:lang', {
         subject: '@subject',
         date: '@date',
         lang: '@lang'
      });
   }])

   .factory('Blueprints', ['$resource', function($resource) {
      return $resource('api/blueprints', {
         subject: '@subject',
         date: '@date',
         lang: '@lang',
         fields: '@lang'
      });
   }]);
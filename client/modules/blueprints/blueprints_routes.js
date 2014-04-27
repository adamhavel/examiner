'use strict';

angular.module('app.blueprints').config([
   '$stateProvider',
   function($stateProvider) {

      $stateProvider
         .state('blueprints', {
            url: '/blueprints/{subject}',
            params: {
               subject: { value: null }
            },
            templateUrl: 'partials/blueprints.html',
            controller: 'BlueprintsController'
         })
         .state('blueprint', {
            url: '/blueprint/:subject/:date/:lang',
            templateUrl: 'partials/blueprint.html',
            controller: 'BlueprintController'
         });

   }
]);
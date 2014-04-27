'use strict';

angular.module('app.blueprints.create').config([
   '$stateProvider',
   function($stateProvider) {

      $stateProvider
         .state('examTerms', {
            url: '/new',
            templateUrl: 'partials/examTerms.html',
            controller: 'ExamTermsController'
         })
         .state('newBlueprint', {
            url: '/new/:subject/:date/:lang',
            templateUrl: 'partials/newBlueprint.html',
            controller: 'BlueprintCreateController'
         });

   }
]);
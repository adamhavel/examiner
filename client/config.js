'use strict';

angular.module('app').config([
   '$stateProvider', '$urlRouterProvider', '$locationProvider',
   function($stateProvider, $urlRouterProvider, $locationProvider) {

      $locationProvider.html5Mode(true).hashPrefix('!');

      $urlRouterProvider.otherwise('/');

      $stateProvider
         .state('home', {
            url: '/',
            templateUrl: 'partials/home.html'
         })
         .state('blueprints', {
            url: '/blueprints{filter:.*}',
            templateUrl: 'partials/blueprints.html',
            controller: 'BlueprintsController'
         })
         .state('blueprint', {
            url: '/blueprint/:subject/:date/:lang',
            templateUrl: 'partials/blueprint.html',
            controller: 'BlueprintController'
         })
         .state('examDates', {
            url: '/new',
            templateUrl: 'partials/examDates.html',
            controller: 'ExamDatesController',
         })
         .state('newBlueprint', {
            url: '/new/:subject/:date/:lang',
            templateUrl: 'partials/newBlueprint.html',
            controller: 'BlueprintCreateController',
         });

   }
]).run([
   '$rootScope', '$location',
   function($rootScope, $location) {

      $rootScope.url = $location.path();

      window.addEventListener('beforeunload', function() {
         $rootScope.$emit('save');
      });

   }
]);
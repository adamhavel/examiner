'use strict';

angular.module('app').config([
   '$stateProvider', '$urlRouterProvider', '$locationProvider',
   function($stateProvider, $urlRouterProvider, $locationProvider) {

      $locationProvider.html5Mode(true).hashPrefix('!');

      $urlRouterProvider.otherwise('/');

      $stateProvider
         .state('home', {
            url: '/',
            templateUrl: 'partials/pending.html',
            controller: 'ExamsController',
         })
         .state('takeExam', {
            url: '/take/:subject/:date/:lang',
            templateUrl: 'partials/takeExam.html',
            controller: 'ExamTakeController',
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
         .state('examTerms', {
            url: '/new',
            templateUrl: 'partials/examTerms.html',
            controller: 'ExamTermsController',
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
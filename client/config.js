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
            controller: 'BlueprintViewController'
         })
         .state('create', {
            url: '/new/:subject',
            templateUrl: 'partials/create.html',
            controller: 'BlueprintCreateController'
         });

   }
]).run([
   '$rootScope', '$location', 'webStorage',
   function($rootScope, $location, webStorage) {

      $rootScope.url = $location.path();

      /*$rootScope.$on('$locationChangeStart', function() {
         if (webStorage.get('restoreToken')) {
            $rootScope.$emit('load');
            webStorage.remove('restoreToken');
         }
      });*/

      window.addEventListener('beforeunload', function() {
         //webStorage.add('restoreToken', 'true');
         $rootScope.$emit('save');
      });

   }
]);
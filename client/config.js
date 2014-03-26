angular.module('app').config([
   '$stateProvider', '$urlRouterProvider', '$locationProvider',
   function($stateProvider, $urlRouterProvider, $locationProvider) {

   //$locationProvider.html5Mode(true).hashPrefix('!');

   $urlRouterProvider.otherwise('/');

   $stateProvider
      .state('home', {
         url: '/',
         templateUrl: 'partials/home.html'
      })
      .state('browse', {
         url: '/browse',
         templateUrl: 'partials/browse.html',
         controller: 'BlueprintsController'
      })
      .state('blueprint', {
         url: '/blueprint/:subject/:date',
         templateUrl: 'partials/home.html',
         controller: 'BlueprintsController'
      });

}]);
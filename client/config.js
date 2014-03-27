angular.module('app').config([
   '$stateProvider', '$urlRouterProvider',
   function($stateProvider, $urlRouterProvider) {

   $urlRouterProvider.otherwise('/');

   $stateProvider
      .state('home', {
         url: '/',
         templateUrl: 'partials/home.html'
      })
      .state('blueprints', {
         url: '/blueprints',
         templateUrl: 'partials/blueprints.html',
         controller: 'BlueprintsController'
      })
      .state('blueprint', {
         url: '/blueprint/:subject/:date/:lang',
         templateUrl: 'partials/blueprint.html',
         controller: 'BlueprintController'
      });

}]);
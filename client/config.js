angular.module('app').config(['$routeProvider', function($routeProvider) {
   $routeProvider.when('/view', {
      templateUrl: 'templates/template.html'
   });
   $routeProvider.otherwise({
      redirectTo: '/view'
   });
}]);
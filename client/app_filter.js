angular.module('app')

   .filter('idfy', function() {
      return function(input) {
         return input.replace(/[\s\.]/g, '-').toLowerCase();
      };
   });
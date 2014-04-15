angular.module('app')

   .filter('idfy', function() {
      return function(input) {
         return input.replace(/[\s\.]/g, '-').toLowerCase();
      };
   })

   .filter('base64', ['base64', function(base64) {
      return base64.encode;
   }]);
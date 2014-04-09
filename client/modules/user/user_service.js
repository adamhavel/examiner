'use strict';

angular.module('app.user')

   .factory('User', function() {

      var api = {
         role: 'student',
         switchRole: function() {
            if (api.role === 'student') {
               api.role = 'teacher';
            } else {
               api.role = 'student';
            }
         }
      };

      return api;

   });
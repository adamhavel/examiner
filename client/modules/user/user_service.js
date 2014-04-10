'use strict';

angular.module('app.user')

   .factory('User', function() {

      var api = {
         name: 'Adam Havel',
         id: 'havelad1',
         role: 'teacher',
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
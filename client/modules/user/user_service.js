'use strict';

angular.module('app.user')

   .factory('User', ['$rootScope', 'webStorage', function($rootScope, webStorage) {

      var User = (function() {

         var api = {
            data: {}
         };

         api.switchRole = function() {
            if (api.data.role === 'student') {
               api.data.role = 'teacher';
            } else {
               api.data.role = 'student';
            }
         };

         api.isStudent = function() {
            return api.data.role === 'student';
         };

         api.reset = function() {
            api.data = {
               name: 'Adam Havel',
               id: 'havelad1',
               role: 'teacher',
               pledge: false
            };
         };

         api.save = function() {
            webStorage.add('user', angular.toJson(api.data));
         };

         (function init() {

            var storedSession = angular.fromJson(webStorage.get('user'));
            if (storedSession) {
               api.data = storedSession;
               api.data.pledge = false;
               webStorage.remove('user');
            } else {
               api.reset();
            }

            $rootScope.$on('save', api.save);

         })();

         return api;

      })();

      return User;

   }]);
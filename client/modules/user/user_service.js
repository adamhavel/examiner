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
               role: 'teacher'
            };
         };

         api.save = function() {
            webStorage.add('user', angular.toJson(api.data));
         };

         (function init() {
            var storedSession = angular.fromJson(webStorage.get('user'));
            if (storedSession) {
               api.data = storedSession;
               webStorage.remove('user');
            } else {
               api.reset();
            }
         })();

         return api;

      })();

      $rootScope.$on('save', User.save);

      return User;

   }]);
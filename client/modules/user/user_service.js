'use strict';

angular.module('app.user')

   .factory('User', ['$rootScope', 'webStorage', function($rootScope, webStorage) {

      var User = (function() {

         var self = {
            data: null
         };

         self.switchRole = function() {
            if (self.data.role === 'student') {
               self.data.role = 'teacher';
            } else {
               self.data.role = 'student';
            }
         };

         self.isStudent = function() {
            return self.data.role === 'student';
         };

         self.reset = function() {
            self.data = {
               name: 'Adam Havel',
               id: 'havelad1',
               role: 'teacher',
               pledge: false
            };
            webStorage.remove('user');
         };

         self.save = function() {
            webStorage.add('user', angular.toJson(self.data));
         };

         (function init() {

            var storedSession = angular.fromJson(webStorage.get('user'));
            if (storedSession) {
               self.data = storedSession;
               //self.data.pledge = false;
            } else {
               self.reset();
            }

            $rootScope.$on('save', self.save);

         })();

         return self;

      })();

      return User;

   }]);
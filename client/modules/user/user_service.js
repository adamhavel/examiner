'use strict';

angular.module('app.user')

   .factory('User',
   ['$q', '$state', '$http', '$rootScope', '$timeout', 'Modal',
   function($q, $state, $http, $rootScope, $timeout, Modal) {

      var User = (function() {

         var self = {
            data: {}
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

         self.login = function(uid, password) {
            var credentials = {
               username: uid,
               password: password
            };
            var deferred = $q.defer(),
                resolved = false;
            $http.post('api/user', credentials).success(function(user) {
               self.data = user;
               self.data.id = self.data._id;
               delete self.data._id;
               deferred.resolve();
               resolved = true;
            }, function(err) {
               deferred.reject('No such user exists.');
               resolved = true;
            });
            $timeout(function() {
               if (!resolved) {
                  deferred.reject('The server is not responding. Try logging in later.');
               }
            }, 5000);
            return deferred.promise;
         };

         self.logout = function() {
            $http.delete('api/user');
            self.data = {};
         };

         self.isLoggedIn = function() {
            var deferred = $q.defer();
            $http.get('api/user').success(function(user) {
               if (user) {
                  self.data = user;
                  self.data.id = self.data._id;
                  delete self.data._id;
                  deferred.resolve(true);
               } else {
                  $state.go('login');
                  self.data = {};
                  deferred.resolve(false);
               }
            });
            return deferred.promise;
         };

         (function init() {

            self.isLoggedIn().then(function() {

               $rootScope.$on('$stateChangeStart', function(e, state, params) {

                  if (state.name !== 'login' && !self.data.id) {
                     e.preventDefault();
                     $state.go('login');
                  }

               });

            });



         })();

         return self;

      })();

      return User;

   }]);
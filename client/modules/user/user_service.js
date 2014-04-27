'use strict';

angular.module('app.user')

   .factory('User',
   ['$q', '$state', '$http', '$rootScope', '$timeout', '$animate', 'Modal',
   function($q, $state, $http, $rootScope, $timeout, $animate, Modal) {

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

         self.login = function(uid, password) {
            var credentials = {
               username: uid,
               password: password
            };

            var deferred = $q.defer(),
                resolved = false;

            $http.post('api/user', credentials).success(function(user) {
               self.data = user;
               self.isLoggedIn = true;
               deferred.resolve();
               resolved = true;
               $rootScope.$emit('loggedIn');
            }).error(function() {
               deferred.reject('No such user.');
               resolved = true;
            });

            $timeout(function() {
               if (!resolved) {
                  deferred.reject('The server is taking too long.');
               }
            }, 5000);

            return deferred.promise;
         };

         self.logout = function() {
            self.isLoggedIn = false;
            self.data = null;
            $http.delete('api/user');
         };

         self.isLoggedIn = function() {
            var deferred = $q.defer();
            if (self.data) {
               deferred.resolve(true);
            } else {
               $http.get('api/user').success(function(user) {
                  if (user) {
                     self.data = user;
                     self.isLoggedIn = true;
                     deferred.resolve(true);
                  } else {
                     self.data = null;
                     self.isLoggedIn = false;
                     deferred.resolve(false);
                  }
               });
            }
            return deferred.promise;
         };

         (function init() {

            self.isLoggedIn().then(function(isLoggedIn) {

               if (isLoggedIn) {
                  $rootScope.$emit('loggedIn');
               }

               $rootScope.$on('$stateChangeStart', function(e, state, params) {

                  if (!self.data) {
                     e.preventDefault();
                  }

               });

               $timeout(function() {
                  $animate.enabled(true);
               }, 250);

            });

         })();

         return self;

      })();

      return User;

   }])

   .factory('AuthInterceptor',
   ['$q', '$injector', 'Modal',
   function ($q, $injector, Modal) {

      return {

         'response': function(response) {
            if (response.status === 401 && $injector.get('User').data) {
               Modal.open('alert', 'Your session has been ended. You will have to authenticate.', null, 'Log in');
               $injector.get('User').logout();
               return $q.reject(response);
            } else {
               return response || $q.when(response);
            }
         },

         'responseError': function(rejection) {
            if (rejection.status === 401 && $injector.get('User').data) {
               Modal.open('alert', 'Your session has been ended. You will have to authenticate.', null, 'Log in');
               $injector.get('User').logout();
               return $q.reject(rejection);
            } else {
               return $q.reject(rejection);
            }
         }

      };
   }])

   .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');
   }]);
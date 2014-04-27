'use strict';

angular.module('app.blueprints.create')

   .factory('NewBlueprint',
   ['$resource', '$rootScope', '$state', '$timeout', 'webStorage', 'Blueprint', 'Modal', 'User',
   function($resource, $rootScope, $state, $timeout, webStorage, Blueprint, Modal, User) {

      var NewBlueprint = (function() {

         var self = {
            data: null,
            isOngoing: false
         };

         self.reset = function() {
            self.data = null;
            self.isOngoing = false;
            webStorage.remove('blueprint');
         };

         self.save = function(callback) {
            callback = callback || null;
            if (self.isOngoing) {
               var regExpHTML = /(<([^>]+)>)/g;
               _.forEach(self.data.sections, function(section) {
                  _.forEach(section.questions, function(question) {

                     var codeChunks = _.where(question.body.concat(question.answer), { 'datatype': 'code' }),
                         optionsChunks = _.where(question.answer, { 'datatype': 'options' });

                     _.forEach(codeChunks, function(chunk) {
                        if (chunk.content) {
                           chunk.content = chunk.content.replace(regExpHTML, '');
                        }
                        if (chunk.solution) {
                           chunk.solution = chunk.solution.replace(regExpHTML, '');
                        }
                     });

                     _.forEach(optionsChunks, function(chunk) {
                        chunk.content = _.map(chunk.solution, function(option) {
                           return {
                              content: option.content,
                              value: false
                           };
                        });
                     });

                  });
               });
               webStorage.add('blueprint', angular.toJson(self.data));
            }
            if (callback) {
               callback();
            }
         };

         self.store = function() {
            self.save(function() {
               $rootScope.$emit('seal');
               $timeout(function() {
                  var blueprint = new Blueprint(self.data);
                  blueprint.$save(function() {
                     Modal.open('success', 'The blueprint has been successfully saved.', function() {
                        $state.go('blueprints', { subject: self.data.subject });
                        self.reset();
                     });
                  }, function(err) {
                     Modal.open('error', 'There seems to be a problem with the server. Please try saving the blueprint later.', null, 'I understand');
                     self.data = angular.fromJson(webStorage.get('blueprint'));
                  });
               }, 1000);
            });
         };

         $rootScope.$on('loggedIn', function() {
            if (!User.isStudent() && !self.isOngoing) {
               self.init();
            }
         });

         self.init = function() {

            var storedSession = angular.fromJson(webStorage.get('blueprint'));
            if (storedSession) {
               self.data = storedSession;
               self.isOngoing = true;
            } else {
               self.reset();
            }

            $rootScope.$on('save', function() {
               self.save();
            });

            $rootScope.$on('$stateChangeStart', function(e, state, params) {

               var redirect = function() {
                  $state.go('newBlueprint', {
                     subject: self.data.subject,
                     date: self.data.date,
                     lang: self.data.lang
                  });
               };

               if (self.isOngoing && state.name === 'examTerms') {
                  e.preventDefault();
                  redirect();
               } else if (self.isOngoing && state.name === 'newBlueprint') {
                  if (params.subject !== self.data.subject || params.date !== self.data.date || params.lang !== self.data.lang) {
                     e.preventDefault();
                     Modal.open('alert', 'You can only create one blueprint at a time.', function() {
                        redirect();
                     });
                  }
               }

            });

         };

         return self;

      })();

      return NewBlueprint;

   }]);
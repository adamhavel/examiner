'use strict';

angular.module('app.blueprints.create')

   .factory('NewBlueprint',
   ['$resource', '$rootScope', '$state', '$timeout', 'webStorage', 'Blueprint', 'Modal', 'User',
   function($resource, $rootScope, $state, $timeout, webStorage, Blueprint, Modal, User) {

      var NewBlueprint = (function() {

         if (User.isStudent()) {
            return null;
         }

         var api = {
            data: null,
            isOngoing: false
         };

         api.reset = function() {
            api.data = {
               subject: null,
               date: null,
               lang: null,
               lede: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione, quidem, ullam dolorum expedita aliquam maiores distinctio esse repudiandae totam magnam saepe iusto ipsam nam a libero suscipit enim architecto nobis!',
               sections: []
            };
            api.isOngoing = false;
         };

         api.save = function(callback) {
            callback = callback || null;
            if (api.isOngoing) {
               var regExpHTML = /(<([^>]+)>)/g;
               _.forEach(api.data.sections, function(section) {
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
               webStorage.add('blueprint', angular.toJson(api.data));
            }
            if (callback) {
               callback();
            }
         };

         api.store = function() {
            api.save(function() {
               $rootScope.$emit('seal');
               $timeout(function() {
                  var blueprint = new Blueprint(api.data);
                  blueprint.$save(function() {
                     Modal.open('success', 'The blueprint has been successfully saved.', function() {
                        $state.go('blueprints', { filter: '/mi-mdw' });
                        api.reset();
                        webStorage.remove('blueprint');
                     });
                  }, function(err) {
                     Modal.open('error', 'There seems to be a problem with the server. Please try saving the blueprint later.');
                     api.data = angular.fromJson(webStorage.get('blueprint'));
                     webStorage.remove('blueprint');
                  });
               }, 1000);
            });
         };

         (function init() {

            var storedSession = angular.fromJson(webStorage.get('blueprint'));
            if (storedSession) {
               api.data = storedSession;
               api.isOngoing = true;
               webStorage.remove('blueprint');
            } else {
               api.reset();
            }

            $rootScope.$on('save', function() {
               api.save();
            });

            $rootScope.$on('$stateChangeStart', function(e, state, params) {

               var redirect = function() {
                  $state.go('newBlueprint', {
                     subject: api.data.subject,
                     date: api.data.date,
                     lang: api.data.lang
                  });
               };

               if (api.isOngoing && state.name === 'examTerms') {
                  e.preventDefault();
                  redirect();
               } else if (api.isOngoing && state.name === 'newBlueprint') {
                  if (params.subject !== api.data.subject || params.date !== api.data.date || params.lang !== api.data.lang) {
                     e.preventDefault();
                     Modal.open('alert', 'You can only create one blueprint at a time.', function() {
                        redirect();
                     });
                  }
               }

            });

         })();

         return api;

      })();

      return NewBlueprint;

   }]);
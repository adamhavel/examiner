'use strict';

angular.module('app.blueprints.create')

   .factory('NewBlueprint',
   ['$resource', '$rootScope', '$state', '$timeout', 'webStorage', 'Blueprint', 'Modal',
   function($resource, $rootScope, $state, $timeout, webStorage, Blueprint, Modal) {

      var NewBlueprint = (function() {

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

         api.save = function() {
            if (api.isOngoing) {
               var regExpHTML = /(<([^>]+)>)/g;
               api.data.sections.forEach(function(section) {
                  section.questions.forEach(function(question) {
                     question.body.forEach(function(chunk) {
                        if (chunk.datatype === 'code') {
                           chunk.content = chunk.content.replace(regExpHTML, '');
                        }
                     });
                     question.answer.forEach(function(chunk) {
                        if (chunk.datatype === 'code') {
                           chunk.solution = chunk.solution.replace(regExpHTML, '');
                           if (chunk.content) {
                              chunk.content = chunk.content.replace(regExpHTML, '');
                           }
                        } else if (chunk.datatype === 'options') {
                           chunk.content = chunk.solution.map(function(option) {
                              return {
                                 content: option.content,
                                 value: false
                              };
                           });
                        }
                     });
                  });
               });
               webStorage.add('blueprint', angular.toJson(api.data));
            }
         };

         api.store = function() {
            api.save();
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
            }, 500);
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
         })();

         return api;

      })();

      $rootScope.$on('save', NewBlueprint.save);

      $rootScope.$on('$stateChangeStart', function(e, toState) {
         if (NewBlueprint.isOngoing && toState.name === 'examTerms') {
            e.preventDefault();
            $state.go('newBlueprint', {
               subject: NewBlueprint.data.subject,
               date: NewBlueprint.data.date,
               lang: NewBlueprint.data.lang
            });
         }
      });

      return NewBlueprint;

   }]);
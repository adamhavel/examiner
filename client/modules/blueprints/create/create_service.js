'use strict';

angular.module('app.blueprints.create')

   .factory('NewBlueprint',
   ['$resource', '$rootScope', '$state', '$timeout', 'webStorage', 'Blueprint', 'Modal', 'dateFilter',
   function($resource, $rootScope, $state, $timeout, webStorage, Blueprint, Modal, dateFilter) {

      var NewBlueprint = (function() {

         var api = {
            data: {}
         };

         api.reset = function() {
            api.data = {
               ongoing: false,
               subject: null,
               date: null,
               lang: null,
               lede: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione, quidem, ullam dolorum expedita aliquam maiores distinctio esse repudiandae totam magnam saepe iusto ipsam nam a libero suscipit enim architecto nobis!',
               sections: []
            };
         };

         api.isOngoing = function() {
            return api.data.ongoing;
         };

         api.save = function() {
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
                     }
                  });
               });
            });
            webStorage.add('blueprint', angular.toJson(api.data));
         };

         api.store = function() {
            api.save();
            $rootScope.$emit('seal');
            $timeout(function() {
               var blueprint = new Blueprint(api.data);
               console.log(blueprint);
               //blueprint.date = dateFilter(blueprint.date, 'yyyy-MM-dd');
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
                  //api.data.date = new Date(api.data.date);
               });
            }, 1000);
         };

         (function init() {
            var storedSession = angular.fromJson(webStorage.get('blueprint'));
            if (storedSession) {
               api.data = storedSession;
               webStorage.remove('blueprint');
               //api.data.date = new Date(api.data.date);
            } else {
               api.reset();
            }
         })();

         return api;

      })();

      $rootScope.$on('save', NewBlueprint.save);

      return NewBlueprint;

   }]);
'use strict';

angular.module('app.exams.take')

   .factory('ExamTake',
   ['$resource', '$rootScope', '$state', '$timeout', 'webStorage', 'Modal',
   function($resource, $rootScope, $state, $timeout, webStorage, Modal) {

      var ExamTake = (function() {

         var api = {
             data: {}
         };

         api.reset = function() {
            api.data = {
               ongoing: false,
               subject: null,
               date: null,
               lang: null,
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
                        chunk.content = chunk.content.replace(regExpHTML, '');
                     }
                  });
               });
            });
            webStorage.add('exam', angular.toJson(api.data));
         };

         /*api.store = function() {
            api.save();
            $rootScope.$emit('finishBlueprint');
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
                  //api.data.date = new Date(api.data.date);
               });
            }, 1000);
         };*/

         (function init() {
            var storedSession = angular.fromJson(webStorage.get('exam'));
            if (storedSession) {
               api.data = storedSession;
               webStorage.remove('exam');
            } else {
               api.reset();
            }
         })();

         return api;

      })();

      $rootScope.$on('save', ExamTake.save);

      return ExamTake;

   }]);
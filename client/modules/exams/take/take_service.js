'use strict';

angular.module('app.exams.take')

   .factory('ExamTake',
   ['$resource', '$rootScope', '$state', '$timeout', 'webStorage', 'Exam', 'Modal', 'User',
   function($resource, $rootScope, $state, $timeout, webStorage, Exam, Modal, User) {

      var ExamTake = (function() {

         var api = {
            data: null,
            isOngoing: false
         };

         api.reset = function() {
            api.data = {
               subject: null,
               date: null,
               lang: null,
               sections: []
            };
            api.isOngoing = false;
         };

         api.save = function() {
            if (api.isOngoing) {
               var regExpHTML = /(<([^>]+)>)/g;
               _.forEach(api.data.sections, function(section) {
                  _.forEach(section.questions, function(question) {

                     var codeChunks = _.where(question.body.concat(question.answer), { 'datatype': 'code' });

                     _.forEach(codeChunks, function(chunk) {
                        if (chunk.content) {
                           chunk.content = chunk.content.replace(regExpHTML, '');
                        }
                     });

                  });
               });
               webStorage.add('exam', angular.toJson(api.data));
            }
         };

         api.store = function() {
            api.save();
            $rootScope.$emit('seal');
            $timeout(function() {
               var exam = new Exam(api.data);
               exam.answers = [];
               _.forEach(exam.sections, function(section) {
                  _.forEach(section.questions, function(question) {
                     var answer = {
                        points: 0,
                        content: []
                     };
                     _.forEach(question.answer, function(chunk) {
                        answer.content.push(chunk.content);
                     });
                     exam.answers.push(answer);
                  });
               });
               exam.sections = null;
               exam.$save(function() {
                  Modal.open('success', 'The exam has been successfully saved.', function() {
                     api.reset();
                     $state.go('home');
                     webStorage.remove('exam');
                  });
               }, function(err) {
                  Modal.open('error', 'There seems to be a problem with the server.');
                  api.data = angular.fromJson(webStorage.get('exam'));
                  webStorage.remove('exam');
               });
            }, 500);
         };

         (function init() {
            var storedSession = angular.fromJson(webStorage.get('exam'));
            if (storedSession) {
               api.data = storedSession;
               api.isOngoing = true;
               webStorage.remove('exam');
            } else {
               api.reset();
            }
         })();

         return api;

      })();

      $rootScope.$on('save', ExamTake.save);

      $rootScope.$on('$stateChangeStart', function(e, toState) {
         if (ExamTake.isOngoing && (toState.name === 'home' || (User.isStudent() && toState.name !== 'exam'))) {
            e.preventDefault();
            $state.go('exam', {
               subject: ExamTake.data.subject,
               date: ExamTake.data.date,
               lang: ExamTake.data.lang
            });
         }
      });

      return ExamTake;

   }]);
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
               exam._blueprint = api.data._id;
               _.forEach(api.data.sections, function(section) {
                  _.forEach(section.questions, function(question) {
                     var answer = {
                        content: [],
                        _question: question._id
                     };
                     _.forEach(question.answer, function(chunk) {
                        answer.content.push(chunk.content);
                     });
                     exam.answers.push(answer);
                  });
               });
               delete exam.lede;
               delete exam.sections;
               exam.$save(function() {
                  Modal.open('success', 'The exam has been successfully saved.', function() {
                     api.reset();
                     $state.go('exams');
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

      $rootScope.$on('$stateChangeStart', function(e, state, params) {

         var redirect = function() {
            $state.go('exam', {
               subject: ExamTake.data.subject,
               date: ExamTake.data.date,
               lang: ExamTake.data.lang
            });
         };

         if (ExamTake.isOngoing && (state.name === 'exams' || (User.isStudent() && state.name !== 'exam'))) {
            e.preventDefault();
            redirect();
         } else if (!ExamTake.isOngoing && User.isStudent() && state.name === 'exam' && !User.data.pledge) {
            e.preventDefault();
            Modal.open('confirm', 'Are you sure?', function(confirm) {
               if (confirm) {
                  User.data.pledge = true;
                  $state.go(state, {
                     subject: params.subject,
                     date: params.date,
                     lang: params.lang
                  });
               }
            });
         } else if (ExamTake.isOngoing && state.name === 'exam') {
            if (params.subject !== ExamTake.data.subject || params.date !== ExamTake.data.date || params.lang !== ExamTake.data.lang) {
               e.preventDefault();
               Modal.open('alert', 'You can only take one exam at a time.', function() {
                  redirect();
               });
            }
         }

      });

      return ExamTake;

   }]);
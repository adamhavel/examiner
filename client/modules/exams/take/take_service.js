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

         api.save = function(callback) {
            callback = callback || null;

            if (api.isOngoing && !webStorage.get('exam')) {
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
            if (callback) {
               callback();
            }
         };

         api.linkAnswers = function(callback) {
            api.data.answers = [];
            _.forEach(api.data.sections, function(section) {
               _.forEach(section.questions, function(question) {
                  var answer = {
                     body: [],
                     points: 0,
                     _question: question._id
                  };
                  _.forEach(question.answer, function(chunk) {
                     answer.body.push(chunk);
                     delete chunk._id;
                  });
                  api.data.answers.push(answer);
               });
            });
         };

         api.backup = function(answer) {

            if (!api.data._id) {
               api.prepare(function(exam) {
                  exam.$save(function(exam) {
                     api.data._id = exam._id;
                  });
               });
            } else {
               var chunk = new Exam({
                  _id: api.data._id,
                  subject: api.data.subject,
                  date: api.data.date,
                  lang: api.data.lang,
                  student: api.data.student,
                  answer: answer
               });
               chunk.$update(function() {

               });
            }

         };

         api.prepare = function(callback) {
            callback = callback || null;

            var exam = new Exam(api.data);
            exam.evaluated = null;
            delete exam.lede;
            delete exam.sections;

            if (callback) {
               callback(exam);
            }
         };

         api.store = function() {
            api.save(function() {
               $rootScope.$emit('seal');
               $timeout(function() {

                  api.prepare(function(exam) {

                     (function upload() {
                        exam.$save(function() {
                           Modal.open('success', 'The exam has been successfully saved.', function() {
                              api.reset();
                              $state.go('exams');
                              webStorage.remove('exam');
                           });
                        }, function(err) {
                           Modal.open('error', 'There seems to be a problem with the server.', function() {
                              upload();
                           }, 'Try again');
                        });
                     })();

                  });

               }, 1000);
            });
         };

         (function init() {

            var storedSession = angular.fromJson(webStorage.get('exam'));
            if (storedSession) {
               api.data = storedSession;
               api.isOngoing = true;
               if (User.isStudent()) {
                  api.linkAnswers();
               }
               webStorage.remove('exam');
            } else {
               api.reset();
            }

            $rootScope.$on('save', function() {
               api.save();
            });

            $rootScope.$on('$stateChangeStart', function(e, state, params) {

               var redirect = function() {
                  $state.go('exam', {
                     subject: api.data.subject,
                     date: api.data.date,
                     lang: api.data.lang
                  });
               };

               if (api.isOngoing && (state.name === 'exams' || (User.isStudent() && state.name !== 'exam'))) {
                  e.preventDefault();
                  redirect();
               } else if (!api.isOngoing && User.isStudent() && state.name === 'exam' && !User.data.pledge) {
                  e.preventDefault();
                  Modal.open('pledge', null, function(confirm) {
                     if (confirm) {
                        User.data.pledge = true;
                        $state.go(state, {
                           subject: params.subject,
                           date: params.date,
                           lang: params.lang
                        });
                     }
                  });
               } else if (api.isOngoing && state.name === 'exam') {
                  if (params.subject !== api.data.subject || params.date !== api.data.date || params.lang !== api.data.lang) {
                     e.preventDefault();
                     Modal.open('alert', 'You can only take one exam at a time.', function() {
                        redirect();
                     });
                  }
               }

            });

         })();

         return api;

      })();

      return ExamTake;

   }]);
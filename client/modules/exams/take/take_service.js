'use strict';

angular.module('app.exams.take')

   .factory('ExamTake',
   ['$resource', '$rootScope', '$state', '$timeout', 'webStorage', 'Exam', 'Modal', 'User',
   function($resource, $rootScope, $state, $timeout, webStorage, Exam, Modal, User) {

      var ExamTake = (function() {

         var self = {
            data: null,
            isOngoing: false
         };

         self.reset = function() {
            self.data = null;
            self.isOngoing = false;
            webStorage.remove('exam');
         };

         self.save = function(callback) {
            callback = callback || null;

            if (self.isOngoing) {
               var regExpHTML = /(<([^>]+)>)/g;
               _.forEach(self.data.sections, function(section) {
                  _.forEach(section.questions, function(question) {

                     var codeChunks = _.where(question.body.concat(question.answer), { 'datatype': 'code' });

                     _.forEach(codeChunks, function(chunk) {
                        if (chunk.content) {
                           chunk.content = chunk.content.replace(regExpHTML, '');
                        }
                     });

                  });
               });
               webStorage.add('exam', angular.toJson(self.data));
            }
            if (callback) {
               callback();
            }
         };

         self.linkAnswers = function(callback) {
            self.data.answers = [];
            _.forEach(self.data.sections, function(section) {
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
                  self.data.answers.push(answer);
               });
            });
         };

         self.backup = function(answer) {

            if (!self.data._id) {
               self.prepare(function(exam) {
                  exam.$save(function(exam) {
                     self.data._id = exam._id;
                  });
               });
            } else {
               var chunk = new Exam({
                  _id: self.data._id,
                  subject: self.data.subject,
                  date: self.data.date,
                  lang: self.data.lang,
                  student: self.data.student,
                  answer: answer
               });
               chunk.$update(function() {

               });
            }

         };

         self.prepare = function(callback) {
            callback = callback || null;

            var exam = new Exam(self.data);
            exam.evaluated = null;
            delete exam.lede;
            delete exam.sections;

            if (callback) {
               callback(exam);
            }
         };

         self.store = function() {
            self.save(function() {
               $rootScope.$emit('seal');
               $timeout(function() {

                  self.prepare(function(exam) {

                     (function upload() {
                        exam.$save(function() {
                           Modal.open('success', 'The exam has been successfully saved.', function() {
                              self.reset();
                              $state.go('exams');
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
               self.data = storedSession;
               self.isOngoing = true;
               if (User.isStudent()) {
                  self.linkAnswers();
               }
            } else {
               self.reset();
            }

            $rootScope.$on('save', function() {
               self.save();
            });

            $rootScope.$on('$stateChangeStart', function(e, state, params) {

               var redirect = function() {
                  $state.go('exam', {
                     subject: self.data.subject,
                     date: self.data.date,
                     lang: self.data.lang
                  });
               };

               if (self.isOngoing && (state.name === 'exams' || (User.isStudent() && state.name !== 'exam'))) {
                  e.preventDefault();
                  redirect();
               } else if (!self.isOngoing && User.isStudent() && state.name === 'exam' && !User.data.pledge) {
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
               } else if (self.isOngoing && state.name === 'exam') {
                  if (params.subject !== self.data.subject || params.date !== self.data.date || params.lang !== self.data.lang) {
                     e.preventDefault();
                     Modal.open('alert', 'You can only take one exam at a time.', function() {
                        redirect();
                     });
                  }
               }

            });

         })();

         return self;

      })();

      return ExamTake;

   }]);
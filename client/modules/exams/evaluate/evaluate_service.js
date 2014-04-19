'use strict';

angular.module('app.exams.evaluate')

   .factory('ExamEvaluation',
   ['$resource', '$rootScope', '$state', '$timeout', 'webStorage', 'Exam', 'Exams', 'Modal', 'User',
   function($resource, $rootScope, $state, $timeout, webStorage, Exam, Exams, Modal, User) {

      var ExamEvaluation = (function() {

         if (User.isStudent()) {
            return null;
         }

         var api = {
            data: null,
            isOngoing: false,
            isUrgent: false
         };

         api.reset = function() {
            api.data = {
               subject: null,
               date: null,
               lang: null,
               student: null,
               answers: [],
               section: []
            };
            api.isOngoing = false;
         };

         api.save = function(callback) {
            callback = callback || null;
            if (api.isOngoing) {
               webStorage.add('evaluation', angular.toJson(api.data));
            }
            if (callback) {
               callback();
            }
         };

         api.linkAnswers = function() {
            _.forEach(api.data._blueprint.sections, function(section) {
               section.points = 0;
               _.forEach(section.questions, function(question) {
                  question.answer = _.find(api.data.answers, { '_question': question._id });
                  section.points += question.answer.points;
               });
            });
         };

         api.store = function() {
            api.save(function() {
               var exam = new Exam(api.data);
               var blueprintId = exam._blueprint._id;
               delete exam._blueprint;
               exam._blueprint = blueprintId;
               exam.evaluated = {};
               exam.$save(function() {
                  Modal.open('success', 'The evaluation has been successfully saved.', function() {
                     api.reset();
                     $state.go('pastExams');
                     webStorage.remove('evaluation');
                  });
               }, function(err) {
                  Modal.open('error', 'There seems to be a problem with the server.');
                  api.data = angular.fromJson(webStorage.get('evaluation'));
                  webStorage.remove('evaluation');
               });
            });
         };

         (function init() {

            Exams.query({}, function(exams) {
               api.isUrgent = _.some(exams, function(exam) {
                  return exam.evaluated === null;
               });
            });

            var storedSession = angular.fromJson(webStorage.get('evaluation'));
            if (storedSession) {
               api.data = storedSession;
               api.isOngoing = true;
               api.linkAnswers();
               webStorage.remove('evaluation');
            } else {
               api.reset();
            }

            $rootScope.$on('save', function() {
               api.save();
            });

            $rootScope.$on('$stateChangeStart', function(e, state, params) {

               var redirect = function() {
                  $state.go('evaluate', {
                     subject: api.data.subject,
                     date: api.data.date,
                     lang: api.data.lang,
                     uid: api.data.student.id
                  });
               };

               if (api.isOngoing && state.name === 'pastExams') {
                  e.preventDefault();
                  redirect();
               } else if (api.isOngoing && state.name === 'evaluate') {
                  if (params.subject !== api.data.subject || params.date !== api.data.date || params.lang !== api.data.lang || params.uid !== api.data.student.id) {
                     e.preventDefault();
                     Modal.open('alert', 'You can only evaluate one exam at a time.', function() {
                        redirect();
                     });
                  }
               }

            });

         })();

         return api;

      })();

      return ExamEvaluation;

   }]);
'use strict';

angular.module('app.exams.evaluate')

   .factory('ExamEvaluation',
   ['$resource', '$rootScope', '$state', '$timeout', 'webStorage', 'Exam', 'Exams', 'Modal',
   function($resource, $rootScope, $state, $timeout, webStorage, Exam, Exams, Modal) {

      var ExamEvaluation = (function() {

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
               answers: []
            };
            api.isOngoing = false;
         };

         api.save = function() {
            if (api.isOngoing) {
               webStorage.add('evaluation', angular.toJson(api.data));
            }
         };

         api.store = function() {
            api.save();
            $timeout(function() {
               var exam = new Exam(api.data);

               exam.$save(function() {
                  Modal.open('success', 'The exam has been successfully saved.', function() {
                     api.reset();
                     $state.go('exams');
                     webStorage.remove('evaluation');
                  });
               }, function(err) {
                  Modal.open('error', 'There seems to be a problem with the server.');
                  api.data = angular.fromJson(webStorage.get('evaluation'));
                  webStorage.remove('evaluation');
               });
            }, 500);
         };

         (function init() {
            Exams.query({}, function(exams) {
               api.isUrgent = _.some(exams, function(exam) {
                  return !exam.evaluated;
               });
            });
            var storedSession = angular.fromJson(webStorage.get('evaluation'));
            if (storedSession) {
               api.data = storedSession;
               api.isOngoing = true;
               webStorage.remove('evaluation');
            } else {
               api.reset();
            }
         })();

         return api;

      })();

      $rootScope.$on('save', ExamEvaluation.save);

      $rootScope.$on('$stateChangeStart', function(e, state, params) {

         var redirect = function() {
            $state.go('evaluate', {
               subject: ExamEvaluation.data.subject,
               date: ExamEvaluation.data.date,
               lang: ExamEvaluation.data.lang,
               uid: ExamEvaluation.data.student.id
            });
         };

         if (ExamEvaluation.isOngoing && state.name === 'pastExams') {
            e.preventDefault();
            redirect();
         } else if (ExamEvaluation.isOngoing && state.name === 'evaluate') {
            if (params.subject !== ExamEvaluation.data.subject || params.date !== ExamEvaluation.data.date || params.lang !== ExamEvaluation.data.lang || params.uid !== ExamEvaluation.data.student.id) {
               e.preventDefault();
               Modal.open('alert', 'You can only evaluate one exam at a time.', function() {
                  redirect();
               });
            }
         }

      });

      return ExamEvaluation;

   }]);
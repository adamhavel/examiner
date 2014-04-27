'use strict';

angular.module('app.exams.evaluate')

   .factory('ExamEvaluation',
   ['$resource', '$rootScope', '$state', '$timeout', 'webStorage', 'Exam', 'Exams', 'Modal', 'User',
   function($resource, $rootScope, $state, $timeout, webStorage, Exam, Exams, Modal, User) {

      var ExamEvaluation = (function() {

         var self = {
            data: null,
            isOngoing: false,
            isUrgent: false
         };

         self.reset = function() {
            self.data = null;
            self.isUrgent = false;
            self.isOngoing = false;
            webStorage.remove('evaluation');
         };

         self.save = function(callback) {
            callback = callback || null;
            if (self.isOngoing) {
               webStorage.add('evaluation', angular.toJson(self.data));
            }
            if (callback) {
               callback();
            }
         };

         self.linkAnswers = function() {
            _.forEach(self.data._blueprint.sections, function(section) {
               section.points = 0;
               _.forEach(section.questions, function(question) {
                  question.answer = _.find(self.data.answers, { '_question': question._id });
                  section.points += question.answer.points;
               });
            });
         };

         self.store = function() {
            self.save(function() {
               var exam = new Exam(self.data);
               var blueprintId = exam._blueprint._id;
               delete exam._blueprint;
               exam._blueprint = blueprintId;
               exam.evaluated = {};
               exam.$save(function() {
                  Modal.open('success', 'The evaluation has been successfully saved.', function() {
                     var directions = {
                        subject: self.data.subject,
                        date: self.data.date
                     };
                     self.reset();
                     $state.go('pastExams', directions);
                  });
               }, function(err) {
                  Modal.open('error', 'There seems to be a problem with the server.');
                  self.data = angular.fromJson(webStorage.get('evaluation'));
               });
            });
         };

         $rootScope.$on('loggedIn', function() {
            if (!User.isStudent() && !self.isOngoing) {
               self.init();
            }
         });

         self.init = function() {

            Exams.query({}, function(exams) {
               self.isUrgent = _.some(exams, function(exam) {
                  return exam.evaluated === null;
               });
            });

            var storedSession = angular.fromJson(webStorage.get('evaluation'));
            if (storedSession) {
               self.data = storedSession;
               self.isOngoing = true;
               self.linkAnswers();
            } else {
               self.reset();
            }

            $rootScope.$on('save', function() {
               self.save();
            });

            $rootScope.$on('$stateChangeStart', function(e, state, params) {

               var redirect = function() {
                  $state.go('evaluate', {
                     subject: self.data.subject,
                     date: self.data.date,
                     lang: self.data.lang,
                     uid: self.data.student.id
                  });
               };

               if (self.isOngoing && state.name === 'pastExams') {
                  e.preventDefault();
                  redirect();
               } else if (self.isOngoing && state.name === 'evaluate') {
                  if (params.subject !== self.data.subject || params.date !== self.data.date || params.lang !== self.data.lang || params.uid !== self.data.student.id) {
                     e.preventDefault();
                     Modal.open('alert', 'You can only evaluate one exam at a time.', function() {
                        redirect();
                     });
                  }
               }

            });

         };

         return self;

      })();

      return ExamEvaluation;

   }]);
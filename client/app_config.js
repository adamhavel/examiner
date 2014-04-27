'use strict';

angular.module('app').config([
   '$stateProvider', '$urlRouterProvider', '$locationProvider',
   function($stateProvider, $urlRouterProvider, $locationProvider) {

      $locationProvider.html5Mode(true).hashPrefix('!');

      $urlRouterProvider.otherwise('/exams');

      $stateProvider
         .state('exams', {
            url: '/exams/:subject',
            params: {
               subject: { value: null }
            },
            templateUrl: 'partials/exams.html',
            controller: 'PendingExamsController'
         })
         .state('exam', {
            url: '/exam/:subject/:date/:lang',
            templateUrl: 'partials/exam.html',
            controller: 'ExamTakeController'
         })
         .state('pastExams', {
            url: '/evaluate/:subject/:date',
            params: {
               subject: { value: null },
               date: { value: null }
            },
            templateUrl: 'partials/pastExams.html',
            controller: 'PastExamsController'
         })
         .state('evaluate', {
            url: '/evaluate/:subject/:date/:lang/:uid',
            templateUrl: 'partials/evaluate.html',
            controller: 'ExamEvaluateController'
         });

   }
]).run([
   '$rootScope', '$location', '$animate', '$timeout',
   function($rootScope, $location, $animate, $timeout) {

      $animate.enabled(false);

      $rootScope.url = $location.path();

      window.addEventListener('beforeunload', function() {
         $rootScope.$emit('save');
      });

   }
]);
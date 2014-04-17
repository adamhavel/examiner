'use strict';

angular.module('app').config([
   '$stateProvider', '$urlRouterProvider', '$locationProvider',
   function($stateProvider, $urlRouterProvider, $locationProvider) {

      $locationProvider.html5Mode(true).hashPrefix('!');

      $urlRouterProvider.otherwise('/exams/');

      $stateProvider
         .state('exams', {
            url: '/exams/:subject',
            templateUrl: 'partials/exams.html',
            controller: 'PendingExamsController',
         })
         .state('exam', {
            url: '/exam/:subject/:date/:lang',
            templateUrl: 'partials/exam.html',
            controller: 'ExamTakeController',
         })
         .state('pastExams', {
            url: '/evaluate/:subject',
            templateUrl: 'partials/pastExams.html',
            controller: 'PastExamsController',
         })
         .state('evaluate', {
            url: '/evaluate/:subject/:date/:lang/:uid',
            templateUrl: 'partials/evaluate.html',
            controller: 'ExamEvaluateController',
         })
         .state('blueprints', {
            url: '/blueprints/:subject',
            /*params: {
               subject: { value: null }
            },*/
            templateUrl: 'partials/blueprints.html',
            controller: 'BlueprintsController'
         })
         .state('blueprint', {
            url: '/blueprint/:subject/:date/:lang',
            templateUrl: 'partials/blueprint.html',
            controller: 'BlueprintController'
         })
         .state('examTerms', {
            url: '/new',
            templateUrl: 'partials/examTerms.html',
            controller: 'ExamTermsController'
         })
         .state('newBlueprint', {
            url: '/new/:subject/:date/:lang',
            templateUrl: 'partials/newBlueprint.html',
            controller: 'BlueprintCreateController'
         });

   }
]).run([
   '$rootScope', '$location',
   function($rootScope, $location) {

      $rootScope.url = $location.path();

      window.addEventListener('beforeunload', function() {
         $rootScope.$emit('save');
      });

   }
]);
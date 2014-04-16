'use strict';

angular.module('app.exams')

   .factory('Exam', ['$resource', function($resource) {
      return $resource('api/exam/:subject/:date/:lang/:uid', {
         uid: '@student.id',
         subject: '@subject',
         date: '@date',
         lang: '@lang'
      });
   }])

   .factory('Exams', ['$resource', function($resource) {
      return $resource('api/exams/:subject/:date/:lang/:uid', null);
   }]);
'use strict';

angular.module('app.exams')

   .factory('Exam', ['$resource', function($resource) {
      return $resource('api/exam/:subject/:date/:lang/:uid', {
         uid: '@student.id',
         subject: '@subject',
         date: '@date',
         lang: '@lang'
      }, {
         update: {
            method: 'PUT'
         }
      });
   }])

   .factory('Exams', ['$resource', function($resource) {
      return $resource('api/exams', {
         subject: '@subject',
         date: '@date',
         lang: '@lang',
         uid: '@uid',
         fields: '@fields'
      });
   }]);
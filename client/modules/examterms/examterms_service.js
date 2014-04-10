'use strict';

angular.module('app.examterms')

   .factory('ExamTerms', ['$resource', function($resource) {

      var mockData = [
         {
            subject: 'mi-mdw',
            date: '2014-04-11T09:00',
            lang: 'en'

         },
         {

            subject: 'mi-mdw',
            date: '2014-04-12T11:00',
            lang: 'en'

         },
      ];

      return mockData;
   }]);
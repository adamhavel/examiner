'use strict';

angular.module('app.exams')

   .directive('question', function() {
      return {
         restrict: 'E',
         scope: {
            question: '=content',
         },
         templateUrl: 'partials/question.html',
         replace: true
      };
   });
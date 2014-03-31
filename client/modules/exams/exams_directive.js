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
   })

   .directive('snippet', function() {

      function highlight(scope, element) {

         var code = element.children('code')[0];

         Modernizr.load({
            load: 'js/ondemand/app.highlight.min.js',
            callback: function () {
               Prism.highlightElement(code);
            }
         });

         element.on('keydown', function(e) {

            if (e.keyCode == 9) {
               e.preventDefault();
               document.execCommand('InsertHTML', false, '   ');
            } else if (e.keyCode == 13) {
               e.preventDefault();
               document.execCommand('InsertHTML', false, '\n');
            }

         });

         element.on('input', function(e) {
            //code.innerHTML = code.innerText;
            //Prism.highlightElement(code);
         });

      }

      return {
         restrict: 'E',
         scope: {
            content: '=',
            lang: '=',
            editable: '@'
         },
         templateUrl: 'partials/snippet.html',
         replace: true,
         link: highlight
      };
   })

   .directive('canvas', function() {

      function init(scope, element) {



      }

      return {
         restrict: 'E',
         scope: {
            content: '=',
            lang: '=',
            editable: '@'
         },
         templateUrl: 'partials/snippet.html',
         replace: true,
         link: init
      };
   });
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

         var code = element.children('code')[0],
             editor;

         Modernizr.load({
            load: 'js/ondemand/app.highlight.min.js',
            callback: function () {
               editor = bililiteRange.fancyText(code, Prism.highlightElement);
               bililiteRange(editor).undo(0).data().autoindent = true; // init
               editor.addEventListener('keydown', function(e) {
                  if (e.ctrlKey && e.keyCode == 90) {
                     bililiteRange.undo(e);
                  }
                  if (e.ctrlKey && e.keyCode == 89) {
                     bililiteRange.redo(e);
                  }
                  if (e.keyCode == 9) {
                     e.preventDefault();
                     document.execCommand('InsertHTML', false, '   ');
                  }
               });
            }
         });

         element.on('input', function(e) {

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
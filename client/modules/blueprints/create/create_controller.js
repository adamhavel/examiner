'use strict';

angular.module('app.blueprints.create')

   .controller('BlueprintCreateController',
   ['$scope', '$stateParams', '$state', 'NewBlueprint',
   function($scope, $stateParams, $state, NewBlueprint) {

      $scope.blueprint = NewBlueprint.data;
      $scope.blueprint.subject = $stateParams.subject;

      function checkDefaultNames() {
         var sections = $scope.blueprint.sections;
         sections.forEach(function(section, i) {
            if (/^Section \d+$/.test(section.name)) {
               section.name = 'Section ' + (i + 1);
            }
            section.questions.forEach(function(question, j) {
               if (/^Question \d+\.\d+$/.test(question.name)) {
                  question.name = 'Question ' + (i + 1) + '.' + (j + 1);
               }
            });
         });
      }

      function recalculatePoints() {
         var sections = $scope.blueprint.sections;
         sections.forEach(function(section) {
            var points = 0;
            section.questions.forEach(function(question) {
               points += question.points;
            });
            section.points = points;
         });
      }

      $scope.remove = function(parent, index) {
         parent.splice(index, 1);
         recalculatePoints();
         checkDefaultNames();
      };

      $scope.move = function(parent, index, distance) {
         var target = index + distance;
         if (target >= 0 && target < parent.length) {
            var tmp = parent[target];
            parent[target] = parent[index];
            parent[index] = tmp;
            checkDefaultNames();
         }
      };

      $scope.addSection = function() {
         var sections = $scope.blueprint.sections;
         var defaultName = 'Section ' + (sections.length + 1);
         sections.push({
            name: defaultName,
            questions: [],
            lede: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum, similique, voluptate, libero repellendus doloribus expedita et nihil error fugit tempora facere nulla ab ea dolore nam molestiae excepturi illum at.',
            points: 0
         });
      };

      $scope.addQuestion = function(sectionIndex) {
         var section = $scope.blueprint.sections[sectionIndex];
         var questions = section.questions;
         var defaultName = 'Question ' + (sectionIndex + 1) + '.' + (questions.length + 1);
         questions.push({
            name: defaultName,
            points: 1,
            body: [
               {
                  datatype: 'text',
                  content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident, asperiores quas libero dolore deleniti natus illo inventore assumenda voluptates modi. Inventore, in perferendis nemo odit. Aspernatur, error fugiat eveniet asperiores.'
               }
            ],
            answer: []
         });
         section.points++;
      };

      $scope.raisePoints = function(section, question) {
         section.points++;
         question.points++;
      };

      $scope.lowerPoints = function(section, question) {
         if (question.points > 0) {
            section.points--;
            question.points--;
         }
      };

      $scope.addParagraph = function(question) {
         question.body.push({
            datatype: 'text',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae, magnam, quis, excepturi odit placeat error accusamus maiores at a facere itaque corporis aliquam architecto magni aliquid obcaecati dolores dignissimos pariatur.'
         });
      };

      $scope.addCode = function(question) {
         question.body.push({
            datatype: 'code',
            lang: 'javascript',
            content: 'var src = f.src.filter(function(filepath) {\n' +
'   // Warn on and remove invalid source files (if nonull was set).\n' +
'   if (!grunt.file.exists(filepath)) {\n' +
'      grunt.log.warn(\'Source file "\' + filepath + \'" not found.\');\n' +
'       return false;\n' +
'   } else {\n' +
'      return true;\n' +
'   }\n' +
'}).map(function(filepath) {\n' +
'   // Read file source.\n' +
'   return grunt.file.read(filepath);\n' +
'});'
         });
      };

      $scope.addImage = function(question) {
         $scope.openModal('input', 'Please provide an image URL.', function(url) {
            if (url) {
               question.body.push({
                  datatype: 'image',
                  content: url //http://31.media.tumblr.com/e05faf08d9254af029d384ccb2b9e81d/tumblr_msbc2eCq0e1rsuch2o1_1280.jpg
               });
            }
         });
      };

      $scope.addCanvas = function(question) {
         question.body.push({
            datatype: 'canvas',
            content: {}
         });
      };

   }]);
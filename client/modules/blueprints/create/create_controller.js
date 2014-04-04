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

      $scope.cancel = function() {
         $scope.openModal('confirm', 'Are you sure you want to throw away this blueprint? All work in-progress will be lost.', function(confirmed) {
            if (confirmed) {
               NewBlueprint.reset();
               $state.go('home');
            }
         });
      };

      $scope.remove = function(parent, index) {
         var item = parent[index];
         var removeItem = function() {
            parent.splice(index, 1);
            recalculatePoints();
            checkDefaultNames();
         };
         if (item.content || item.body || item.questions) {
            var name = item.name || 'this item';
            $scope.openModal('confirm', 'Are you sure you want to delete ' + name + ' and all of its contents?', function(confirmed) {
               if (confirmed) {
                  removeItem();
               }
            }, 'Delete ' + name);
         } else {
            removeItem();
         }
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

      $scope.addContent = function(question, type, isAnswer) {
         isAnswer = isAnswer || false;
         var target = isAnswer ? question.answer : question.body;
         var content = null;
         switch (type) {
            case 'text':
               content = {
                  datatype: 'text',
                  content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae, magnam, quis, excepturi odit placeat error accusamus maiores at a facere itaque corporis aliquam architecto magni aliquid obcaecati dolores dignissimos pariatur.'
               };
               break;
            case 'list':
               content = {
                  datatype: 'list',
                  content: [
                     { content: 'Lorem ipsum dolor sit amet'}
                  ]
               };
               break;
            case 'code':
               content = {
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
               };
               break;
            case 'image':
               $scope.openModal('externalImage', 'Please provide an image URL.', function(url) {
                  if (url) {
                     target.push({
                        datatype: 'image',
                        content: url //http://31.media.tumblr.com/e05faf08d9254af029d384ccb2b9e81d/tumblr_msbc2eCq0e1rsuch2o1_1280.jpg
                     });
                  }
               });
               break;
            case 'canvas':
               content = {
                  datatype: 'canvas',
                  content: {}
               };
               break;
         }
         if (content) {
            target.push(content);
         }
      };

      $scope.addHint = function(answer) {
         $scope.openModal('confirm', 'Take caution. Contents of the hint will be visible to those taking this exam.', function(confirmed) {
            if (confirmed) {
               answer.hint = angular.fromJson(angular.toJson(answer.content));
            }
         }, 'Add hint');
      }

      $scope.removeHint = function(answer) {
         $scope.openModal('confirm', 'Are you sure you want to remove the hint?', function(confirmed) {
            if (confirmed) {
               answer.hint = null;
            }
         }, 'Remove hint');
      }

   }]);
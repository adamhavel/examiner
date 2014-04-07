'use strict';

angular.module('app.blueprints.create')

   .controller('BlueprintCreateController',
   ['$scope', '$stateParams', '$state', 'NewBlueprint', 'Modal',
   function($scope, $stateParams, $state, NewBlueprint, Modal) {

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

      function isEmpty(item) {
         var isEmpty = false;
         if (item.questions && !item.questions.length && !item.lede) {
            isEmpty = true;
         } else if (item.body && !item.body.length && !item.answer.length) {
            isEmpty = true;
         } else if (item.datatype) {
            switch (item.datatype) {
               case 'text':
               case 'code':
               case 'list':
                  isEmpty = item.content.replace(/(\s|<([^>]+)>)+/g, '') === '';
                  break;
               case 'canvas':
                  isEmpty = item.content.states.length === 1;
                  break;
            }
         }
         return isEmpty;
      }

      function isAcceptable() {
         return !$scope.blueprint.sections.some(function(section) {
            if (!section.questions.length) {
               Modal.open('alert', 'All sections must contain at least one question.');
               return true;
            } else {
               return section.questions.some(function(question) {
                  if (!question.body.length) {
                     Modal.open('alert', 'All questions must have some content.');
                     return true;
                  } else {
                     var areChunksEmpty = question.body.every(function(chunk) {
                        return isEmpty(chunk);
                     });
                     if (areChunksEmpty) {
                        Modal.open('alert', 'All questions must have some content.');
                        return true;
                     }
                  }
                  if (!question.answer.length) {
                     Modal.open('alert', 'All questions must have a defined answer.');
                     return true;
                  }
               });
            }
         });
      }

      $scope.store = function() {
         if (isAcceptable()) {
            Modal.open('affirm', 'You are about to save and store the blueprint. You can edit it anytime later. Do you want to continue?', function(confirmed) {
               if (confirmed) {
                  watcher();
                  NewBlueprint.store();
               }
            }, 'Cancel', 'Store');
         }
      };

      $scope.discard = function() {
         Modal.open('confirm', 'Are you sure you want to discard the blueprint? All work in-progress will be lost.', function(confirmed) {
            if (confirmed) {
               watcher();
               NewBlueprint.reset();
               $state.go('home');
            }
         }, 'Discard');
      };

      $scope.remove = function(parent, index) {
         var item = parent[index];
         var removeItem = function() {
            parent.splice(index, 1);
            //recalculatePoints();
            //checkDefaultNames();
         };
         if (!isEmpty(item)) {
            var name = item.name || 'this item';
            Modal.open('confirm', 'Are you sure you want to delete ' + name + ' and all of its contents?', function(confirmed) {
               if (confirmed) {
                  removeItem();
               }
            }, 'Delete');
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
            //checkDefaultNames();
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
      };

      $scope.raisePoints = function(section, question) {
         question.points++;
      };

      $scope.lowerPoints = function(section, question) {
         if (question.points > 1) {
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
                  content: 'Lorem ipsum dolor sit amet'
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
               Modal.open('loadImage', 'Please provide an image URL.', function(url) {
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
                  datatype: 'canvas'
               };
               break;
         }
         if (content) {
            target.push(content);
         }
      };

      $scope.addHint = function(answer) {
         Modal.open('alert', 'Take caution. Contents of the hint will be visible to those taking the exam.', function(confirmed) {
            if (confirmed) {
               answer.hint = angular.fromJson(angular.toJson(answer.content));
            }
         }, 'I understand');
      };

      $scope.updateHint = function(answer) {
         if (answer.hint) {
            Modal.open('confirm', 'This will replace the contents of the hint. Do you want to continue?', function(confirmed) {
               if (confirmed) {
                  answer.hint = angular.fromJson(angular.toJson(answer.content));
               }
            }, 'Update hint');
         }
      };

      $scope.removeHint = function(answer) {
         Modal.open('confirm', 'Are you sure you want to remove the hint?', function(confirmed) {
            if (confirmed) {
               answer.hint = null;
            }
         }, 'Remove hint');
      };

      $scope.areEqual = function(o1, o2) {
         return angular.toJson(o1) === angular.toJson(o2);
      };

      $scope.blueprint = NewBlueprint.data;
      if (!NewBlueprint.isOngoing()) {
         $scope.blueprint.subject = $stateParams.subject;
         $scope.addSection();
         $scope.blueprint.ongoing = true;
      }

      var watcher = $scope.$watch('blueprint.sections', function() {
         recalculatePoints();
         checkDefaultNames();
      }, true);

   }]);
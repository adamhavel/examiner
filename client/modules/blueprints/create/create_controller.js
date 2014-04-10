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
         function isContentEmpty(content, datatype) {
            switch (datatype) {
               case 'text':
               case 'code':
                  return content.replace(/(\s|<([^>]+)>|&nbsp;)+/g, '') === '';
               case 'list':
                  return content.every(function(item) {
                     return !item.content;
                  });
               case 'options':
                  return content.every(function(item) {
                     return !(item.content || item.value);
                  });
               case 'canvas':
                  return content.states.length === 1;
            }
         }
         if (item.questions && !item.questions.length && !item.lede) {
            return true;
         } else if (item.body && !item.body.length && !item.answer.length) {
            return true;
         } else if (item.content) {
            return isContentEmpty(item.content, item.datatype);
         } else if (item.solution) {
            return isContentEmpty(item.solution, item.datatype);
         }
         return true;
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
            Modal.open('save', 'You are about to save and store the blueprint. You can edit it anytime later. Do you want to continue?', function(confirmed) {
               if (confirmed) {
                  watcher();
                  NewBlueprint.store();
               }
            });
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
         }
      };

      $scope.addSection = function(index) {
         var sections = $scope.blueprint.sections;
         index = index || sections.length;
         var defaultName = 'Section ' + (index + 1);
         sections.splice(index, 0, {
            name: defaultName,
            questions: [],
            lede: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum, similique, voluptate, libero repellendus doloribus expedita et nihil error fugit tempora facere nulla ab ea dolore nam molestiae excepturi illum at.',
            points: 0
         });
      };

      $scope.addQuestion = function(sectionIndex, index) {
         var section = $scope.blueprint.sections[sectionIndex];
         var questions = section.questions;
         index = index || questions.length;
         var defaultName = 'Question ' + (sectionIndex + 1) + '.' + (index + 1);
         questions.splice(index, 0, {
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
                  datatype: 'text'
               };
               break;
            case 'list':
               content = {
                  datatype: 'list'
               };
               break;
            case 'code':
               Modal.open('chooseCodeLanguage', 'Please choose a language.', function(lang) {
                  if (lang) {
                     console.log(lang);
                     target.push({
                        datatype: 'code',
                        lang: lang
                     });
                  }
               });
               break;
            case 'options':
               content = {
                  datatype: 'options'
               };
               break;
            case 'image':
               Modal.open('loadImage', 'Please provide an image URL.', function(url) {
                  if (url) {
                     target.push({
                        datatype: 'image',
                        content: url
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
               answer.content = angular.fromJson(angular.toJson(answer.solution));
            }
         }, 'I understand');
      };

      $scope.updateHint = function(answer) {
         if (answer.content) {
            Modal.open('confirm', 'This will replace the contents of the hint. Do you want to continue?', function(confirmed) {
               if (confirmed) {
                  answer.content = angular.fromJson(angular.toJson(answer.solution));
               }
            }, 'Update hint');
         }
      };

      $scope.removeHint = function(answer) {
         Modal.open('confirm', 'Are you sure you want to remove the hint?', function(confirmed) {
            if (confirmed) {
               answer.content = null;
            }
         }, 'Remove hint');
      };

      $scope.areEqual = function(o1, o2) {
         return angular.toJson(o1) === angular.toJson(o2);
      };

      $scope.blueprint = NewBlueprint.data;
      if (!NewBlueprint.isOngoing) {
         $scope.blueprint.subject = $stateParams.subject;
         $scope.blueprint.date = $stateParams.date;
         $scope.blueprint.lang = $stateParams.lang;
         $scope.addSection();
         NewBlueprint.isOngoing = true;
      } else if ($scope.blueprint.subject !== $stateParams.subject || $scope.blueprint.date !== $stateParams.date || $scope.blueprint.lang !== $stateParams.lang) {
         Modal.open('alert', 'You can only create one blueprint at a time.', function() {
            $state.go('newBlueprint', {
               subject: $scope.blueprint.subject,
               date: $scope.blueprint.date,
               lang: $scope.blueprint.lang
            });
         });
      }

      var watcher = $scope.$watch('blueprint.sections', function() {
         recalculatePoints();
         checkDefaultNames();
      }, true);

   }]);
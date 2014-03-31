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
            datatype: 'text'
         });
      };

      $scope.addCode = function(question) {
         question.body.push({
            datatype: 'code',
            lang: 'javascript',
            content: 'alert(\'Hello world\');'
         });
      };

      $scope.addExternalImage = function(question) {
         question.body.push({
            datatype: 'image',
            external: true,
            content: 'https://gs1.wac.edgecastcdn.net/8019B6/data.tumblr.com/a8d640f9ef130ab0836ecad7f1da46f2/tumblr_mxxg21ARtI1s2rav1o2_r1_1280.jpg'
         });
      };

   }]);
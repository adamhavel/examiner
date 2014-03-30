'use strict';

angular.module('app.blueprints.create')

   .controller('BlueprintCreateController', ['$scope', '$stateParams', '$state', 'Blueprint',
   function($scope, $stateParams, $state, Blueprint) {

      function blankPage() {
         var blueprint = {
            subject: $stateParams.subject,
            date: new Date(),
            lang: 'en',
            lede: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione, quidem, ullam dolorum expedita aliquam maiores distinctio esse repudiandae totam magnam saepe iusto ipsam nam a libero suscipit enim architecto nobis!',
            sections: []
         };
         return blueprint;
      }

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

      $scope.removeSection = function(index) {
         $scope.blueprint.sections.splice(index, 1);
         checkDefaultNames();
      };

      $scope.moveSection = function(index, distance) {
         var sections = $scope.blueprint.sections;
         var target = index + distance;
         if (target >= 0 && target < sections.length) {
            var tmp = sections[target];
            sections[target] = sections[index];
            sections[index] = tmp;
            checkDefaultNames();
         }
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

      $scope.removeQuestion = function(sectionIndex, index) {
         var section = $scope.blueprint.sections[sectionIndex];
         section.points = section.points - section.questions[index].points;
         section.questions.splice(index, 1);
         checkDefaultNames();
      };

      $scope.moveQuestion = function(sectionIndex, index, distance) {
         var questions = $scope.blueprint.sections[sectionIndex].questions;
         var target = index + distance;
         if (target >= 0 && target < questions.length) {
            var tmp = questions[target];
            questions[target] = questions[index];
            questions[index] = tmp;
            checkDefaultNames();
         }
      };

      $scope.blueprint = $scope.blueprint || blankPage();
      $scope.addSection();

   }]);
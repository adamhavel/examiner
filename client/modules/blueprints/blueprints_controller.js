'use strict';

angular.module('app.blueprints')

   .controller('BlueprintsController', ['$scope', 'Blueprints', 'dateFilter',
   function($scope, Blueprints, dateFilter) {

      $scope.blueprints = Blueprints.query({
         subject: 'mi-mdw',
         date: '2014-02-10',
         lang: 'en'
      });

      $scope.dateFilter = dateFilter;

   }])

   .controller('BlueprintController', ['$scope', '$stateParams', '$anchorScroll', '$location', 'Blueprint', 'idfyFilter',
   function($scope, $stateParams, $anchorScroll, $location, Blueprint, idfyFilter) {

      $scope.blueprint = Blueprint.get({
         subject: $stateParams.subject,
         date: $stateParams.date,
         lang: $stateParams.lang
      }, function() {
         $scope.blueprint.sections.forEach(function(section, i) {
            section.name = section.name || 'Section ' + (i+1);
            section.questions.forEach(function(question, j) {
               question.name = question.name || 'Question ' + (i+1) + '.' + (j+2);
            });
         });
      });

      $scope.activeQuestion = 0;
      $scope.activeSection = 0;

      function smoothScroll() {
         var current = window.pageYOffset;
         var difference = this - current;
         if (difference !== 0) {
            var offset = difference / 5;
            var target = current + (difference > 0 ? Math.ceil(offset) : Math.floor(offset));
            window.scrollTo(0, target);
            requestAnimationFrame(smoothScroll.bind(this));
         }
      }

      $scope.scrollTo = function(id) {
         var el = document.getElementById(id);
         requestAnimationFrame(smoothScroll.bind(el.offsetTop - 10));
         //$location.hash(this);
      };

      $scope.idfyFilter = idfyFilter;

   }]);
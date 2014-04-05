'use strict';

angular.module('app.ui')

   .factory('Modal', function() {

      var api = {
         content: null,
         open: function(type, prompt, callback, secondaryActionLabel, primaryActionLabel) {
            api.content = {
               type: type,
               prompt: prompt,
               primaryActionLabel: primaryActionLabel || null,
               secondaryActionLabel: secondaryActionLabel || null,
               callback: callback || null
            };
         },
         close: function() {
            api.content = null;
         }
      };

      return api;

   });
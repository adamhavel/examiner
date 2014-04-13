'use strict';

angular.module('app.ui')

   .factory('Modal', function() {

      var api = {
         content: null,
         queue: [],
         open: function(type, prompt, callback, secondaryActionLabel, primaryActionLabel) {
            var modal = {
               type: type,
               prompt: prompt,
               primaryActionLabel: primaryActionLabel || null,
               secondaryActionLabel: secondaryActionLabel || null,
               callback: callback || null
            };
            if (api.content && angular.toJson(api.content) !== angular.toJson(modal)) {
               if (_.every(api.queue, function(item) {
                  return angular.toJson(modal) !== angular.toJson(item);
               })) {
                  api.queue.push(modal);
               }
            } else {
               api.content = modal;
            }
         },
         close: function() {
            api.content = null;
         }
      };

      return api;

   })

   .factory('Timer', ['$rootScope', '$interval', 'webStorage', function($rootScope, $interval, webStorage) {

      var Timer = (function() {

         var api = {
            data: {},
            display: '',
            urgent: false
         };

         var clock = null;

         api.start = function(beginning, duration) {
            api.data.beginning = beginning || api.data.beginning;
            api.data.duration = duration || api.data.duration;
            clock = $interval(function() {
               api.data.timeLeft = moment.duration(api.data.duration - (Date.now() - api.data.beginning));
               api.display = api.data.timeLeft.minutes() + ':' + ('00' + api.data.timeLeft.seconds()).slice(-2);
               if (api.data.timeLeft <= 0) {
                  api.stop();
               } else if (api.data.timeLeft <= 60000) {
                  api.urgent = true;
               }
            }, 1000);
         },

         api.stop = function() {
            $interval.cancel(clock);
            api.reset();
         },

         api.reset = function() {
            api.data = {
               beginning: 0,
               duration: 0,
               timeLeft: moment.duration()
            };
            api.display = '';
            api.urgent = false;
            clock = null;
         };

         api.save = function() {
            if (clock) {
               webStorage.add('timer', angular.toJson(api.data));
            }
         };

         (function init() {
            var storedSession = angular.fromJson(webStorage.get('timer'));
            if (storedSession) {
               api.data = storedSession;
               webStorage.remove('timer');
               api.start();
            } else {
               api.reset();
            }
         })();

         return api;

      })();

      $rootScope.$on('save', Timer.save);

      return Timer;

   }]);
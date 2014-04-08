'use strict';

angular.module('app.exams')

   .directive('contents', function() {
      return {
         restrict: 'E',
         scope: {
            document: '=',
         },
         templateUrl: 'partials/contents.html',
         replace: true
      };
   })

   .directive('list', function() {

      function getElements(selector, parent) {
         parent = parent || document;
         var elements = parent.querySelectorAll(selector),
             arr = [];
         for (var i = elements.length; i--; arr.unshift(elements[i]));
         return arr;
      }

      function link($scope, $element) {

         if ($scope.editable === 'true') {

            $element.on('keydown', function(e) {
               if (e.keyCode === 13 || e.keyCode === 8 || e.keyCode === 46) {
                  var item = e.target;
                  var items = getElements('li', $element[0]);
                  var index = items.indexOf(item);
                  if (e.keyCode === 13) {
                     e.preventDefault();
                     $scope.items.splice(index + 1, 0, { content: ''});
                     $scope.$apply();
                     getElements('li', $element[0])[index + 1].focus();
                  } else if ($scope.items.length > 1 && !$scope.items[index].content) {
                     e.preventDefault();
                     $scope.items.splice(index, 1);
                     $scope.$apply();
                     var prevItem = items[index - 1];
                     range = document.createRange();
                     range.selectNodeContents(prevItem);
                     range.collapse(false);
                     selection = window.getSelection();
                     selection.removeAllRanges();
                     selection.addRange(range);
                  }
               }
            });

            $scope.$on('$destroy', function() {
               $element.off('keydown');
            });

         }

      }

      return {
         restrict: 'E',
         scope: {
            items: '=content',
            editable: '@'
         },
         templateUrl: 'partials/list.html',
         replace: true,
         link: link
      };
   })

   .directive('options', function() {

      function getElements(selector, parent) {
         parent = parent || document;
         var elements = parent.querySelectorAll(selector),
             arr = [];
         for (var i = elements.length; i--; arr.unshift(elements[i]));
         return arr;
      }

      function link($scope, $element) {

         $scope.getId = function() {

         }

         if ($scope.editable === 'true') {

            $element.on('keydown', function(e) {
               if (e.keyCode === 13 || e.keyCode === 8 || e.keyCode === 46) {
                  var item = e.target;
                  var items = getElements('label', $element[0]);
                  var index = items.indexOf(item);
                  if (e.keyCode === 13) {
                     e.preventDefault();
                     $scope.items.splice(index + 1, 0, {
                        value: 0,
                        content: ''
                     });
                     $scope.$apply();
                     getElements('label', $element[0])[index + 1].focus();
                  } else if ($scope.items.length > 1 && !$scope.items[index].content) {
                     e.preventDefault();
                     $scope.items.splice(index, 1);
                     $scope.$apply();
                     var prevItem = items[index - 1];
                     range = document.createRange();
                     range.selectNodeContents(prevItem);
                     range.collapse(false);
                     selection = window.getSelection();
                     selection.removeAllRanges();
                     selection.addRange(range);
                  }
               }
            });

            $scope.$on('$destroy', function() {
               $element.off('keydown');
            });

         }

      }

      return {
         restrict: 'E',
         scope: {
            items: '=content',
            editable: '@'
         },
         templateUrl: 'partials/options.html',
         replace: true,
         link: link
      };
   })

   .directive('snippet', function() {

      function link($scope, $element) {

         var code = $element.children('code')[0];

         Modernizr.load({
            load: 'js/ondemand/app.highlight.min.js',
            callback: function () {

               if ($scope.editable === 'true') {

                  var editor = bililiteRange.fancyText(code, Prism.highlightElement);
                  bililiteRange(editor).undo(0).data().autoindent = true;

                  editor.addEventListener('keydown', function(e) {
                     if (e.ctrlKey && e.keyCode === 90) {
                        bililiteRange.undo(e);
                     } else if (e.ctrlKey && e.keyCode === 89) {
                        bililiteRange.redo(e);
                     } else if (e.keyCode === 9) {
                        e.preventDefault();
                        document.execCommand('InsertHTML', false, '   ');
                     }
                  });

                  $scope.$on('$destroy', function() {
                     editor.removeEventListener('keydown');
                  });

               } else {
                  Prism.highlightElement(code);
               }
            }
         });

      }

      return {
         restrict: 'E',
         scope: {
            content: '=',
            lang: '@',
            editable: '@'
         },
         templateUrl: 'partials/snippet.html',
         replace: true,
         link: link
      };
   })

   .directive('icanvas', function() {

      function getElements(selector, parent) {
         parent = parent || document;
         var elements = parent.querySelectorAll(selector),
             arr = [];
         for (var i = elements.length; i--; arr.unshift(elements[i]));
         return arr;
      }

      function link($scope, $element) {

         var canvasWrapper = $element[0],
             canvas = canvasWrapper.querySelector('canvas');

         canvas.width = canvasWrapper.clientWidth;
         canvas.height = canvas.width / (16/9);

         Modernizr.load({
            load: 'js/ondemand/app.canvas.min.js',
            callback: function init() {

               $scope.canvas = canvas = new fabric.Canvas(canvas, {
                  selection: false
               });
               canvas.calcOffset();

               if ($scope.content && typeof $scope.content === 'string') {
                  fabric.loadSVGFromString($scope.content, function(objects, options) {
                     var canvasBackdrop = fabric.util.groupSVGElements(objects, options);
                     canvasBackdrop.set('selectable', false);
                     canvas.add(canvasBackdrop).sendToBack(canvasBackdrop).renderAll();
                     $scope.content = null;
                  });
               }

               var canvasTools = getElements('.j-canvas-tool', canvasWrapper),
                   isMouseDown = false,
                   pointer,
                   obj;

               var History = (function(canvas, $scope) {

                  var api = {};

                  var data = $scope.content,
                      limit = 25;

                  api.canUndo = function() {
                     return ($scope.content.currentState > 0);
                  };

                  api.canRedo = function() {
                     return ($scope.content.currentState < $scope.content.states.length - 1);
                  };

                  api.undo = function() {
                     if (api.canUndo()) {
                        canvas.getObjects().forEach(function(obj) {
                           canvas.remove(obj);
                        });
                        canvas.loadFromJSON($scope.content.states[--$scope.content.currentState]);
                        if (!canvas.selection) {
                           canvas.getObjects().forEach(function(obj) {
                              obj.set({
                                 selectable: false
                              });
                              obj.setCoords();
                           });
                        }
                        canvas.renderAll();
                        $scope.$apply();
                     }
                  };

                  api.redo = function() {
                     if (api.canRedo()) {
                        canvas.getObjects().forEach(function(obj) {
                           canvas.remove(obj);
                        });
                        canvas.loadFromJSON($scope.content.states[++$scope.content.currentState]);
                        if (!canvas.selection) {
                           canvas.getObjects().forEach(function(obj) {
                              obj.set({
                                 selectable: false
                              });
                              obj.setCoords();
                           });
                        }
                        canvas.renderAll();
                        $scope.$apply();
                     }
                  };

                  (function init() {

                     if (!$scope.content) {
                        $scope.content = {
                           states: [angular.toJson(canvas)],
                           currentState: 0
                        };
                     }

                     canvas.on('object:modified', function() {
                        if ($scope.content.currentState < $scope.content.states.length - 1) {
                           $scope.content.states = $scope.content.states.slice(0, $scope.content.currentState + 1);
                        }
                        if ($scope.content.currentState < limit - 1) {
                           $scope.content.currentState++;
                        }
                        if ($scope.content.states.length === limit) {
                           $scope.content.states.shift();
                        }
                        $scope.content.states.push(angular.toJson(canvas));
                        $scope.$apply();
                     });

                     $scope.watcher = $scope.$watch('content', function() {
                        canvas.loadFromJSON($scope.content.states[$scope.content.currentState]);
                        canvas.renderAll();
                     });

                     $scope.$apply();

                  })();

                  return api;
               })(canvas, $scope);

               var activateTool = function(toolHandler) {
                  if (!this.classList.contains('ng-active')) {

                     canvasTools.forEach(function(tool) {
                        tool.classList.remove('ng-active');
                     });
                     this.classList.add('ng-active');

                     canvas.deactivateAllWithDispatch();
                     canvas.selection = false;
                     canvas.getObjects().forEach(function(obj) {
                        obj.set({
                           editable: false,
                           selectable: false
                        });
                     });

                     canvas.isDrawingMode = false;
                     canvas.defaultCursor = 'crosshair';

                     canvas.off('mouse:down');
                     canvas.off('mouse:move');
                     canvas.off('mouse:up');

                     if (toolHandler.mouseDown) {
                        canvas.on('mouse:down', toolHandler.mouseDown);
                     }
                     if (toolHandler.mouseMove) {
                        canvas.on('mouse:move', toolHandler.mouseMove);
                     }
                     if (toolHandler.mouseUp) {
                        canvas.on('mouse:up', toolHandler.mouseUp);
                     }
                     if (toolHandler.init) {
                        toolHandler.init();
                     }

                     canvas.renderAll();
                  }
               };

               var selectHandler = {
                  init: function() {
                     canvas.defaultCursor = 'default';
                     canvas.selection = true;
                     canvas.getObjects().forEach(function(obj) {
                        obj.set({
                           selectable: true
                        });
                        obj.setCoords();
                     });
                  },
                  mouseDown: function() {
                     canvas.calcOffset();
                  }
               };

               var paintHandler = {
                  init: function() {
                     canvas.off('path:created');
                     canvas.on('path:created', function(e) {
                        e.path.set({
                           perPixelTargetFind: true
                        });
                        canvas.fire('object:modified', { target: e.path });
                     });
                     canvas.isDrawingMode = true;
                  },
                  mouseDown: function() {
                     canvas.calcOffset();
                  }
               };

               var rectHandler = {
                  mouseDown: function(o) {
                     canvas.calcOffset();
                     isMouseDown = true;
                     pointer = canvas.getPointer(o.e);
                     obj = new fabric.Rect({
                        strokeWidth: 1,
                        fill: 'rgba(255, 255, 255, .25)',
                        stroke: 'rgba(0, 0, 0, .75)',
                        originX: 'left',
                        originY: 'top',
                        top: pointer.y,
                        left: pointer.x,
                        selectable: false,
                        perPixelTargetFind: true
                     });
                     canvas.add(obj);
                  },
                  mouseMove: function(o) {
                     if (!isMouseDown) {
                        return;
                     }
                     var currentPointer = canvas.getPointer(o.e);
                     if (currentPointer.x - pointer.x < 0) {
                        obj.set({
                           originX: 'right'
                        });
                     } else {
                        obj.set({
                           originX: 'left'
                        });
                     }
                     if (currentPointer.y - pointer.y < 0) {
                        obj.set({
                           originY: 'bottom'
                        });
                     } else {
                        obj.set({
                           originY: 'top'
                        });
                     }
                     obj.set({
                        width: Math.abs(currentPointer.x - pointer.x),
                        height: Math.abs(currentPointer.y - pointer.y)
                     });
                     canvas.renderAll();
                  },
                  mouseUp: function() {
                     isMouseDown = false;
                     canvas.fire('object:modified', { target: obj });
                  }
               };

               var circleHandler = {
                  mouseDown: function(o) {
                     canvas.calcOffset();
                     isMouseDown = true;
                     pointer = canvas.getPointer(o.e);
                     obj = new fabric.Ellipse({
                        strokeWidth: 1,
                        fill: 'rgba(255, 255, 255, .25)',
                        stroke: 'rgba(0, 0, 0, .75)',
                        top: pointer.y,
                        left: pointer.x,
                        originY: 'top',
                        originX: 'left',
                        selectable: false,
                        rx: 1,
                        ry: 1,
                        perPixelTargetFind: true
                     });
                     canvas.add(obj);
                  },
                  mouseMove: function(o) {
                     if (!isMouseDown) {
                        return;
                     }
                     var currentPointer = canvas.getPointer(o.e);
                     obj.set({
                        rx: Math.abs(currentPointer.x - pointer.x),
                        ry: Math.abs(currentPointer.y - pointer.y)
                     });
                     canvas.renderAll();
                  },
                  mouseUp: function() {
                     isMouseDown = false;
                     obj.set({
                        width: obj.rx * 2,
                        height: obj.ry * 2,
                        top: obj.top - obj.ry + 1,
                        left: obj.left - obj.rx + 1
                     });
                     canvas.renderAll();
                     canvas.fire('object:modified', { target: obj });
                  }
               };

               var lineHandler = {
                  mouseDown: function(o) {
                     canvas.calcOffset();
                     isMouseDown = true;
                     pointer = canvas.getPointer(o.e);
                     obj = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
                        strokeWidth: 1,
                        stroke: 'rgba(0, 0, 0, 0.75)',
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        perPixelTargetFind: true
                     });
                     canvas.add(obj);
                  },
                  mouseMove: function(o) {
                     if (!isMouseDown) {
                        return;
                     }
                     pointer = canvas.getPointer(o.e);
                     obj.set({
                        x2: pointer.x,
                        y2: pointer.y
                     });
                     canvas.renderAll();
                  },
                  mouseUp: function() {
                     isMouseDown = false;
                     canvas.fire('object:modified', { target: obj });
                  }
               };

               var typeHandler = {
                  init: function() {
                     canvas.defaultCursor = 'text';
                     canvas.on('text:editing:exited', function(e) {
                        if (!e.target.text) {
                           canvas.remove(e.target);
                        } else {
                           canvas.fire('object:modified', { target: e.target });
                        }
                     });
                     canvas.getObjects().forEach(function(obj) {
                        if (obj.get('type') === 'i-text') {
                           obj.set({
                              selectable: true,
                              editable: true
                           });
                        }
                     });
                  },
                  mouseDown: function(o) {
                     canvas.calcOffset();
                     isMouseDown = true;
                     pointer = canvas.getPointer(o.e);
                     var isInsideTextObject = false;
                     canvas.getObjects().forEach(function(objOnCanvas) {
                        if (objOnCanvas.get('type') === 'i-text') {
                           var bounds = objOnCanvas.getBoundingRect();
                           if (pointer.x >= bounds.left && pointer.x <= bounds.left + bounds.width && pointer.y >= bounds.top && pointer.y <= bounds.top + bounds.height) {
                              objOnCanvas.enterEditing();
                              isInsideTextObject = true;
                              obj = null;
                           }
                        }
                     });
                     if (!isInsideTextObject) {
                        obj = new fabric.IText('', {
                           fontFamily: 'Roboto',
                           selectable: false,
                           originX: 'center',
                           originY: 'center',
                           lockUniScaling: true,
                           textAlign: 'center',
                           fontSize: 24,
                           fontWeight: 300,
                           fill: 'rgba(0, 0, 0, 1)'
                        });
                     }
                  },
                  mouseMove: function() {},
                  mouseUp: function(o) {
                     isMouseDown = false;
                     if (obj) {
                        pointer = canvas.getPointer(o.e);
                        obj.set({
                           top: pointer.y,
                           left: pointer.x
                        });
                        canvas.add(obj);
                        canvas.setActiveObject(obj);
                        obj.enterEditing();
                        canvas.renderAll();
                     }
                  }
               };

               canvasWrapper.querySelector('.j-canvas-select').addEventListener('click', function() {
                  (activateTool.bind(this))(selectHandler);
               });

               canvasWrapper.querySelector('.j-canvas-paint').addEventListener('click', function() {
                  (activateTool.bind(this))(paintHandler);
               });

               canvasWrapper.querySelector('.j-canvas-rect').addEventListener('click', function() {
                  (activateTool.bind(this))(rectHandler);
               });

               canvasWrapper.querySelector('.j-canvas-circle').addEventListener('click', function() {
                  (activateTool.bind(this))(circleHandler);
               });

               canvasWrapper.querySelector('.j-canvas-line').addEventListener('click', function() {
                  (activateTool.bind(this))(lineHandler);
               });

               canvasWrapper.querySelector('.j-canvas-type').addEventListener('click', function() {
                  (activateTool.bind(this))(typeHandler);
               });

               canvasWrapper.querySelector('.j-canvas-undo').addEventListener('click', function() {
                  History.undo();
               });

               canvasWrapper.querySelector('.j-canvas-redo').addEventListener('click', function() {
                  History.redo();
               });

               canvasWrapper.querySelector('.j-canvas-remove').addEventListener('click', function() {
                  if (canvas.getActiveObject()) {
                     canvas.remove(canvas.getActiveObject());
                  } else if (canvas.getActiveGroup()) {
                     canvas.getActiveGroup().forEachObject(function(obj) {
                        canvas.remove(obj);
                     });
                     canvas.discardActiveGroup();
                  }
                  canvas.renderAll();
                  canvas.fire('object:modified', { target: obj });
               });

               canvas.on('object:selected', function() {
                  $scope.selection = true;
                  $scope.$apply();
               });

               canvas.on('selection:cleared', function() {
                  $scope.selection = false;
               });

               window.addEventListener('keydown', function(e) {
                  if (e.keyCode === 46) {
                     if (canvas.getActiveObject()) {
                        e.preventDefault();
                        canvas.remove(canvas.getActiveObject());
                     } else if (canvas.getActiveGroup()) {
                        e.preventDefault();
                        canvas.getActiveGroup().forEachObject(function(obj) {
                           canvas.remove(obj);
                        });
                        canvas.discardActiveGroup();
                     }
                     canvas.renderAll();
                     canvas.fire('object:modified', { target: obj });
                  }
               });

               canvasWrapper.querySelector('.j-canvas-remove').disabled = true;

               (activateTool.bind(canvasWrapper.querySelector('.j-canvas-paint')))(paintHandler);

               $scope.$on('$destroy', function() {
                  $scope.watcher();
                  canvasTools.forEach(function(tool) {
                     tool.removeEventListener('click');
                  });
               });

            }
         });

      }

      return {
         restrict: 'E',
         scope: {
            content: '='
         },
         templateUrl: 'partials/icanvas.html',
         replace: true,
         link: link,
         controller: ['$scope', '$rootScope', function($scope, $rootScope) {

            function sealCanvas() {
               $scope.watcher();
               $scope.content = $scope.canvas.toSVG();
            }

            $rootScope.$on('finishBlueprint', sealCanvas);
         }]
      };
   });
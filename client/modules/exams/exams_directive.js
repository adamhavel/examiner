'use strict';

angular.module('app.exams')

   .directive('question', function() {
      return {
         restrict: 'E',
         scope: {
            question: '=content',
         },
         templateUrl: 'partials/question.html',
         replace: true
      };
   })

   .directive('snippet', function() {

      function link(scope, element) {

         var code = element.children('code')[0];

         Modernizr.load({
            load: 'js/ondemand/app.highlight.min.js',
            callback: function () {
               var editor = bililiteRange.fancyText(code, Prism.highlightElement);
               bililiteRange(editor).undo(0).data().autoindent = true; // init
               editor.addEventListener('keydown', function(e) {
                  if (e.ctrlKey && e.keyCode === 90) {
                     bililiteRange.undo(e);
                  }
                  if (e.ctrlKey && e.keyCode === 89) {
                     bililiteRange.redo(e);
                  }
                  if (e.keyCode === 9) {
                     e.preventDefault();
                     document.execCommand('InsertHTML', false, '   ');
                  }
               });
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

      function link(scope, element) {

         function getElements(selector, parent) {
            parent = parent || document;
            var elements = parent.querySelectorAll(selector),
                arr = [];
            for (var i = elements.length; i--; arr.unshift(elements[i]));
            return arr;
         }

         var canvasWrapper = element[0],
             canvas = canvasWrapper.querySelector('canvas');

         canvas.width = canvasWrapper.clientWidth;
         canvas.height = canvas.width / (16/9);

         Modernizr.load({
            load: 'js/ondemand/app.canvas.min.js',
            callback: function init() {

               var canvasTools = getElements('.j-canvas-tool', canvasWrapper),
                   isMouseDown = false,
                   pointer,
                   obj;

               scope.canvas = canvas = new fabric.Canvas(canvas, {
                  selection: false,
                  defaultCursor: 'crosshair'
               });
               canvas.calcOffset();

               var History = (function(canvas, scope) {

                  var api = {};

                  var data = scope.content,
                      limit = 25;

                  api.canUndo = function() {
                     return (data.currentState > 0);
                  };

                  api.canRedo = function() {
                     return (data.currentState < data.states.length - 1);
                  };

                  api.undo = function() {
                     if (api.canUndo()) {
                        canvas.getObjects().forEach(function(obj) {
                           canvas.remove(obj);
                        });
                        canvas.loadFromJSON(data.states[--data.currentState]);
                        if (!canvas.selection) {
                           canvas.getObjects().forEach(function(obj) {
                              obj.set({
                                 selectable: false
                              });
                              obj.setCoords();
                           });
                        }
                        canvas.renderAll();
                     }
                  };

                  api.redo = function() {
                     if (api.canRedo()) {
                        canvas.getObjects().forEach(function(obj) {
                           canvas.remove(obj);
                        });
                        canvas.loadFromJSON(data.states[++data.currentState]);
                        if (!canvas.selection) {
                           canvas.getObjects().forEach(function(obj) {
                              obj.set({
                                 selectable: false
                              });
                              obj.setCoords();
                           });
                        }
                        canvas.renderAll();
                     }
                  };

                  (function init() {

                     if (!data.states) {
                        data.states = [angular.toJson(canvas)];
                        data.currentState = 0;
                     } else {
                        canvas.loadFromJSON(data.states[data.currentState]);
                        canvas.renderAll();
                     }

                     canvas.on('object:modified', function(e) {
                        if (data.currentState < data.states.length - 1) {
                           data.states = data.states.slice(0, data.currentState + 1);
                        }
                        if (data.currentState < limit - 1) {
                           data.currentState++;
                        }
                        if (data.states.length === limit) {
                           data.states.shift();
                        }
                        data.states.push(angular.toJson(canvas));
                     });

                  })();

                  return api;
               })(canvas, scope);

               var activateTool = function(toolHandler) {
                  if (!this.classList.contains('j-active')) {

                     canvasTools.forEach(function(tool) {
                        tool.classList.remove('j-active');
                     });
                     this.classList.add('j-active');

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
               }

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
                  mouseDown: function(o) {
                     canvas.calcOffset();
                  }
               };

               var paintHandler = {
                  init: function() {
                     canvas.on('path:created', function(e) {
                        e.path.set({
                           perPixelTargetFind: true
                        });
                        canvas.fire('object:modified', { target: e.path });
                     });
                     canvas.isDrawingMode = true;
                  },
                  mouseDown: function(o) {
                     canvas.calcOffset();
                  }
               };

               var rectHandler = {
                  mouseDown: function(o) {
                     canvas.calcOffset();
                     isMouseDown = true;
                     pointer = canvas.getPointer(o.e);
                     obj = new fabric.Rect({
                        strokeWidth: 2,
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
                     obj.set({
                        width: currentPointer.x - pointer.x,
                        height: currentPointer.y - pointer.y
                     });
                     canvas.renderAll();
                  },
                  mouseUp: function(o) {
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
                        strokeWidth: 2,
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
                  mouseUp: function(o) {
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
                        strokeWidth: 2,
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
                  mouseUp: function(o) {
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
                           if (
                              pointer.x >= bounds.left
                              && pointer.x <= bounds.left + bounds.width
                              && pointer.y >= bounds.top
                              && pointer.y <= bounds.top + bounds.height
                           ) {
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
                  if (History.canUndo()) {
                     canvasWrapper.querySelector('.j-canvas-undo').classList.remove('j-disabled');
                  } else {
                     canvasWrapper.querySelector('.j-canvas-undo').classList.add('j-disabled');
                  }
                  if (History.canRedo()) {
                     canvasWrapper.querySelector('.j-canvas-redo').classList.remove('j-disabled');
                  } else {
                     canvasWrapper.querySelector('.j-canvas-redo').classList.add('j-disabled');
                  }
               });

               canvasWrapper.querySelector('.j-canvas-redo').addEventListener('click', function() {
                  History.redo();
                  if (History.canUndo()) {
                     canvasWrapper.querySelector('.j-canvas-undo').classList.remove('j-disabled');
                  } else {
                     canvasWrapper.querySelector('.j-canvas-undo').classList.add('j-disabled');
                  }
                  if (History.canRedo()) {
                     canvasWrapper.querySelector('.j-canvas-redo').classList.remove('j-disabled');
                  } else {
                     canvasWrapper.querySelector('.j-canvas-redo').classList.add('j-disabled');
                  }
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

               canvas.on('object:modified', function(e) {
                  if (History.canUndo()) {
                     canvasWrapper.querySelector('.j-canvas-undo').classList.remove('j-disabled');
                  } else {
                     canvasWrapper.querySelector('.j-canvas-undo').classList.add('j-disabled');
                  }
                  if (History.canRedo()) {
                     canvasWrapper.querySelector('.j-canvas-redo').classList.remove('j-disabled');
                  } else {
                     canvasWrapper.querySelector('.j-canvas-redo').classList.add('j-disabled');
                  }
               });

               canvas.on('object:selected', function(e) {
                  canvasWrapper.querySelector('.j-canvas-remove').classList.remove('j-disabled');
               });

               canvas.on('selection:cleared', function(e) {
                  canvasWrapper.querySelector('.j-canvas-remove').classList.add('j-disabled');
               });

               window.addEventListener('keydown', function(e) {
                  if (e.keyCode == 46) {
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
               $scope.content = $scope.canvas.toSVG();
            }

            $rootScope.$on('finish', sealCanvas);
         }]
      };
   });
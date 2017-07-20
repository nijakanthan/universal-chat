(function (window, angular) {
  'use strict';

  angular.module('uniChat.directives', ['uniChat.provider'])
    .run(['$templateCache',
      function ($templateCache) {
        // $templateCache.put('uniChat/chat-container.html',
        //   '<div id="uniChatContainer" class="chat {{ positionClass }}"' +
        //     'ng-class="{ \'animated\': animation && !hover }"' + 
        //     'ng-style="{ \'height\': size + \'px\', \'width\': size + \'px\', \'background-color\': bgColor }"' +
        //     'ng-mouseover="hover = true"' +
        //     'ng-mouseleave="hover = false">' +
        //     '<div class="icon"></div>' +
        //   '</div>'
        // );
      }
    ])
    .directive('chatContainer', ['uniChat', '$templateCache', '$log',
      function (uniChat, $templateCache, $log) {
        return {
          replace: false,
          restrict: 'E',
          templateUrl: 'chat-module/chat-container.html',
          compile: function (tElem, tAttrs) {
            return function (scope) {
              scope.positionClass = uniChat.settings.positionClass;
              scope.animation = uniChat.settings.animation;
              scope.size = uniChat.settings.size;
              scope.bgColor = uniChat.settings.bgColor;
              scope.hoverIn = function() {
                scope.hover = true;
              };
              scope.hoverOut = function() {
                scope.hover = false
              };
            };
          }
        };
      }
    ]);

})(window, window.angular);
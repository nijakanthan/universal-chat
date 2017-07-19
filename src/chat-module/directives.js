(function (window, angular) {
  'use strict';

  angular.module('uniChat.directives', ['uniChat.provider'])
    .run(['$templateCache',
      function ($templateCache) {
        $templateCache.put('uniChat/chatContainer.html',
          '<div class="chat {{ positionClass }} {{ animationClass }}" ng-style="{ \'height\': size + \'px\', \'width\': size + \'px\', \'background-color\': bgColor }">' +
            '<div class="icon"></div>' +
          '</div>'
        );
      }
    ])
    .directive('chatContainer', ['uniChat', '$templateCache', '$log',
      function (uniChat, $templateCache, $log) {
        return {
          replace: false,
          restrict: 'E',
          templateUrl: 'uniChat/chatContainer.html',
          compile: function (tElem, tAttrs) {
            return function (scope) {
              scope.positionClass = uniChat.settings.positionClass;
              if (uniChat.settings.animation) {
                scope.animationClass = 'animated';
              }
              scope.size = uniChat.settings.size;
              scope.bgColor = uniChat.settings.bgColor;
            };
          }
        };
      }
    ]);

})(window, window.angular);
(function (window, angular) {
  'use strict';

  angular.module('uniChat.constants', [])
    .constant('$constants', {
        'WS': 'ws://',
        'SLASH': '/',
        'APP_NAME': 'chat',

        'BOTTOM_RIGHT': 'bottom-right',
        'TOP_RIGHT': 'top-right',
        'BOTTOM_LEFT': 'bottom-left',
        'TOP_LEFT': 'top-left',

        'OTHER_SIDE': 'other-side',
        'MY_SIDE': 'my-side'
    });

})(window, window.angular);
(function (window, angular) {
    'use strict';

    angular.module('uniChat.factories', [])
        .factory('$utilities', function () {
            return {
                getTimestamp: function (now = new Date()) {
                    var isPM = now.getHours() >= 12;
                    var isMidday = now.getHours() == 12;
                    var time = [now.getHours() - (isPM && !isMidday ? 12 : 0),
                    (now.getMinutes() < 10 ? '0' : '') + now.getMinutes(),
                    (now.getSeconds() < 10 ? '0' : '') + now.getSeconds() || '00'].join(':') + (isPM ? ' PM' : ' AM');
                    return time;
                }
            }
        });

})(window, window.angular);
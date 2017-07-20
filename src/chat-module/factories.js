(function (window, angular, undefined) {
    'use strict';

    angular.module('uniChat.factories', ['ngWebSocket'])
        .factory('$socket', ['$websocket', '$log', '$utilities',
            function ($websocket, $log, $utilities) {

                var socketStream = undefined;

                var chatMessages = [];
                var chatErrors = [];

                function initSocket(url) {
                    socketStream = $websocket(url);

                    socketStream.onOpen(function (message) {
                        $log.info('Websocket ' + url + ' opened successfully..');
                    });

                    socketStream.onMessage(function (message) {
                        var msg = {
                            message: message,
                            time: $utilities.getTimestamp()
                        }
                        chatMessages.push(msg);
                    });

                    socketStream.onClose(function (message) {
                        $log.info('Websocket ' + url + ' closes successfully..');
                    });

                    socketStream.onError(function (message) {
                        var error = {
                            error: message,
                            time: $utilities.getTimestamp()
                        }
                        chatErrors.push(error);
                    });
                }

                return {
                    messages: chatMessages,
                    errors: chatErrors,
                    open: function (url) {
                        initSocket(url);
                    },
                    send: function (message) {
                        socketStream.send(message);
                    },
                    close: function () {
                        if (socketStream) {
                            socketStream.close();
                        }
                    }
                }
            }
        ])
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
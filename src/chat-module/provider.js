(function (window, angular) {
    'use strict';

    angular.module('uniChat.provider', ['ngWebSocket', 'uniChat.factories', 'uniChat.constants'])
        .provider('uniChat', [
            function () {

                var chats = [];
                var streams = {};

                var defaults = {
                    animation: false,
                    positionClass: 'bottom-right',
                    size: 50,
                    bgColor: 'orange'
                }

                this.configure = function (config) {
                    angular.extend(defaults, config);
                };

                this.$get = function ($websocket, $log, $utilities, $constants) {
                    return {
                        chats: chats,
                        settings: defaults,
                        create: function (chatData) {
                            var url = $constants.WS
                                + defaults.host
                                + $constants.SLASH
                                + defaults.context
                                + $constants.SLASH
                                + $constants.APP_NAME
                                + $constants.SLASH
                                + chatData.sender.username
                                + $constants.SLASH
                                + chatData.receiver.username
                                + $constants.SLASH
                                + chatData.workItem.id;

                            var sessionID = chatData.sender.username + chatData.receiver.username + chatData.workItem.id;

                            var largest = 0;
                            if (chats.length != 0) {
                                largest = Math.max.apply(Math, chats.map(function (item) { return item.id; }));
                            }

                            streams[sessionID] = $websocket(url);
                            streams[sessionID].messages = [];
                            streams[sessionID].onOpen(function (message) {
                                $log.info('Websocket ' + url + ' opened successfully..');
                            });
                            streams[sessionID].onMessage(function (message) {
                                var msgObj = JSON.parse(message.data);
                                msgObj.time = $utilities.getTimestamp();
                                msgObj.side = $constants.OTHER_SIDE;
                                streams[sessionID].messages.push(msgObj);
                            });
                            streams[sessionID].onClose(function (message) {
                                $log.info('Websocket ' + url + ' closes successfully..');
                            });
                            streams[sessionID].onError(function (message) {
                                $log.error('Websocket connection error ' + url);
                            });

                            chats.push({
                                'id': largest + 1,
                                'receiver': chatData.receiver,
                                'workItem': chatData.workItem,
                                'sessionID': sessionID,
                                'messages': streams[sessionID].messages
                            });
                        },
                        send: function (chat) {
                            if (chat.chatMessage != undefined && chat.chatMessage != '') {
                                var msgObj = {
                                    'message': chat.chatMessage,
                                    'time': $utilities.getTimestamp(),
                                    'side': $constants.MY_SIDE
                                }
                                chat.chatMessage = '';
                                streams[chat.sessionID].messages.push(msgObj)
                                streams[chat.sessionID].send(msgObj);
                            }
                        },
                        close: function (chat) {
                            streams[chat.sessionID].close();
                            for (var i = 0; i < chats.length; i++) {
                                if (chats[i].id == chat.id) {
                                    chats.splice(i, 1);
                                }
                            }
                        }
                    };
                };
            }
        ]);

})(window, window.angular);
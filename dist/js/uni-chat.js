(function (window, angular) {
    'use strict';

    angular.module('uniChat', [
        'uniChat.directives'
    ]);

})(window, window.angular);
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
(function (window, angular) {
  'use strict';

  angular.module('uniChat.directives', ['uniChat.provider'])
    .run(['$templateCache',
      function ($templateCache) {
        $templateCache.put('uniChat/chat-container.html',
          '<div class="chat-container {{ positionClass }}"' +
            'ng-mouseover="hoverIn()"' +
            'ng-mouseleave="hoverOut()">' +
            '<div class="available-chats">' +
              '<div class="add-new-chat">' +
                  '<button ng-class="{ \'on-hover\': hover }" ng-click="addNewChat()">' +
                      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 286.376 286.376" style="enable-background:new 0 0 286.376 286.376;" xml:space="preserve" width="512px" height="512px">' +
                          '<g id="Add">' +
                            '<path style="fill-rule:evenodd;clip-rule:evenodd;" d="M268.477,125.29H161.086V17.899c0-9.885-8.013-17.898-17.898-17.898   s-17.898,8.013-17.898,17.898v107.39H17.9c-9.885,0-17.9,8.013-17.9,17.898c0,9.885,8.015,17.898,17.9,17.898h107.39v107.39   c0,9.885,8.013,17.898,17.898,17.898s17.898-8.013,17.898-17.898v-107.39h107.391c9.885,0,17.898-8.014,17.898-17.898   C286.376,133.303,278.362,125.29,268.477,125.29z" fill="#FFFFFF"/>' +
                          '</g>' +
                      '</svg>' +
                  '</button>' +
              '</div>' +
            '</div>' +
            '<div class="main-chat">' +
                '<button ng-class="{ \'animated\': animation && !hover }"' + 
                    'ng-style="{ \'height\': size + \'px\', \'width\': size + \'px\', \'background-color\': bgColor }">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 511.626 511.626" style="enable-background:new 0 0 511.626 511.626;" xml:space="preserve">' +
                        '<g>' +
                          '<path d="M477.371,127.44c-22.843-28.074-53.871-50.249-93.076-66.523c-39.204-16.272-82.035-24.41-128.478-24.41   c-34.643,0-67.762,4.805-99.357,14.417c-31.595,9.611-58.812,22.602-81.653,38.97c-22.845,16.37-41.018,35.832-54.534,58.385   C6.757,170.833,0,194.484,0,219.228c0,28.549,8.61,55.3,25.837,80.234c17.227,24.931,40.778,45.871,70.664,62.811   c-2.096,7.611-4.57,14.846-7.426,21.693c-2.855,6.852-5.424,12.474-7.708,16.851c-2.286,4.377-5.376,9.233-9.281,14.562   c-3.899,5.328-6.849,9.089-8.848,11.275c-1.997,2.19-5.28,5.812-9.851,10.849c-4.565,5.048-7.517,8.329-8.848,9.855   c-0.193,0.089-0.953,0.952-2.285,2.567c-1.331,1.615-1.999,2.423-1.999,2.423l-1.713,2.566c-0.953,1.431-1.381,2.334-1.287,2.707   c0.096,0.373-0.094,1.331-0.57,2.851c-0.477,1.526-0.428,2.669,0.142,3.433v0.284c0.765,3.429,2.43,6.187,4.998,8.277   c2.568,2.092,5.474,2.95,8.708,2.563c12.375-1.522,23.223-3.606,32.548-6.276c49.87-12.758,93.649-35.782,131.334-69.097   c14.272,1.522,28.072,2.286,41.396,2.286c46.442,0,89.271-8.138,128.479-24.417c39.208-16.272,70.233-38.448,93.072-66.517   c22.843-28.062,34.263-58.663,34.263-91.781C511.626,186.108,500.207,155.509,477.371,127.44z" fill="#FFFFFF"/>' +
                        '</g>' +
                    '</svg>' +
                '</button>' +
            '</div>' +
          '</div>' +
          '<div class="chat-windows">' +
              '<uni-chat-window ng-repeat="chatWindow in chatWindows" id="$index" bg="bgColor" config="chatWindow" on-close="closeChatWindow(chatWindow)" on-msg-send="sendChatMessage(chatWindow)"></uni-chat-window>' +
          '</div>'
        );
        $templateCache.put('uniChat/chat-window.html',
          '<div class="chat-window" ng-style="{ \'right\': getRightPX() + \'px\' }" ng-class="{ \'minimized\': minimized }">' +
            '<div class="header" ng-style="{ \'background-color\': bgColor }">' +
              '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 511.626 511.626" style="enable-background:new 0 0 511.626 511.626;" xml:space="preserve">' +
                '<g>' +
                  '<path d="M477.371,127.44c-22.843-28.074-53.871-50.249-93.076-66.523c-39.204-16.272-82.035-24.41-128.478-24.41   c-34.643,0-67.762,4.805-99.357,14.417c-31.595,9.611-58.812,22.602-81.653,38.97c-22.845,16.37-41.018,35.832-54.534,58.385   C6.757,170.833,0,194.484,0,219.228c0,28.549,8.61,55.3,25.837,80.234c17.227,24.931,40.778,45.871,70.664,62.811   c-2.096,7.611-4.57,14.846-7.426,21.693c-2.855,6.852-5.424,12.474-7.708,16.851c-2.286,4.377-5.376,9.233-9.281,14.562   c-3.899,5.328-6.849,9.089-8.848,11.275c-1.997,2.19-5.28,5.812-9.851,10.849c-4.565,5.048-7.517,8.329-8.848,9.855   c-0.193,0.089-0.953,0.952-2.285,2.567c-1.331,1.615-1.999,2.423-1.999,2.423l-1.713,2.566c-0.953,1.431-1.381,2.334-1.287,2.707   c0.096,0.373-0.094,1.331-0.57,2.851c-0.477,1.526-0.428,2.669,0.142,3.433v0.284c0.765,3.429,2.43,6.187,4.998,8.277   c2.568,2.092,5.474,2.95,8.708,2.563c12.375-1.522,23.223-3.606,32.548-6.276c49.87-12.758,93.649-35.782,131.334-69.097   c14.272,1.522,28.072,2.286,41.396,2.286c46.442,0,89.271-8.138,128.479-24.417c39.208-16.272,70.233-38.448,93.072-66.517   c22.843-28.062,34.263-58.663,34.263-91.781C511.626,186.108,500.207,155.509,477.371,127.44z" fill="#FFFFFF" />' +
                '</g>' +
              '</svg>' +
              '<span>{{ chatConfig.receiver.fullName }}</span>' +
              '<button ng-click="close()">' +
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 47.971 47.971" style="enable-background:new 0 0 47.971 47.971;" xml:space="preserve" width="512px" height="512px">' +
                  '<g>' +
                    '<path d="M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88   c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242   C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879   s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z" fill="#FFFFFF"/>' +
                  '</g>' +
                '</svg>' +
              '</button>' +
              '<button ng-click="minimize()">' +
                '<!-- up line -->' +
                '<svg ng-show="minimized" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 124 124" style="enable-background:new 0 0 124 124;" xml:space="preserve">' +
                  '<g>' +
                    '<path d="M112,6H12C5.4,6,0,11.4,0,18s5.4,12,12,12h100c6.6,0,12-5.4,12-12S118.6,6,112,6z" fill="#FFFFFF"/>' +
                  '</g>' +
                '</svg>' +
                '<!-- down line -->' +
                '<svg ng-hide="minimized" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 124 124" style="enable-background:new 0 0 124 124;" xml:space="preserve">' +
                  '<g>' +
                    '<path d="M112,94H12c-6.6,0-12,5.4-12,12s5.4,12,12,12h100c6.6,0,12-5.4,12-12S118.6,94,112,94z" fill="#FFFFFF"/>' +
                  '</g>' +
                '</svg>' +
              '</button>' +
            '</div>' +
            '<div class="body" ng-hide="minimized">' +
              '<div class="chat-details">' +
                '<div>' +
                  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 350 350" style="enable-background:new 0 0 350 350;" xml:space="preserve" width="512px" height="512px">' +
                    '<g>' +
                      '<path d="M175,171.173c38.914,0,70.463-38.318,70.463-85.586C245.463,38.318,235.105,0,175,0s-70.465,38.318-70.465,85.587   C104.535,132.855,136.084,171.173,175,171.173z" fill="#777777" />' +
                      '<path d="M41.909,301.853C41.897,298.971,41.885,301.041,41.909,301.853L41.909,301.853z" fill="#777777" />' +
                      '<path d="M308.085,304.104C308.123,303.315,308.098,298.63,308.085,304.104L308.085,304.104z" fill="#777777" />' +
                      '<path d="M307.935,298.397c-1.305-82.342-12.059-105.805-94.352-120.657c0,0-11.584,14.761-38.584,14.761   s-38.586-14.761-38.586-14.761c-81.395,14.69-92.803,37.805-94.303,117.982c-0.123,6.547-0.18,6.891-0.202,6.131   c0.005,1.424,0.011,4.058,0.011,8.651c0,0,19.592,39.496,133.08,39.496c113.486,0,133.08-39.496,133.08-39.496   c0-2.951,0.002-5.003,0.005-6.399C308.062,304.575,308.018,303.664,307.935,298.397z" fill="#777777" />' +
                    '</g>' +
                  '</svg>' +
                  '<span><b>Receiver Username : </b> {{ chatConfig.receiver.username }}</span>' +
                '</div>' +
                '<div>' +
                  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 30.263 30.263" style="enable-background:new 0 0 30.263 30.263;" xml:space="preserve" width="512px" height="512px">' +
                    '<g>' +
                      '<rect x="0" y="2.332" width="7.732" height="6.398" fill="#777777" />' +
                      '<rect x="0" y="11.932" width="7.732" height="6.4" fill="#777777" />' +
                      '<rect x="0" y="21.531" width="7.732" height="6.398" fill="#777777" />' +
                      '<rect x="10.933" y="11.934" width="19.33" height="6.4" fill="#777777" />' +
                      '<rect x="10.933" y="21.531" width="19.33" height="6.4" fill="#777777" />' +
                      '<rect x="10.933" y="2.332" width="19.33" height="6.4" fill="#777777" />' +
                    '</g>' +
                  '</svg>' +
                  '<span><b>{{ chatConfig.workItem.name }} : </b> {{ chatConfig.workItem.id }}</span>' +
                '</div>' +
              '</div>' +
              '<div class="chat-messages" uni-scroll-glue>' +
                '<ul class="chat">' +
                  '<li ng-repeat="message in messages" class="{{ message.side }}">' +
                    '<div class="chat-bubble">' +
                      '<div class="msg">' +
                        '<p>{{ message.message }}</p>' +
                        '<time>{{ message.time }}</time>' +
                      '</div>' +
                    '</div>' +
                  '</li>' +
                '</ul>' +
              '</div>' +
            '</div>' +
            '<div class="footer" ng-hide="minimized">' +
              '<!-- Use \'/\' for commands. -->' +
              '<input type="text" placeholder="Type here to chat." ng-model="chatConfig.chatMessage" uni-enter="send()" />' +
              '<button ng-click="send()">Send</button>' +
            '</div>' +
          '</div>'
        );
      }
    ])
    .directive('uniChatContainer', ['uniChat', '$templateCache',
      function (uniChat, $templateCache) {
        return {
          replace: false,
          restrict: 'E',
          templateUrl: 'uniChat/chat-container.html',
          compile: function (tElem, tAttrs) {
            return function (scope) {
              scope.positionClass = uniChat.settings.positionClass;
              scope.animation = uniChat.settings.animation;
              scope.size = uniChat.settings.size;
              scope.bgColor = uniChat.settings.bgColor;

              scope.chatWindows = uniChat.chats;

              scope.hoverIn = function () {
                scope.hover = true;
              };
              scope.hoverOut = function () {
                scope.hover = false
              };
              scope.addNewChat = function () {
                // console.log('Add new Chat...');
              };
              scope.sendChatMessage = function (chat) {
                uniChat.send(chat);
              };
              scope.closeChatWindow = function (chat) {
                uniChat.close(chat);
              };
            };
          }
        };
      }
    ])
    .directive('uniChatWindow', ['$templateCache', '$log',
      function ($templateCache, $log) {
        return {
          replace: false,
          restrict: 'E',
          scope: {
            chatID: '=id',
            chatConfig: '=config',
            bgColor: '=bg',
            close: '&onClose',
            send: '&onMsgSend'
          },
          templateUrl: 'uniChat/chat-window.html',
          compile: function (tElem, tAttrs) {
            return function (scope) {

              scope.messages = [];

              scope.$watch('chatConfig.messages', function (newValue, oldValue) {
                if (newValue.length != 0) {
                  var newObject = newValue[newValue.length - 1];
                  scope.messages.push(newObject);
                }
              }, true);

              scope.minimized = false;
              scope.minimize = function () {
                scope.minimized = !scope.minimized;
              };
              scope.getRightPX = function () {
                return 90 + (350 + 10) * ((scope.chatID + 1) - 1);
              }
            }
          }
        }
      }
    ])
    .directive('uniEnter', [
      function () {
        return function (scope, element, attrs) {
          element.bind('keydown keypress', function (event) {
            if (event.which === 13) {
              scope.$apply(function () {
                scope.$eval(attrs.uniEnter);
              });
              event.preventDefault();
            }
          });
        };
      }
    ])
    .directive('uniScrollGlue', ['$parse', '$window', '$timeout',
      function ($parse, $window, $timeout) {

        function createActivationState($parse, attr, scope) {
          function unboundState(initValue) {
            var activated = initValue;
            return {
              getValue: function () {
                return activated;
              },
              setValue: function (value) {
                activated = value;
              }
            };
          }

          function oneWayBindingState(getter, scope) {
            return {
              getValue: function () {
                return getter(scope);
              },
              setValue: function () { }
            };
          }

          function twoWayBindingState(getter, setter, scope) {
            return {
              getValue: function () {
                return getter(scope);
              },
              setValue: function (value) {
                if (value !== getter(scope)) {
                  scope.$apply(function () {
                    setter(scope, value);
                  });
                }
              }
            };
          }

          if (attr !== "") {
            var getter = $parse(attr);
            if (getter.assign !== undefined) {
              return twoWayBindingState(getter, getter.assign, scope);
            } else {
              return oneWayBindingState(getter, scope);
            }
          } else {
            return unboundState(true);
          }
        }
        var direction = {
          isAttached: function (el) {
            // + 1 catches off by one errors in chrome
            return el.scrollTop + el.clientHeight + 1 >= el.scrollHeight;
          },
          scroll: function (el) {
            el.scrollTop = el.scrollHeight;
          }
        };

        return {
          priority: 1,
          restrict: 'A',
          link: function (scope, $el, attrs) {
            var el = $el[0],
              activationState = createActivationState($parse, attrs['uniScrollGlue'], scope);

            function scrollIfGlued() {
              if (activationState.getValue() && !direction.isAttached(el)) {
                // Ensures scroll after angular template digest
                $timeout(function () {
                  direction.scroll(el);
                });
              }
            }

            function onScroll() {
              activationState.setValue(direction.isAttached(el));
            }

            $timeout(scrollIfGlued, 0, false);

            if (!$el[0].hasAttribute('force-glue')) {
              $el.on('scroll', onScroll);
            }

            var hasAnchor = false;
            angular.forEach($el.children(), function (child) {
              if (child.hasAttribute('scroll-glue-anchor')) {
                hasAnchor = true;
                scope.$watch(function () { return child.offsetHeight }, function () {
                  scrollIfGlued();
                });
              }
            });

            if (!hasAnchor) {
              scope.$watch(scrollIfGlued);
              $window.addEventListener('resize', scrollIfGlued, false);
            }

            // Remove listeners on directive destroy
            $el.on('$destroy', function () {
              $el.unbind('scroll', onScroll);
            });

            scope.$on('$destroy', function () {
              $window.removeEventListener('resize', scrollIfGlued, false);
            });
          }
        };
      }
    ]);

})(window, window.angular);
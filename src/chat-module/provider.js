(function (window, angular, undefined) {
    'use strict';

    angular.module('uniChat.provider', []).provider('uniChat', [
        function () {

            var defaults = {
                animation: false,
                positionClass: 'bottom-right',
                size: 50,
                bgColor: 'orange'
            }

            this.configure = function (config) {
                angular.extend(defaults, config);
            };

            this.$get = function () {
                return {
                    settings: defaults
                };
            };
        }
    ]);

})(window, window.angular);
var samplechat = angular.module('samplechat', [
    'uniChat'
]);

samplechat.config(['uniChatProvider', function (unichatProvider) {
    unichatProvider.configure({
        positionClass: 'bottom-right',
        animation: true,
        bgColor: '#333'
    });
}]);
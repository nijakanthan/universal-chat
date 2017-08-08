var samplechat = angular.module('samplechat', [
    'uniChat'
]);

samplechat.config(['uniChatProvider', function (unichatProvider) {
    unichatProvider.configure({
        host: 'localhost:8080',
        context: 'chatter',
        positionClass: 'bottom-right',
        animation: true,
        bgColor: '#0095FF'
    });
}]);

samplechat.controller('SampleAppController', ['$scope', 'uniChat', function ($scope, uniChat) {
    $scope.buttonClickAtoB = function () {
        uniChat.create({
            'sender': {
                'username': 'aaaaa',
                'fullName': 'Aaaaa Aaaaa'
            },
            'receiver': {
                'username': 'bbbbb',
                'fullName': 'Bbbbb Bbbbb'
            },
            'workItem': {
                'id': '00111',
                'name': 'Purchase Order'
            }
        });
    };
    $scope.buttonClickBtoA = function () {
        uniChat.create({
            'sender': {
                'username': 'bbbbb',
                'fullName': 'Bbbbb Bbbbb'
            },
            'receiver': {
                'username': 'aaaaa',
                'fullName': 'Aaaaa Aaaaa'
            },
            'workItem': {
                'id': '00111',
                'name':'Purchase Order'
            }
        });
    };
}]);
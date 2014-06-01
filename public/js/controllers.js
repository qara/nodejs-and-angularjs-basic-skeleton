/**
 * Created by nasser on 5/28/2014.
 */
$str = [];
$str.loading = 'Loading...';

var app = angular.module('myApp',[] /*['myApp.filters', 'myApp.directives']*/);
// In this case it is a simple value service.
app.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

    app.controller('MainController', function ($scope,socket) {

        $scope.phones = [{name: $str.loading}];

        socket.on('mobiles', function (data) {
             $scope.phones = data;
            socket.emit('mobiles:isready','mobiles:isready');
        });
    });




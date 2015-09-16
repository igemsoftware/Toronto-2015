'use strict';

angular.module('HyperFlux')

.controller('HeaderCtrl', ['$rootScope', '$scope', '$timeout', '$state', '$urlRouter',
        function($rootScope, $scope, $timeout, $state, $urlRouter) {
    $scope.title = 'header component';

    $scope.rippleColour = 'teal-500';
}]);

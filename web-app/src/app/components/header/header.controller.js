'use strict';

angular.module('ConsortiaFlux')

.controller('HeaderCtrl', ['$rootScope', '$scope', '$timeout', '$state', '$urlRouter',
        function($rootScope, $scope, $timeout, $state, $urlRouter) {
    $scope.title = 'header component';

    $scope.rippleColour = 'teal-500';
}]);

/* global console */
'use strict';

angular.module('ConsortiaFlux')

.controller('AddSpecieModal', ['$scope', 'close', function($scope, close) {

    var result = 'wheee';

    $scope.display = true;

    $scope.close = function(result) {
        $scope.display = false;
        close(result, 200); // close, but give 200ms for bootstrap to animate
    };

}]);

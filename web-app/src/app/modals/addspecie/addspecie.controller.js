/* global console */
'use strict';

angular.module('ConsortiaFlux')

.controller('AddSpecieModal', ['$scope', '$http', 'UrlProvider', 'close',
    function($scope, $http, UrlProvider, close) {

    var result = 'wheee';
    $scope.loading = true;

    $http.get(UrlProvider.baseUrl + '/model/retrieve').then(function(data) {
        $scope.loading = false;
        $scope.species = data.data;
    });

    $scope.display = true;

    $scope.close = function(result) {
        $scope.display = false;
        close(result, 200); // close, but give 200ms for bootstrap to animate
    };

}]);

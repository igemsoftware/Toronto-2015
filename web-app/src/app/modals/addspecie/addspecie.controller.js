/* global console */
'use strict';

angular.module('ConsortiaFlux')

.controller('AddSpecieModal', ['$scope', '$http', 'UrlProvider', 'close',
    function($scope, $http, UrlProvider, close) {
        $scope.loading = true;
        $scope.display = true;

        $http.get(UrlProvider.baseUrl + '/model/retrieve').then(function(data) {
            $scope.loading = false;
            $scope.species = data.data;
        });

        $scope.choose = function(chosen) {
            $scope.display = false;
            close(chosen);
        };

        $scope.close = function(result) {
            $scope.display = false;
            close(result); // close, but give 200ms for bootstrap to animate
        };

    }
]);

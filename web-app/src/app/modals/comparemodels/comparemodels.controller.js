/* global console */
'use strict';

angular.module('ConsortiaFlux')

.controller('CompareModelsModal', ['$scope', '$http', 'UrlProvider', 'close',

    function($scope, $http, UrlProvider, close) {
        $scope.loading = true;
        $scope.display = true;


        $scope.close = function(result) {
            $scope.display = false;
            close(null);
        };
    }

]);

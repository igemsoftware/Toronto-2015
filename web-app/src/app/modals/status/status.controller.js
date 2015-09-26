/* global console */
'use strict';

angular.module('ConsortiaFlux')

.controller('StatusModal', ['$scope', '$http', 'UrlProvider', 'models', 'close',
    function($scope, $http, UrlProvider, models, close) {
        $scope.display = true;

        $scope.models = models;

        console.log($scope.models);

        $scope.close = function() {
            $scope.display = false;
            close(null);
        };
    }
]);

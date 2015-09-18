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

            $scope.groups = [{
                title: 'Dynamic Group Header - 1',
                content: 'Dynamic Group Body - 1'
            }, {
                title: 'Dynamic Group Header - 2',
                content: 'Dynamic Group Body - 2'
            }];
        });

        $scope.display = true;

        $scope.close = function(result) {
            $scope.display = false;
            close(result, 200); // close, but give 200ms for bootstrap to animate
        };

    }
]);

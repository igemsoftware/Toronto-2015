/* global console */
'use strict';

angular.module('ConsortiaFlux')

.controller('ChangeCommunityModal', ['$scope', '$http', 'UrlProvider', 'close',
    function($scope, $http, UrlProvider, close) {
        $scope.loading = true;
        $scope.display = true;
        $scope.communities = [];

        $http.get(UrlProvider.baseUrl + '/community/retrieve/all').then(function(res) {
            $scope.loading = false;
            $scope.communities = res.data;
        }, function(err) {
            console.log(err);
        });


        $scope.close = function() {
            $scope.display = false;
            close(null);
        };

    }
]);

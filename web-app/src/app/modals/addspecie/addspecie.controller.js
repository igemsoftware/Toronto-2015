/* global console */
'use strict';

angular.module('ConsortiaFlux')

.controller('AddSpecieModal', ['$scope', '$http', 'UrlProvider', 'close',
    function($scope, $http, UrlProvider, close) {
        $scope.loading = true;
        $scope.display = true;
        $scope.community = [];

        $http.get(UrlProvider.baseUrl + '/model/retrieve').then(function(data) {
            $scope.loading = false;
            $scope.species = data.data;
        }, function(err) {
            console.log(err);
        });

        $scope.checkboxClick = function(model, $event) {
            $event.stopPropagation();
            // alert(JSON.stringify($scope.models));

            if ($scope.community.indexOf(model) === -1) {
                $scope.community.push(model);
            } else {
                $scope.community.pop(model);
            }
        };

        $scope.render = function() {
            $scope.display = false;

            var community = {
                name: $scope.communityName,
                models: $scope.community
            };

            close(community);
        };

        $scope.close = function() {
            $scope.display = false;
            close(null);
        };

    }
]);

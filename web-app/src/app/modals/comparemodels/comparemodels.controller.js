/* global console */
'use strict';

angular.module('ConsortiaFlux')

.controller('CompareModelsModal', ['$scope', '$http', 'UrlProvider', 'close',

    function($scope, $http, UrlProvider, close) {

        $scope.loading = true;
        $scope.display = true;
        $scope.communities = [];

        $http.get(UrlProvider.baseUrl + '/community/all').then(function(res) {
            $scope.loading = false;
            $scope.communities = res.data;
            console.log(res.data)
        }, function(err) {
            console.log(err);
        });

        $scope.checkboxClick = function(model, $event) {
            $event.stopPropagation();

            $scope.community = [];
            $scope.communities.forEach(function(specie) {
                specie.models.forEach(function(model) {
                    if (model.checked) {
                        if ($scope.community.indexOf(model.id) === -1)
                            $scope.community.push(model.id);
                    }
                });
            });
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

/* global console */
'use strict';

angular.module('ConsortiaFlux')

.controller('AddSpecieModal', ['$scope', '$http', 'UrlProvider', 'close',
    function($scope, $http, UrlProvider, close) {
        $scope.loading = true;
        $scope.display = true;
        $scope.community = [];

        $http.get(UrlProvider.baseUrl + '/specie/retrieve/all').then(function(res) {
            $scope.loading = false;
            $scope.species = res.data;
        }, function(err) {
            console.log(err);
        });

        $scope.checkboxClick = function(model, $event) {
            $event.stopPropagation();

            $scope.community = [];
            $scope.species.forEach(function(specie) {
                specie.models.forEach(function(model) {
                    if (model.checked) {
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

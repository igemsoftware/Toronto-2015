/* global console */
'use strict';

angular.module('ConsortiaFlux')

.controller('ChangeCommunityModal', ['$scope', '$http', 'UrlProvider', 'CommunityCreator', 'close',
    function($scope, $http, UrlProvider, CommunityCreator, close) {
        $scope.loading = true;
        $scope.display = true;
        $scope.communities = [];

        $http.get(UrlProvider.baseUrl + '/community/retrieve/all').then(function(res) {
            $scope.loading = false;
            $scope.communities = res.data;
            console.log($scope.communities);
        }, function(err) {
            console.log(err);
        });

        $scope.renderCommunity = function() {
            $scope.communities.forEach(function(community) {
                if (community.checked === 'true') {
                    community.models = [];
                    community.members.forEach(function(member) {
                        community.models.push(member.model);
                    });

                    console.log(community);
                    close(community);
                    // CommunityCreator.modelId = community.id;
                    // CommunityCreator.
                }
            });
        };

        $scope.close = function() {
            $scope.display = false;
            close(null);
        };

    }
]);

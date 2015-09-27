/* global console */
'use strict';

angular.module('ConsortiaFlux')

.controller('CompareModelsModal', ['$scope', '$http', 'UrlProvider', 'close',

    function($scope, $http, UrlProvider, close) {
        $scope.display = true;
        $scope.choosing = true;
        $scope.loading = false;
        $scope.ready = false;
        $scope.models = [];
        $scope.selectedScreen = true;
        $scope.limit = 2;
        $scope.checked = 0;

        $scope.chosenModels = [];
        $scope.disabled = false;

        $scope.sended = {
            type: '',
            models: []
        }

        var load = function(choosable) {
            if (choosable === 'community') {
                $scope.sended.type = 'communities';

                $http.get(UrlProvider.baseUrl + '/community/retrieve/all').then(function(res) {
                    console.log(res.data);
                    res.data.forEach(function(community) {
                        if ($scope.models.indexOf(community.id) === -1)
                            $scope.models.push(community.id);
                    });
                    $scope.ready = true;
                }, function(err) {
                    console.log(err);
                });
            } else if (choosable === 'specie') {
                $scope.sended.type = 'models';

                $http.get(UrlProvider.baseUrl + '/specie/retrieve/all').then(function(res) {
                    res.data.forEach(function(specie) {
                        specie.models.forEach(function(model) {
                            if ($scope.models.indexOf(model.id) === -1)
                                $scope.models.push(model.id);
                        });
                    });
                    $scope.ready = true;
                }, function(err) {
                    console.log(err);
                });
            }
        };

        $scope.go = function() {
            console.log($scope.choosables);
            Object.keys($scope.choosables).forEach(function(choosable) {
                if ($scope.choosables[choosable] === 'true') {
                    $scope.choosing = false;
                    load(choosable);
                }
            });
        };

        $scope.disabled = function(model) {
            if ($scope.chosenModels.indexOf(model) !== -1) {
                return false;
            } else {
                if ($scope.limit == $scope.chosenModels.length) {
                    return true;
                } else {
                    return false;
                }
            }
        };

        $scope.checkBoxHandler = function(model) {
            if ($scope.chosenModels.indexOf(model) === -1) {
                $scope.chosenModels.push(model);
            } else {
                $scope.chosenModels.pop(model);
            }
        };

        $scope.send = function() {

            $scope.sended.models = $scope.chosenModels;

            this.receiver = function(res) {
                var data = []
                $scope.selectedScreen = false
                for(var key in res.data){
                    data.push({
                        name: key,
                        flux: res.data[key]
                    })
                }
                $scope.data = data
            }

            this.errorCatch = function(err) {
                console.log(err);
            };
            var send = {
                id1: $scope.sended.models[0],
                id2: $scope.sended.models[1],
                type: $scope.sended.type
            }

            var requestUrl = UrlProvider.baseUrl + '/model/comparemodels/';
            console.log(requestUrl)

            // $http.post(requestUrl, send).then(function(res) {
            //     console.log(res.data);
            // }, function(err) {
            //     console.log(err);
            // })

            $http.post(requestUrl, send).then(this.receiver.bind(this), this.errorCatch.bind(this));
        }

        $scope.close = function() {
            $scope.display = false;
            close(null);
        };
    }

]);

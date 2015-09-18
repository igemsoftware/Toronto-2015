/* global window */
/* global console */
/* global ConsortiaFluxVisualization */
/* global UrlProvider */
/* global data */
'use strict';

angular.module('ConsortiaFlux')

.controller('FluxCtrl', ['$scope', '$http', 'UrlProvider', 'ModalService',
    function($scope, $http, UrlProvider, ModalService) {

    $scope.currentModel = 'iJO1366';

    $scope.data = {};

    $scope.loading = true;

    $http.get(UrlProvider.baseUrl + '/model/retrieve/' + $scope.currentModel).then(function(res){
        $scope.data = res.data;
        // startConsortiaFlux(res.data);
    }, function(err) {
        console.log(err);
    });

    $scope.$watch('data', function(newValue) {
        console.log(newValue);
        startConsortiaFlux($scope.data);
    });

    var startConsortiaFlux = function(data) {
        var sortables = {
            index: -1,
            identifiers: ['species', 'compartments', 'subsystems']
        };

        var networkAttributes = {
            wrapperId: 'canvas-wrapper',
            id: 'root',
            name: 'root',
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColour: 'white',
            metaboliteRadius: 10,
            useStatic: false,
            everything: false,
            hideObjective: true,
            data: data,
            sortables: sortables,
            showStats: false
        };

        var hyperFlux = new ConsortiaFluxVisualization(networkAttributes);
    };

    startConsortiaFlux(data);

    $scope.addSpecie = function() {
        ModalService.showModal({
            templateUrl: "app/modals/addspecie/addspecie.html",
            controller: "AddSpecieModal"
        }).then(function(modal) {
            modal.close.then(function(result) {
                if (result)
                    $scope.currentModel = result;
            });
        });
    };
}]);

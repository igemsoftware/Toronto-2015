/* global window */
/* global console */
/* global ConsortiaFluxVisualization */
/* global UrlProvider */
/* global data */
'use strict';

angular.module('ConsortiaFlux')

.controller('FluxCtrl', ['$scope', '$http', 'UrlProvider', 'ModalService',
    function($scope, $http, UrlProvider, ModalService) {

    $scope.addSpecie = function() {
        // Just provide a template url, a controller and call 'showModal'.
        ModalService.showModal({
            templateUrl: "app/modals/addspecie/addspecie.html",
            controller: "AddSpecieModal"
        }).then(function(modal) {

            // modal.element.modal();

            modal.close.then(function(result) {
                console.log(result);
                $scope.message = result ? "You said Yes" : "You said No";
            });
        });
    };

    // $http.get(UrlProvider.baseUrl + '/model/retrieve').then(function(data) {
    //     console.log(data.data);
    // });

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
}]);

/* global window */
'use strict';

angular.module('HyperFlux')

.controller('FluxCtrl', ['$scope', function($scope) {
    // $scope.title = 'iGEM UofT Computation Biology!';

    console.log('fluxes?');

    var sortables = {
        index       : -1,
        identifiers : ['species', 'compartments', 'subsystems']
    };

    var networkAttributes = {
        id               : 'root',
        name             : 'root',
        width            : window.innerWidth,
        height           : window.innerHeight,
        backgroundColour : 'white',
        metaboliteRadius : 10,
        useStatic        : false,
        everything       : false,
        hideObjective    : true,
        data             : data,
        sortables        : sortables,
        showStats        : false
    };

    var hyperFlux = new HyperFluxVisualization(networkAttributes);

}]);

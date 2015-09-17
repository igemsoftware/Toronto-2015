/* global window */
/* global console */
/* global ConsortiaFluxVisualization */
'use strict';

angular.module('ConsortiaFlux')

.controller('FluxCtrl', ['$scope', function($scope) {
    // $scope.title = 'iGEM UofT Computation Biology!';

    console.log('fluxes?');

    var sortables = {
        index       : -1,
        identifiers : ['species', 'compartments', 'subsystems']
    };

    var networkAttributes = {
        wrapperId        : 'canvas-wrapper',
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

    var hyperFlux = new ConsortiaFluxVisualization(networkAttributes);

}]);

/* global window */
/* global console */
/* global ConsortiaFluxVisualization */
/* global UrlProvider */
/* global data */
'use strict';

angular.module('ConsortiaFlux')

.controller('FluxCtrl', ['$scope', '$http', 'UrlProvider', function($scope, $http, UrlProvider) {
    // $scope.title = 'iGEM UofT Computation Biology!';

    $http.get(UrlProvider.baseUrl + '/model/retrieve').then(function(data) {
        console.log(data.data);
    });

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

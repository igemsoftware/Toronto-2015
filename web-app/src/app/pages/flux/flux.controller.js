/* global window */
/* global console */
/* global ConsortiaFluxVisualization */
/* global UrlProvider */
/* global data */
/* global FluxCtrl */
/* global ModalService */
'use strict';

angular.module('ConsortiaFlux').controller('FluxCtrl', FluxCtrl);

function FluxCtrl($http, UrlProvider, ModalService) {
    this._http = $http;
    this.UrlProvider = UrlProvider;
    this.ModalService = ModalService;

    this.currentModel = 'iJO1366';
    this.data = {};
    this.loading = true;

    $http.get(UrlProvider.baseUrl + '/model/retrieve/' + this.currentModel).then(function(res) {
        console.log(data);
        // startConsortiaFlux(res.data);
    }, function(err) {
        console.log(err);
    });
}

FluxCtrl.$inject = ['$http', 'UrlProvider', 'ModalService'];

FluxCtrl.prototype.startConsortiaFlux = function(data) {
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

FluxCtrl.prototype.addSpecie = function() {
    this.onModal = function(modal) {
        modal.close.then(this.onModalClose.bind(this));
    };

    this.onModalClose = function(result) {
        this.currentModel = result;
    };

    this.ModalService.showModal({
        templateUrl: "app/modals/addspecie/addspecie.html",
        controller: "AddSpecieModal"
    }).then(this.onModal.bind(this));
};

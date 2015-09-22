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

    //this.startConsortiaFlux(data);
    this.loadNStartModel();
}

FluxCtrl.$inject = ['$http', 'UrlProvider', 'ModalService'];


//retrieve UNOPTIMIZED data
FluxCtrl.prototype.loadNStartModel = function() {
    this.receiver = function(res) {
        // console.log(data);
        if(this.ConsortiaFluxTool !== undefined){
            this.ConsortiaFluxTool = true
            this.ConsortiaFluxTool.changeSpecie(res.data);
        }
        else{
            res.data.everything = true
            this.startConsortiaFlux(res.data);
        }


    };

    this.errorCatch = function(err) {
        console.log(err);
    };

    var requestUrl = this.UrlProvider.baseUrl + '/model/retrieve/' + this.currentModel;
    this._http.get(requestUrl).then(this.receiver.bind(this), this.errorCatch.bind(this));

};

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
        everything: data.everything,
        hideObjective: true,
        data: data,
        sortables: sortables,
        showStats: false
    };

    this.ConsortiaFluxTool = new ConsortiaFluxVisualization(networkAttributes);
};

// TODO addSpecie -> addModel, or seperate communities models and specie models
FluxCtrl.prototype.addSpecie = function() {
    this.onModal = function(modal) {
        modal.close.then(this.onModalClose.bind(this));
    };
    //Change species
    this.onModalClose = function(result) {
        this.currentModel = result;

        if (this.currentModel === 'community') {
            this.receiver = function(res) {
                console.log(res.data);

                if(this.ConsortiaFluxTool !== undefined){
                    this.ConsortiaFluxTool.attr.everything = true;
                    this.ConsortiaFluxTool.changeSpecie(res.data);
                }
                else {
                    this.startConsortiaFlux(res.data);
                }
            };

            this.errorCatch = function(err) {
                console.log(err);
            };

            var requestUrl = this.UrlProvider.baseUrl + '/model/retrieve/' + this.currentModel;

            this._http.get(requestUrl).then(this.receiver.bind(this), this.errorCatch.bind(this));

        } else {
            this.loadNStartModel();
        }
    };

    this.ModalService.showModal({
        templateUrl: "app/modals/addspecie/addspecie.html",
        controller: "AddSpecieModal"
    }).then(this.onModal.bind(this));
};

FluxCtrl.prototype.optimize = function() {
    this.receiver = function(res) {
        this.ConsortiaFluxTool.attr.everything = false //sets the default to false
        this.ConsortiaFluxTool.changeSpecie(res.data);
    };

    this.errorCatch = function(err) {
        console.log(err);
    };

    var requestUrl = this.UrlProvider.baseUrl + '/model/optimize/' + this.currentModel;

    this._http.get(requestUrl).then(this.receiver.bind(this), this.errorCatch.bind(this));
};

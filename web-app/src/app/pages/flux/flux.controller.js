/* global window */
/* global console */
/* global ConsortiaFluxVisualization */
/* global UrlProvider */
/* global data */
/* global FluxCtrl */
/* global ModalService */
'use strict';

angular.module('ConsortiaFlux').controller('FluxCtrl', FluxCtrl);

function FluxCtrl($http, UrlProvider, ModalService, ModelRetriever) {
    this._http = $http;
    this.UrlProvider = UrlProvider;
    this.ModalService = ModalService;

    this.community = {
        models: ['iJO1366']
    };
    this.currentModel = this.community.models[0];
    this.data = {};
    this.loading = true;

    this.MR = ModelRetriever;
    this.MR.modelId = 'iJO1366';
    this.MR.getOptimized(function(model) {
        console.log(model);
    });

    //this.startConsortiaFlux(data);
    this.loadNStartModel();
}

FluxCtrl.$inject = ['$http', 'UrlProvider', 'ModalService', 'ModelRetriever'];


//retrieve UNOPTIMIZED data
FluxCtrl.prototype.loadNStartModel = function() {
    this.receiver = function(res) {
        console.log(data);
        if (this.ConsortiaFluxTool !== undefined) {
            this.ConsortiaFluxTool.attr.everything = true;
            this.ConsortiaFluxTool.changeSpecie(res.data);
        } else {
            res.data.everything = true;
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
    this.receiver = function(res) {
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
            data: res.data,
            sortables: sortables,
            showStats: false
        };

        this.ConsortiaFluxTool = new ConsortiaFluxVisualization(networkAttributes);
    };

    this.errorCatch = function(err) {
        console.log(err);
    };

    var requestUrl = this.UrlProvider.baseUrl + '/' + data.file;
    this._http.get(requestUrl).then(this.receiver.bind(this), this.errorCatch.bind(this));
};

// TODO addSpecie -> addModel, or seperate communities models and specie models
FluxCtrl.prototype.addSpecie = function() {
    this.onModal = function(modal) {
        modal.close.then(this.onModalClose.bind(this));
    };
    //Change species
    this.onModalClose = function(result) {
        if (!result)
            return;

        if (result.models.length === 0)
            return;

        if (result.models.length === 1) {
            this.currentModel = result.models[0];

            if (this.currentModel === 'community') {
                this.receiver = function(res) {
                    console.log(res.data);
                    if (this.ConsortiaFluxTool !== undefined) {
                        this.ConsortiaFluxTool.attr.everything = true;
                        this.ConsortiaFluxTool.changeSpecie(res.data);
                    } else {
                        console.log(res.data);
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
        } else {
            // Create community
            this.receiver = function(res) {
                console.log('community created');
                console.log(res);
            };

            this.errorCatch = function(err) {
                console.log(err);
            };

            var requestUrl = this.UrlProvider.baseUrl + '/community/create';

            this._http.post(requestUrl, result).then(this.receiver.bind(this), this.errorCatch.bind(this));
        }
    };

    this.ModalService.showModal({
        templateUrl: "app/modals/addspecie/addspecie.html",
        controller: "AddSpecieModal"
    }).then(this.onModal.bind(this));
};

FluxCtrl.prototype.optimize = function() {
    if (this.currentModel === 'E.-Coli-K12-and-M.-barkeri') {
        this.receiver = function(res) {
            this.receiver = function(res) {
                console.log(res.data);
                this.ConsortiaFluxTool.attr.everything = false; //sets the default to false
                this.ConsortiaFluxTool.changeSpecie(res.data);
            };

            this.errorCatch = function(err) {
                console.log(err);
            };

            requestUrl = this.UrlProvider.baseUrl + '/' + res.data;

            this._http.get(requestUrl).then(this.receiver.bind(this), this.errorCatch.bind(this));
        };

        this.errorCatch = function(err) {
            console.log(err);
        };

        var requestUrl = this.UrlProvider.baseUrl + '/community/optimize/' + this.currentModel;

        this._http.get(requestUrl).then(this.receiver.bind(this), this.errorCatch.bind(this));
    } else {
        this.receiver = function(res) {
            this.receiver = function(res) {
                console.log(res.data);
                this.ConsortiaFluxTool.attr.everything = false; //sets the default to false
                this.ConsortiaFluxTool.changeSpecie(res.data);
            };

            this.errorCatch = function(err) {
                console.log(err);
            };

            requestUrl = this.UrlProvider.baseUrl + '/' + res.data.optimized;

            this._http.get(requestUrl).then(this.receiver.bind(this), this.errorCatch.bind(this));
        };

        this.errorCatch = function(err) {
            console.log(err);
        };

        var requestUrl = this.UrlProvider.baseUrl + '/model/optimize/' + this.currentModel;

        this._http.get(requestUrl).then(this.receiver.bind(this), this.errorCatch.bind(this));
    }
};

FluxCtrl.prototype.addReaction = function() {
    this.onModal = function(modal) {
        modal.close.then(this.onModalClose.bind(this));
    };

    this.onModalClose = function(result) {
        this.ConsortiaFluxTool.addReaction(result);
    };
    this.ModalService.showModal({
        templateUrl: "app/modals/addreaction/addreaction.html",
        controller: "AddReactionModal",
        inputs: {
            ConsortiaFluxTool: this.ConsortiaFluxTool
        }
    }).then(this.onModal.bind(this));
};

/* global window */
/* global console */
/* global ConsortiaFluxVisualization */
/* global UrlProvider */
/* global data */
/* global FluxCtrl */
/* global ModalService */
'use strict';

angular.module('ConsortiaFlux').controller('FluxCtrl', FluxCtrl);

function FluxCtrl($http, UrlProvider, ModalService, ModelRetriever, CommunityCreator) {
    this._http = $http;
    this.UrlProvider = UrlProvider;
    this.ModalService = ModalService;
    this.MR = ModelRetriever;
    this.CC = CommunityCreator;


    this.community = {
        models: ['iJO1366']
    };
    this.currentModel = this.community.models[0];
    this.data = {};
    this.loading = true;


    this.MR.modelId = 'iJO1366';
    this.MR.getBase((function(model) {
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
            everything: true,
            hideObjective: true,
            data: model,
            sortables: sortables,
            showStats: false
        };

        this.ConsortiaFluxTool = new ConsortiaFluxVisualization(networkAttributes);
    }).bind(this));
}

FluxCtrl.$inject = ['$http', 'UrlProvider', 'ModalService', 'ModelRetriever', 'CommunityCreator'];


FluxCtrl.prototype.addSpecie = function() {
    this.ModalService.showModal({
        templateUrl: "app/modals/addspecie/addspecie.html",
        controller: "AddSpecieModal"
    }).then((function(modal) {
        modal.close.then((function(community) {
            if (!community || community.models.length === 0)
                return;

            if (community.models.length === 1) {
                this.MR.modelId = community.models[0];
                this.MR.getBase((function(model) {
                    this.ConsortiaFluxTool.attr.everything = true;
                    this.ConsortiaFluxTool.changeSpecie(model);
                }).bind(this));
            } else {
                this.CC.create(community, (function(community) {
                    console.log(community);
                    // this.MR.modelId = community.id;
                    // this.MR.getBase((function(community) {
                    this.ConsortiaFluxTool.attr.everything = true;
                    this.ConsortiaFluxTool.changeSpecie(community);
                    // }).bind(this));
                }).bind(this));
            }
        }).bind(this));
    }).bind(this));
};

FluxCtrl.prototype.optimize = function() {
    this.MR.getOptimized((function(model) {
        this.ConsortiaFluxTool.attr.everything = false;
        this.ConsortiaFluxTool.changeSpecie(model);
    }).bind(this));
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

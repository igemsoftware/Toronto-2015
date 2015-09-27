/* global console */
'use strict';

angular.module('ConsortiaFlux')

.controller('AddReactionModal', ['$scope', '$http', 'UrlProvider', 'ConsortiaFluxTool', 'close',

    function($scope, $http, UrlProvider, ConsortiaFluxTool, close) {
        var model = ConsortiaFluxTool.models[0];

        $scope.modifiedData = {
            addedReactions: [],
            addedMetabolites: [],
            deletedReactions: [],
            //dw
            // id: model,
            // updatedMetabolites: []
        };
        $scope.display = true;

        $scope.reversible = "false";

        $scope.name = "Sink needed to allow p-Cresol to leave system";
        $scope.id = "DM_4CRSOL";
        $scope.EC_Number = 0;
        $scope.upper_bound = 1000;
        $scope.lower_bound = -1000;
        $scope.objective_coefficient = 0;
        $scope.newMetaboliteDisplay = false;
        $scope.registryfound = false;
        $scope.count = 0;
        $scope.reactions = ConsortiaFluxTool.root.system.parsedData[model].reactions;
        $scope.allMetabolites = ConsortiaFluxTool.root.system.parsedData[model].metabolites;

        $scope.queryRegistry = function() {
            this.receiver = function(res) {
                if (res.data.length === 0) {
                    $scope.gene_association = "Not a valid registry";
                } else {
                    $scope.registry = res.data;
                    console.log($scope.registry);
                    $scope.registryfound = true;
                }
            };

            this.errorCatch = function(err) {
                console.log(err);
            };
            var requestUrl = UrlProvider.baseUrl + '/model/retrieve/bba/' + $scope.gene_association;
            $http.post(requestUrl).then(this.receiver.bind(this), this.errorCatch.bind(this));
        };

        $scope.addReaction = function() {
            $scope.modifiedData.addedReactions.push({
                name: '',
                EC_Number: '',
                upper_bound: '',
                lower_bound: '',
                objective_coefficient_coefficient: '',
                reversibility: null,
                metabolites: [{
                    name: '',
                    coefficient: ''
                }]
            });
        };

        $scope.addMetabolite = function() {
            $scope.modifiedData.addedMetabolites.push({
                name: '',
                compartment: ''
            });
        };

        $scope.addDeletableableReaction = function() {
            $scope.modifiedData.deletedReactions.push({
                name: ''
            });
        };

        $scope.addMetaboliteToReaction = function(reaction) {
            reaction.metabolites.push({
                name: '',
                coefficient: ''
            });
        };

        $scope.close = function(result) {
            $scope.display = false;
            close(null);
        };

        $scope.makeMetaboliteAvailable = function(metabolite) {
            var newMetabolite = {
                "name": metabolite.name,
                "id": "new-m-" + metabolite.compartment + '-' + ConsortiaFluxTool.metaboliteLength,
                "compartment": metabolite.compartment,
                "species": [
                    model
                ]
            };
            ConsortiaFluxTool.metaboliteLength++;
            // $scope.modifiedData.addedMetabolites.push(newMetabolite);
            $scope.allMetabolites.push(newMetabolite);
        };

        $scope.apply = function(result) {
            var tempReactions = [];
            $scope.modifiedData.addedReactions.forEach(function(reaction) {
                var r = {};
                r.name = reaction.name;
                r['EC_Number'] = reaction['EC_Number'];
                r.upper_bound = Number(reaction.upper_bound);
                r.lower_bound = Number(reaction.lower_bound);
                r.objective_coefficient = Number(reaction.objective_coefficient);
                r.reversible = reaction.reversible;
                r.gene_association = reaction.gene_assocation;
                r.metabolites = reaction.metabolites;

                tempReactions.push(r);
            });

            $scope.modifiedData.addedReactions = tempReactions;


            var tempMetabs = [];
            $scope.modifiedData.addedMetabolites.forEach(function(metabolite) {
                var newMetabolite = {
                    "name": metabolite.name,
                    "id": "new-m-" + ConsortiaFluxTool.metaboliteLength + '-' + metabolite.compartment,
                    "compartment": metabolite.compartment,
                    "species": [
                        model
                    ]
                };
                tempMetabs.push(newMetabolite);
            });

            $scope.modifiedData.addedMetabolites = tempMetabs;

            var tempDeletables = [];
            $scope.modifiedData.deletedReactions.forEach(function(reaction) {
                tempDeletables.push(reaction.name);
            });

            $scope.modifiedData.deletedReactions = tempDeletables;

            console.log($scope.modifiedData);
            var url = UrlProvider.baseUrl + '/model/update/' + model;
            $http.post(url, $scope.modifiedData).then(function(res) {
                console.log(res.data);
            }, function(err) {
                console.log(err);
            });
        };

        // var ReactionSchema = {
        //     "EC_Number": 'String',
        //     "upper_bound": 'Number',
        //     "objective_coefficient": 'Number',
        //     "metabolites": {
        //         "4crsol_c": -1
        //     },
        //     "reversible": "false",
        //     "outside": null,
        //     "lower_bound": 0,
        //     "species": [
        //         "iJO1366"
        //     ],
        //     "subsystem": "",
        //     "id": "DM_4CRSOL",
        //     "gene association": "",
        //     "name": "Sink needed to allow p-Cresol to leave system",
        // }
    }

]);

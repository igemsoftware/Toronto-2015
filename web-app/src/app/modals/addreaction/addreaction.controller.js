/* global console */
'use strict';

angular.module('ConsortiaFlux')

.controller('AddReactionModal', ['$scope', '$http', 'UrlProvider', 'ConsortiaFluxTool', 'close',

    function($scope, $http, UrlProvider, ConsortiaFluxTool, close) {

        var modifiedData = {
            addedReactions: new Array(),
            addedMetabolites: new Array(),
            deletedReactions: new Array()
        }
        $scope.display = true;
        $scope.specieSelected = false;


        var species = new Array()

        for (var i = 0; i < ConsortiaFluxTool.species.length; i++) {
            species.push(ConsortiaFluxTool.species[i])
        }
        $scope.reversible = "false";

        $scope.species = species;

        $scope.name = "Sink needed to allow p-Cresol to leave system";
        $scope.id = "DM_4CRSOL";
        $scope.EC_Number = 0;
        $scope.upper_bound = 1000;
        $scope.lower_bound = -1000;
        $scope.objective_coefficient = 0;
        $scope.newMetaboliteDisplay = false
        $scope.registryfound = false;
        $scope.count = 0;

        $scope.selectSpecie = function(){
            $scope.specieSelected = true;
            $scope.reactions = ConsortiaFluxTool.root.system.parsedData[$scope.species].reactions
            $scope.metabolites = ConsortiaFluxTool.root.system.parsedData[$scope.species].metabolites
        }
        $scope.queryRegistry = function() {
            this.receiver = function(res) {
                if (res.data.length === 0) {
                    $scope.gene_association = "Not a valid registry";
                } else {
                    $scope.registry = res.data;
                    $scope.registryfound = true;
                }
            }

            this.errorCatch = function(err) {
                console.log(err);
            }
            var requestUrl = UrlProvider.baseUrl + '/model/retrieve/bba/' + $scope.gene_association;
            $http.post(requestUrl).then(this.receiver.bind(this), this.errorCatch.bind(this));
        }
        $scope.showCreateNewMetabolite = function(){
            $scope.newMetaboliteDisplay = true;
        }
        $scope.createNewMetabolite = function() {
            $scope.newMetaboliteDisplay = true;
            var newMetabolite = {
                "name": $scope.metabName,
                "id": "new-m-" + ConsortiaFluxTool.metaboliteLength,
                "compartment": $scope.compartment,
                "species": [
                    $scope.specie
                ]
            }
            ConsortiaFluxTool.metaboliteLength++
            modifiedData.addedMetabolites.push(newMetabolite);
            console.log(modifiedData)


        }
        $scope.deleteReaction = function(){
            modifiedData.deletedReactions.push($scope.selectedReaction.id);
            console.log($scope.selectedReaction)
            console.log(modifiedData)
        }
        $scope.addReaction = function() {
            var reaction = {
                    "EC_Number": $scope.EC_Number || "", //Optional
                    "upper_bound": Number($scope.upper_bound), //optional, default 1000
                    "objective_coefficient": Number($scope.objective_coefficient), //default 0
                    "reversible": JSON.parse($scope.reversible), //defult false
                    "outside": null,
                    "lower_bound": Number($scope.lower_bound), //default -1000
                    "subsystem": $scope.subsystem || "", //default ""
                    "id": "new-r-" + ConsortiaFluxTool.reactionLength,
                    "gene association": $scope.bba || "", //not necceasry
                    "name": $scope.name, //ob.
                    "species": [
                        $scope.specie
                    ],
                    "metabolites": {

                    }
                }
                //change in angular
            reaction.metabolites[$scope.myMetab.id] = Number($scope.metabolite_cofficient)
            modifiedData.addedReactions.push(reaction)
            console.log(modifiedData);
        }

        $scope.close = function(result) {
            $scope.display = false;
            this.receiver = function(res) {
                console.log(res)
            }

            this.errorCatch = function(err) {
                console.log(err);
            }
            var requestUrl = UrlProvider.baseUrl + '/model/update/' + $scope.specie;
            $http.post(requestUrl, modifiedData).then(this.receiver.bind(this), this.errorCatch.bind(this));

            close(modifiedData);
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

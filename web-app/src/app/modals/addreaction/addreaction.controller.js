/* global console */
'use strict';

angular.module('ConsortiaFlux')

.controller('AddReactionModal', ['$scope', '$http', 'UrlProvider', 'ConsortiaFluxTool', 'close',

    function($scope, $http, UrlProvider, ConsortiaFluxTool, close) {
        $scope.display = true;
        var metabolites = new Array()
        var newMetabolites = new Array()
        var metabDict = ConsortiaFluxTool.currentLevel.system.metabolites
        var m = Object.keys(ConsortiaFluxTool.currentLevel.system.metabolites)
        for(var i = 0; i < m.length; i++){
            metabolites.push(metabDict[m[i]]);
        }

        var species = new Array()

        for(var specie in ConsortiaFluxTool.species){
            species.push(specie)
        }
        $scope.metabolites = metabolites;
        $scope.reversible = "false";

        $scope.species = species;
        $scope.name = "Sink needed to allow p-Cresol to leave system";
        $scope.id = "DM_4CRSOL";
        $scope.EC_Number = 0;
        $scope.upper_bound = 1000;
        $scope.lower_bound = -1000;
        $scope.objective_coefficient = 0;
        $scope.newMetaboliteDisplay = false

        $scope.count = 0;
        $scope.createNewMetabolite = function(){
            newMetaboliteDisplay = true

            var newMetabolite = {
                "name": $scope.metabName,
                "id": "new-m-" + ConsortiaFluxTool.metaboliteLength,
                "compartment": $scope.compartment,
                "species": [
                    $scope.metabSpecie
                ]
            }
            ConsortiaFluxTool.metaboliteLength++
            newMetabolites.push(newMetabolite)

            //open addReaction.html
            //             {
            // "name": "Zinc", #yes
            // "notes": {}, #no
            // "annotation": {}, #No
            // "_constraint_sense": "E", #no
            // "charge": 2, #no
            // "_bound": 0, #no
            // "formula": "Zn", #no
            // "compartment": "p", #yes
            // "id": "zn2_p", #autogeneratored
            // "subsystems": [ #naw
            // "Inorganic Ion Transport and Metabolism",
            // "Transport, Outer Membrane Porin"
            // ],
            // #yes
            // "species": [
            // "iJO1366"
            // ]
            // }
        }

        $scope.addExistingMetabolite = function(){

        }

        $scope.close = function(result) {
            $scope.display = false;
            // if(typeof($scope.upper_bound) !== 'number' ||
            //     typeof($scope.objective_coefficient) !== 'number' ||
            //assumes one metabolite atm
            //TODO LOW PRIORITY make check for specie for metabolite voided for e

            var reaction = {
                "EC_Number": Number($scope.EC_Number), //Optional
                "upper_bound": Number($scope.upper_bound), //optional, default 1000
                "objective_coefficient": Number($scope.objective_coefficient), //default 0
                "reversible": JSON.parse($scope.reversible), //defult false
                "outside": null,
                "lower_bound": Number($scope.lower_bound), //default -1000
                "subsystem": $scope.subsystem || "", //default ""
                "id":  "new-r-" + ConsortiaFluxTool.reactionLength,
                "gene association": $scope.gene_association || "", //not necceasry
                "name": $scope.name, //ob.
                "species": [
                    $scope.specie
                ],
                "metabolites": {

                }
            }
            //change in angular
            reaction.metabolites[$scope.myMetab.id] = Number(metabolite_cofficient)
            close(reaction);
        };

        var ReactionSchema = {
            "EC_Number": 'String',
            "upper_bound": 'Number',
            "objective_coefficient": 'Number',
            "metabolites": {
                "4crsol_c": -1
            },
            "reversible": "false",
            "outside": null,
            "lower_bound": 0,
            "species": [
                "iJO1366"
            ],
            "subsystem": "",
            "id": "DM_4CRSOL",
            "gene association": "",
            "name": "Sink needed to allow p-Cresol to leave system",
        }
    }

]);

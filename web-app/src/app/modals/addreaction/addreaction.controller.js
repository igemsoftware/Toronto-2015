/* global console */
'use strict';

angular.module('ConsortiaFlux')

.controller('AddReactionModal', ['$scope', '$http', 'UrlProvider', 'ConsortiaFluxTool', 'close',

    function($scope, $http, UrlProvider, ConsortiaFluxTool, close) {
        $scope.display = true;
        var metabolites = new Array()
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
        $scope.outside = "null";
        $scope.species = species;
        $scope.name = "Sink needed to allow p-Cresol to leave system";
        $scope.id = "DM_4CRSOL";
        $scope.EC_Number = 0;
        $scope.upper_bound = 1000;
        $scope.lower_bound = 0;
        $scope.objective_coefficient = 0;

        $scope.count = 0;


        $scope.addMetabolite = function(){

        }

        $scope.close = function(result) {
            $scope.display = false;
            // if(typeof($scope.upper_bound) !== 'number' ||
            //     typeof($scope.objective_coefficient) !== 'number' ||
            //assumes one metabolite atm
            //TODO LOW PRIORITY make check for specie for metabolite voided for e

            var reaction = {
                "EC_Number": $scope.EC_Number || "",
                "upper_bound": Number($scope.upper_bound),
                "objective_coefficient": Number($scope.objective_coefficient),
                "reversible": JSON.parse($scope.reversible),
                "outside": JSON.parse($scope.outside),
                "lower_bound": Number($scope.lower_bound),
                "subsystem": $scope.subsystem,
                "id": $scope.subsystem,
                "gene association": $scope.gene_association,
                "name": $scope.name,
                "species": [
                    $scope.specie
                ],
                "metabolites": {}
            }
            console.log($scope.species)
            reaction.metabolites[$scope.myMetab.id] = Number($scope.metabolite_cofficient)
            console.log(reaction);
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

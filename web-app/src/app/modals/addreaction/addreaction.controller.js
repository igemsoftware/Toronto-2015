/* global console */
'use strict';

angular.module('ConsortiaFlux')

.controller('AddReactionModal', ['$scope', '$http', 'UrlProvider', 'ConsortiaFluxTool', 'close',

    function($scope, $http, UrlProvider, ConsortiaFluxTool, close) {
        $scope.display = true;
        var metabolites = new Array()
        var nodes = ConsortiaFluxTool.currentLevel.system.nodes
        for(var i = 0; i < nodes.length; i++){
            if(nodes[i].type === "m"){
                metabolites.push(nodes[i])
            }
        }
        var species = new Array()

        for(var specie in ConsortiaFluxTool.species){
            species.push(specie)
        }
        $scope.metabolites = metabolites
        $scope.reversible = "false"
        $scope.outside = "null"
        $scope.species = species

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
                "objective_coefficient": $scope.objective_coefficient,
                "reversible": JSON.parse($scope.reversible),
                "outside": JSON.parse($scope.outside),
                "lower_bound": Number($scope.lower_bound),
                "subsystem": $scope.subsystem,
                "id": $scope.subsystem,
                "gene association": $scope.gene_association,
                "name": $scope.name,
                "species": [
                    $scope.species
                ],
                "metabolites": {}
            }
            reaction.metabolites[$scope.myMetab.id] = $scope.metabolite_cofficient

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

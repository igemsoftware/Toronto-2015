'use strict';

angular.module('fbaApp')

.controller('NetworkCtrl', ['$scope', '$http', function($scope, $http) {

    var dataRequest = $http.get('http://45.55.193.224/toydata.json');


    dataRequest.success(function(data) {
        var data = data.data;
        var flatUIColors = [ '#1abc9c', '#16a085', '#2ecc71', '#27ae60', '#3498db', '#2980b9', '#9b59b6', '#8e44ad', '#34495e', '#2c3e50', '#f1c40f', '#f39c12', '#e67e22', '#d35400', '#e74c3c', '#c0392b', '#ecf0f1', '#bdc3c7', '#95a5a6', '#7f8c8d'];
        
        var getColour = function() {
            return flatUIColors[math.rand()*flatUIColors.length];
        }

        var nodes = [
            {id: "a", name: "A", selflink: false},
            {id: "b", name: "B", selflink: true},
            {id: "c", name: "C", selflink: false},
            {id: "d", name: "D", selflink: false},
            {id: "e", name: "E", selflink: false}
        ];

        console.log(data);

        var w = $('#network').width();
        var h = $('#network').height();

        var svg = d3.select('#network').append('svg').attr('width', w).attr('height', h);

        var force = d3.layout.force()
            .size([w, h])
            .nodes(nodes)
            .charge(-100)
            .start();

        var node = svg.selectAll('.node')
            .data(nodes)
            .enter().append('circle')
            .attr('class', 'node')
            .attr('r', 20)
            .style('fill', 'red')
            .call(force.drag);

        force.on('tick', function() {
            node.attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; })
        })

        
        

    }).error(function(err) {
        alert(err);
    })
 
}]);

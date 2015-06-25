var Network = (function() {
    // The instance
    var inst = null;
    
    function Network() {
        this.traits = {
            view  : '',
            w     : null,
            h     : null,
            svg   : null,
            node  : null,
            force : null,
            nodes : null 
        } 
    }


    function getInstance(divName, nodesData) {
        if (!inst) {
            inst = new Network();
            inst.traits.view = divName;
            inst.traits.w = $(inst.traits.view).width();
            inst.traits.h = $(inst.traits.view).height();
            inst.traits.nodes = nodesData; 
        }

        return inst;
    }

    function createSvg() {
        inst.traits.svg = d3
            .select(inst.traits.view)
            .append('svg')
            .attr('width', inst.traits.w)
            .attr('height', inst.traits.h);

        inst.traits.force = d3.layout.force()
             .size([inst.traits.w, inst.traits.h])
             .nodes(inst.traits.nodes)
             .charge(-100)
             .start();

        inst.traits.node = inst.traits.svg.selectAll('.node')
             .data(inst.traits.nodes)
             .enter().append('circle')
             .attr('class', 'node')
             .attr('r', 20)
             .style('fill', 'red')
             .call(inst.traits.force.drag);

        inst.traits.force.on('tick', function() {
             inst.traits.node
                .attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; })
        })
    }


    return {
        getInstance: function(divName, nodesData) {
            getInstance(divName, nodesData);
            createSvg();
        }
    };
})();

/* global d3 */
/* global Metabolite */
/* global Reaction */
/* global Link */
/* global palette */
/* global document */
/* global console */
'use strict';

var System = function(attributes, system) {

    var _private = {
        canvas           : null,
        nodes            : null, // tbr
        links            : null, // tbr
        force            : null,
        system           : null,
        attributes       : attributes,
        linkSet          : [], // link data
        nodesSet         : [], // node data
        metaboliteRadius : 5,
        cameraWidth      : 0,
        cameraHeight     : 0,
        cameraX          : 0,
        cameraY          : 0,
        scale            : 1
    };

    // Initalize Pathway
    init(system);

    function init(system) {
        console.log('Initializing System');

        // Assign selection to _private variables
        _private.network      = d3.select('canvas');
        _private.canvas       = d3.select('canvas').node().getContext('2d');
        _private.canvasWidth  = _private.cameraWidth  = _private.attributes.canvas.width;
        _private.canvasHeight = _private.cameraHeight = _private.attributes.canvas.height;

        // Build metabolites
        buildMetabolites(system);

        // Create reaction objects
        buildReactions(system);

        // Force layout
        _private.force = d3.layout.force()
            .nodes(_private.nodesSet)
            .links(_private.linkSet)
            .charge(-500)
            .linkStrength(2)
            .linkDistance(50)
            // variablize w/ cameraWidth,H
            .size([_private.canvasWidth, _private.canvasHeight])
            .start()
            .on('tick', update);
    }

    _private.canvas.canvas.onmousewheel = function(event) {
        // Prevent normal scroll effect
        event.preventDefault();

        var mousex = event.clientX - _private.canvas.canvas.offsetLeft;
        var mousey = event.clientY - _private.canvas.canvas.offsetTop;
        var wheel = event.wheelDelta / 120; //n or -n
        var zoom = 1 + wheel / 2;

        _private.canvas.translate(
            _private.cameraX,
            _private.cameraY
        );

        var xOffset = mousex / _private.scale + _private.cameraX - mousex / (_private.scale * zoom);
        var yOffset = mousey / _private.scale + _private.cameraY - mousey / (_private.scale * zoom);

        _private.canvas.scale(zoom, zoom);
        xform = xform.scaleNonUniform(zoom,zoom);
        _private.scale *= zoom;
        _private.canvas.translate(-xOffset, -yOffset);

        _private.cameraX = (xOffset);
        _private.cameraY = (yOffset);
        _private.cameraWidth = _private.canvasWidth * 1 / _private.scale;
        _private.cameraHeight = _private.canvasHeight * 1 / _private.scale;

        _private.force.resume();
    };

    // ## Dragging
    var dragStart, lastX, lastY;
    var dragScaleFactor = 1.5;
    var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    var xform = svg.createSVGMatrix(); 
    function transformedPoint(x,y) {
        var pt = svg.createSVGPoint();
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(xform.inverse());
    }

    _private.canvas.canvas.onmousedown = function(event) {
        lastX = event.clientX - _private.canvas.canvas.offsetLeft;
        lastY = event.clientY - _private.canvas.canvas.offsetTop;
        dragStart = transformedPoint(lastX, lastY);
    };
    _private.canvas.canvas.onmousemove = function(event) {
        lastX = event.clientX - _private.canvas.canvas.offsetLeft;
        lastY = event.clientY - _private.canvas.canvas.offsetTop;

        if (dragStart) {
            var tPt = transformedPoint(lastX, lastY);
            var dX = (tPt.x - dragStart.x) * dragScaleFactor;
            var dY = (tPt.y - dragStart.y) * dragScaleFactor;
            xform = xform.translate(dX, dY);
            _private.canvas.translate(dX, dY);
            _private.cameraX -= dX;
            _private.cameraY -= dY;
            update();
        }    
    };
    _private.canvas.canvas.onmouseup = function(event) {
        dragStart = false;
    }; 

    /**
     * Loop and bind metabolite data to metabolite node to nodeset.
     *
     * @param system object The json metabolic model. 
     *
     * @return none
     */
    function buildMetabolites(system) {
        console.log('Building metabolites');
        for (var i = 0; i < system.metabolites.length; i++) {
            _private.nodesSet.push(new Metabolite({
                name: system.metabolites[i].name,
                id: system.metabolites[i].id,
                type: 'm',
                radius: _private.metaboliteRadius
            }));
        }
    }

    /**
     * Find largest flux value and scale radius of reaction nodes accordingly.
     *
     * @param system object The json metabolic model.
     *
     * @return d3.scale.linear()
     */
    function scale_radius(system, minRadius, maxRadius) {
        var flux_array = [];
        for (var i = 0; i < system.reactions.length; i++) {
            flux_array.push(system.reactions[i].flux_value);
        }

        var largest = Math.max.apply(Math, flux_array);
        var r = d3.scale.linear()
            .domain([0, largest])
            .range([minRadius, maxRadius]);

        return r;
    }

    /**
     * Loop and bind reaction data to reaction nodes
     *
     * @param system object The json metabolic model.
     *
     * @return none
     */
    function buildReactions(system) {
        console.log('Building reactions');

        var source, target;
        var tempLinks = [];
        var radiusScale = scale_radius(system, 5, 15);
        system.reactions.forEach(function(reaction) {
            if (reaction.flux_value > 0) {
                _private.nodesSet.push(new Reaction({
                    name: reaction.name,
                    id: reaction.id,
                    type: 'r',
                    radius: radiusScale(reaction.flux_value),
                    fluxValue: reaction.flux_value
                }));

                // Assign metabolite source and target for each reaction
                var metabolites = Object.keys(reaction.metabolites);
                metabolites.forEach(function(m) {
                    if (reaction.metabolites[m] > 0) {
                        source = reaction.id;
                        target = m;
                    } else {
                        source = m;
                        target = reaction.id;
                    }

                    tempLinks.push({
                        id: source + '-' + target,
                        source: source,
                        target: target
                    });
                });
            }
        });

        var nodesMap = nodeMap(_private.nodesSet);

        tempLinks.forEach(function(link) {
            // Inefficient, but will do for now
            source = _private.nodesSet[nodesMap[link.source]];
            target = _private.nodesSet[nodesMap[link.target]];

            _private.linkSet.push(new Link(
                source.getID() + '-' + target.getID(),
                source,
                target
            ));
        });
    }

    //utilities function
    function nodeMap(nodesSet) {
        var ret = {};
        for (var j = 0; j < nodesSet.length; j++) {
            ret[nodesSet[j].getID()] = j;
        }
        return ret;
    }

    function update() {
        //refresh
        _private.canvas.clearRect(_private.cameraX, _private.cameraY, _private.cameraWidth, _private.cameraHeight);

        // Draw links
        _private.linkSet.forEach(function(d) {
            d.linkX1 = d.source.x;
            d.linkY1 = d.source.y;
            d.linkX2 = d.target.x;
            d.linkY2 = d.target.y;
            d.draw();
        });

        // Draw nodes
        _private.nodesSet.forEach(function(d) {
            d.nodeX = d.x;
            d.nodeY = d.y;
            d.draw();
        });
    }
};

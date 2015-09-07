System = require "./System"
Subsystem = require "./Subsystem"


systemAttributes =
    width            : window.innerWidth
    height           : window.innerHeight
    backgroundColour : "white"
    metaboliteRadius : 10
    useStatic        : false
    everything       : false
    hideObjective    : true

#system = new System(systemAttributes, data)

network = new System(systemAttributes, data)

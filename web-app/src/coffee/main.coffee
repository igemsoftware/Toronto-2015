System = require "./System"
Network = require "./Network"

systemAttributes =
    width            : window.innerWidth
    height           : window.innerHeight
    backgroundColour : "white"
    metaboliteRadius : 10
    useStatic        : false
    everything       : false
    hideObjective    : true

#system = new System(systemAttributes, data)

network = new Network(systemAttributes, networkData)

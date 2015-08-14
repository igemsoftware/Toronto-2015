System = require "./System"

systemAttributes =
    width            : window.innerWidth
    height           : window.innerHeight
    backgroundColour : "white"
    metaboliteRadius : 10
    useStatic        : true
    everything       : false
    hideObjective    : true

system = new System(systemAttributes)

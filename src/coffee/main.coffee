System = require "./System"

systemAttributes =
    width            : window.innerWidth
    height           : window.innerHeight
    backgroundColour : "white"
    metaboliteRadius : 10
    useStatic        : false
    everything       : false
    hideObjective    : false

system = new System(systemAttributes)

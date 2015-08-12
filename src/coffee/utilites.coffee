# Quick and easy random integers from [0,range]
rand = (range) ->
    return Math.floor(Math.random() * (range + 1))

module.exports =
    rand: rand

var request = require('request'),
    cheerio = require('cheerio');

var SEARCH_URL = 'http://parts.igem.org/wiki/index.php?title=Special:Search&ns0=1&redirs=0&search='
var SUFFIX_URL = '&limit=500&offset=0'

function queryRegistry(keyword, cb) {
    request({
        url: SEARCH_URL + keyword + SUFFIX_URL
    }, function(err, res, body) {
        if (!err && res.statusCode === 200) {
            $ = cheerio.load(body)
            // Now we basically have core jQuery through cheerio

            // Experiment with inspect element and console logging
            links = $('li')

            //Will obviously be an object in good version
            data = new Array()
            Object.keys(links).forEach(function(key) {

                // for (var i = 0; i< links[key].children.length; i++){
                //     if href
                // }
                // if (links[key] && links[key].children[0] && links[key].children[0].attribs && links[key].children[0].attribs.title)
                //     console.log(links[key].children[0].attribs.title)
                //     data.push(links[key].children[0].attribs.title)
                if (links[key] !== undefined && links[key].children !== undefined && links[key].children[0] !== undefined && links[key].children[0].attribs){
                    s = links[key].children[0].attribs.title
                    index = s.indexOf("BBa")
                    if (index >= 0){
                        s = s.slice(index)
                        splitted = s.split(" ")
                        s = splitted[0] + "_" + splitted[1]

                        if(s.indexOf(":")>=0)
                            s = s.slice(0, s.indexOf(":"))
                        data.push(s)
                    }
                }



                // console.log(links[key].children[0])
                // console.log("--------\n")
                // if (links[key].attribs)
                //     data.push(links[key].attribs.href)
            })


            // Give nicely formatted json to callback
            cb(data);
        } else {
            console.log(err);
            console.log(res.statusCode);
        }
    });
}

// ==== MAIN ====

var keyword = process.argv[2]
queryRegistry(keyword, function(data) {
    console.log(data.length)
})

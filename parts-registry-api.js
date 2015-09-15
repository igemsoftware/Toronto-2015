var request = require('request'),
    cheerio = require('cheerio');

var SEARCH_URL = 'http://parts.igem.org/Special:Search?search='

function queryRegistry(keyword, cb) {
    request({
        url: SEARCH_URL + keyword
    }, function(err, res, body) {
        if (!err && res.statusCode === 200) {
            $ = cheerio.load(body)
            // Now we basically have core jQuery through cheerio

            // Experiment with inspect element and console logging
            links = $('.mw-search-results a')

            // Will obviously be an object in good version
            data = new Array()
            Object.keys(links).forEach(function(key) {
                if (links[key].attribs)
                    data.push(links[key].attribs.href)
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

keyword = process.argv[2]

queryRegistry(keyword, function(data) {
    console.log(data);
})

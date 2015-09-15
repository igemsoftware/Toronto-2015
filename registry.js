var cheerio = require('cheerio')
var request = require('request');

console.log(process.argv[2])

queryRegistry(process.argv[2])

function queryRegistry(keyword, callback) {
    request('http://parts.igem.org/Special:Search?search=' + keyword, function(error, response, body) {
        if (!error && response.statusCode == 200) {
             $ = cheerio.load(body)
            console.log($('.mw-search-results'))
            notes = $('.notes')
            link = $('#partLink').attr('href');


        }
    })
}
// function queryRegistry(keyword, cb) {
//
// request({url: 'http://parts.igem.org/Special:Search?search=' + keyword}, function(err, res, body) {
//       if (!err and res.statusCode === 200) {
//             $ = cheerio.load(body)
//
//       } else {
//             console.log(err);
//             console.log(res.statusCode);
//      }

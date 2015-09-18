var jsondiff = require('jsondiffpatch');
var fs = require('fs');

var original = JSON.parse(fs.readFileSync('iJO1366.json'));
var db = JSON.parse(fs.readFileSync('optimized.json'));

delete db.genes;

var delta = jsondiff.diff(original, db);

fs.writeFileSync('delta.json', JSON.stringify(delta));

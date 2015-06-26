var fs = require('fs');

fs.readFile('modelspecies.csv', 'utf8', function(err, data) {
    var lines = data.split('\r');
    var headers = lines[0].split(',');
    lines = lines.slice(1, lines.length);

    lines.forEach(function(line, index) {
        line = line.split(',');

        var specie = {
            DOMAIN : line[0],
            PHYLUM : line[1],
            CLASS  : line[2],
            ORDER  : line[3],
            FAMILY : line[4],
            GENUS  : line[5],
        };

        for (var j = headers.length - 5; j < headers.length; j++) {
            specie[headers[j].toUpperCase()] = line[j].toLowerCase();
        }
 
        var fileName = './species/specie' + index + '.json';

        fs.writeFile(fileName, JSON.stringify(specie), function(err) {
            if (err) {
                return console.log(err);
            }

            console.log(fileName + ' created');
        });
    });
});

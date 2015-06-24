
exports.send404 = function (response) {
  console.log("Resource not found");

  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.end('Not Found');
}

exports.sendJSON = function (data, response) {
  response.writeHead(200, {'Content-Type': 'application/json'});

  response.end(JSON.stringify(data));
}

exports.send500 = function (data, response) {
  console.log(data.red);
  response.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  response.end(data);
}


var spacer = 8;
var endpointColour = 'green';
var arrowColour = 'yellow';

function strRepeat(s, n) {
    st = '';
    for (var i = 0; i < n; i++) {
        st += s;
    }
    return st;
}

function colorize(method) {
    switch (method) {
        case 'GET'  : return 'blue'; break;
        case 'POST' : return 'magenta'; break;
        case 'MW'   : return 'cyan'; break;
        default     : return 'white';
    }
}

function arrowify(method) {
    switch (method) {
        case 'GET'  : return '→ '; break;
        case 'POST' : return '⇴ '; break;
        case 'PUT'  : return '⇴ '; break;
        case 'MW'   : return '↝ '; break;
        case 'dash' : return '⇢ '; break;
        default     : return '→ ';
    }
}

function routerLogger (r, endpoint) {
    if (r.route) { 
        var method = r.route.stack[0].method.toUpperCase();
        
        var routeLog = '  ' + arrowify(method)[arrowColour]; 
        routeLog += method[colorize(method)] + strRepeat(' ', spacer - method.length) + endpoint[endpointColour];
        if (r.route.path !== '/') {
            routeLog += r.route.path[endpointColour];
        }
        console.log(routeLog);
    } else {
        var middlewareLog = '  ' + arrowify('MW')[arrowColour];
        middlewareLog += 'MW'[colorize('MW')] + strRepeat(' ', spacer - 'MW'.length);
        middlewareLog += endpoint[endpointColour] + '/**/* '[endpointColour] + arrowify('dash')[arrowColour];
        middlewareLog += r.name.cyan;
        console.log(middlewareLog);
    }
}

module.exports = routerLogger;

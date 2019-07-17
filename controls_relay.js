var WebSocketServer = require('websocket').server;
var http = require('http');
 
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

module.exports = {
    start: start
}

function start() {
    server.listen(8080, function() {
        console.log((new Date()) + ' Server is listening on port 8080');
    });
     
    wsServer = new WebSocketServer({
        httpServer: server,
        // You should not use autoAcceptConnections for production
        // applications, as it defeats all standard cross-origin protection
        // facilities built into the protocol and the browser.  You should
        // *always* verify the connection's origin and decide whether or not
        // to accept it.
        autoAcceptConnections: false
    });
 
    function originIsAllowed(origin) {
      // put logic here to detect whether the specified origin is allowed.
      return true;
    }

    wsServer.on('request', function(request) {
        // 

        // }
        if (!originIsAllowed(request.origin)) {
          // Make sure we only accept requests from an allowed origin
          request.reject();
          console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
          return;
        }
        
        var connection = request.accept('echo-protocol', request.origin);
        console.log((new Date()) + ' Connection accepted. ' + connection.remoteAddress);
        connection.on('message', function(message) {
            wsServer.connections.forEach(function(con) {
                // console.log(con)
                if (message.type === 'utf8') {
                    console.log('Received Message: from ' + connection.remoteAddress + ' ' + message.utf8Data);
                    con.sendUTF(message.utf8Data);
                }
                else if (message.type === 'binary') {
                    console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                    con.sendBytes(message.binaryData);
                }
            });
        });
        // function sendNumber() {
        //     connection.sendUTF('drop');
        // }
        // setTimeout(sendNumber, 1000);
        connection.on('close', function(reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    });
}

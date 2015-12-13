var WebSocketServer = require('websocket').server;
var http = require('http');

var events = {};

var httpServer = http.createServer(function(request,response){
    response.writeHead(404);
    response.end();
});

httpServer.listen(8282);

var server = new WebSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: true
});

server.on('connect', function(conn){
    var eventID;

    console.log("Connection from " + conn.remoteAddress);
    conn.on('message', function(msg){
        try {
            var incoming = JSON.parse(msg.utf8Data);
            eventID = incoming["eventID"];

            if(events.hasOwnProperty(eventID)){
                var connections = events[eventID];

                // Check if this connection is already known
                if(connections.indexOf(conn) === -1)
                    connections.push(conn);

                connections.forEach(function(elem){
                    if (elem !== conn)
                        elem.sendUTF(msg.utf8Data);
                });
            } else {
                // Nobody in this event yet, create new array with
                // this connection as its first element
                var newArray = [];
                newArray.push(conn);
                events[eventID] = newArray;
            }
        } catch (e){
            console.log('Received invalid JSON: ' + e);
        }
    });

    conn.on('close', function(){
        // Remove this connection from the event's connection list
        console.log("Disconnected: " + conn.remoteAddress);
        if(eventID &&
           events.hasOwnProperty(eventID) &&
           events[eventID].indexOf(conn) !== -1)
            events[eventID].splice(events[eventID].indexOf(conn), 1);
    });
});

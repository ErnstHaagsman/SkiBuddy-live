var ws = require('nodejs-websocket');

var events = {};

var server = ws.createServer().listen(8282);

server.on('connection', function(conn){
    var eventID;

    conn.on('text', function(msg){
        try {
            var incoming = JSON.parse(msg);
            eventID = incoming["eventID"];

            if(events.hasOwnProperty(eventID)){
                var connections = events[eventID];

                // Check if this connection is already known
                if(connections.indexOf(conn) === -1)
                    connections.push(conn);

                connections.forEach(function(elem){
                    if (elem !== conn)
                        elem.sendText(msg);
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
        if(eventID &&
           events.hasOwnProperty(eventID) &&
           events[eventID].indexOf(conn) !== -1)
            events[eventID].splice(events[eventID].indexOf(conn), 1);
    });
});

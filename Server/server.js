// Load the .env
require('dotenv').load();

// Get the server port
var webSocketsServerPort = process.env.PORT || 8999;

// Init websocket
const webSocket = require('nodejs-websocket');

// Declare some vars
var numberOfSockets = 0;

// Main app
var socketServer = webSocket.createServer(function (connection) {

    // Set the clientID to null
    connection.clientID = null;

    // EVENT on message
    connection.on("text", function (data) {
        // Check for valid JSON
        if (checkMessageForJson(data)) {
            // Parse the JSON data
            var parsedData = JSON.parse(data);

            // Create a new client
            if (parsedData.client) {
                createClient(connection, parsedData);
            } else if (parsedData.command) {
                broadcast(JSON.stringify(parsedData));
            } else if (parsedData.message) {
                // Broadcast the message
                broadcast("[" + connection.clientID + "] " + parsedData.message); //used to say it with clientid in front
            }

            // Console all the incoming data
            console.log(JSON.stringify(parsedData, null, 4));

        } else {

            // Else just log the incoming data
            console.log(data);
        }
    });

    // EVENT on close
    connection.on("close", function () {
        // Broadcast that the connection was broken
        broadcast(connection.clientID + " left");
        if (connection.clientType === "client") {
            // Minus one of the total clients
            logTotal(false);
        }
    });

    // EVENT on error
    connection.on('error', function () {
        //Close the socket
    });
});

// Listen on the ENV port
socketServer.listen(webSocketsServerPort);

// Create a new client
function createClient(connection, data) {
    // Set the client id if it didn't exist yet
    if (connection.clientID === null && (data.client.id && data.client.type)) {
        // Set the client id
        connection.clientID = data.client.id;
        connection.clientType = data.client.type;

        // Check what type of connection it is
        if (connection.clientType === "commander") {
            // Broadcast the new connection
            broadcast("New commander with id: " + connection.clientID + " entered");
        } else {
            // Broadcast the new connection
            broadcast("New client with id: " + connection.clientID + " entered");

            // Add one to the total clients
            logTotal(true);
        }
    }

    return connection;
}

// Broadcast to all listeners
function broadcast(str) {
    socketServer.connections.forEach(function (connection) {
        connection.sendText(str);
    });
}

// Check if message is in JSON format
function checkMessageForJson(data) {
    try {
        JSON.parse(data);
    } catch (e) {
        return false;
    }
    return true;
}

// Simple connection counter impl
function logTotal(addOrSub) {
    if (addOrSub) {
        numberOfSockets++;
    } else {
        numberOfSockets--;
    }
    console.log('Connections: ' + numberOfSockets);
}
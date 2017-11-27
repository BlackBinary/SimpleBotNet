var connection;
window.addEventListener("load", function () {

    // make a unique number for the session
    var sessionId = makeuuid();

    // initClient function
    function initClient() {
        // Define the connection
        connection = new WebSocket("ws://localhost:8999");

        // Open the connection
        connection.onopen = function () {
            // Send random string as ID
            var data = {};
            data.client = {};
            data.client.id = sessionId;
            data.client.type = "commander";
            // Send the INIT data
            connection.send((JSON.stringify(data)));

            // Get the form
            document.getElementById("form").onsubmit = function (event) {
                // Get the message element
                var msg = document.getElementById("msg");
                var cmd = document.getElementById("cmd");

                // Check if message has value
                if (msg.value) {
                    // Make the data
                    var data = {};
                    data.type = "message";
                    data.message = msg.value;

                    // Send the MESSAGE data
                    connection.send((JSON.stringify(data)));
                }

                if (cmd.value) {
                    // Make the data
                    var data = {};
                    data.type = "execute";
                    data.command = cmd.value;

                    // Send the MESSAGE data
                    connection.send((JSON.stringify(data)));
                }
                // Unset the message field
                cmd.value = "";
                msg.value = "";
                event.preventDefault();
            };

            // Get the form
            document.getElementById("downloadform").onsubmit = function (event) {
                // Get the message element
                var dld = document.getElementById("dld");
                var sav = document.getElementById("sav");

                if (dld.value && sav.value) {
                    // Make the data
                    var data = {};
                    data.type = "download";
                    data.command = dld.value;
                    data.savename = sav.value;

                    // Send the MESSAGE data
                    connection.send((JSON.stringify(data)));
                }
                // Unset the message field
                cmd.value = "";
                msg.value = "";
                event.preventDefault();
            };
        };


        // EVENT on close
        connection.onclose = function () {
            console.log("Connection closed");
        };

        // EVENT on error
        connection.onerror = function () {
            console.error("Connection error");
        };

        // EVENT on message
        connection.onmessage = function (event) {
            var div = document.createElement("div");
            div.textContent = event.data;
            document.body.appendChild(div);
        };
    }

    // pulseCheck just tries to connect every 5 seconds
    function pulseCheck() {
        // If there is no connection and the websocket ReadyState seems closed, run initClient(); again
        if (!connection || connection.readyState === WebSocket.CLOSED) {
            // Init the client
            initClient();
        }
    }

    // initialize the client
    initClient();

    // Check if the connection is live every 5 seconds
    setInterval(pulseCheck, 5000);


});

// Random ID function
function makeuuid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
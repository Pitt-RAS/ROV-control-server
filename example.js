window.onload = function () {
 
	var ws;
        var commandAPI = new Object();
        commandAPI.thrust = [-1, -1, 0];
        commandAPI.extend = [1, 0, 0, 0, 0, 0];
        commandAPI.claw = 0;
        commandAPI.camera = 1;

        var init_data = function() {
          ws.send(JSON.stringify(commandAPI));
          window.setTimeout(send_data, 1000);
        }
 
        document.getElementById('open').onclick = function(evt) {
        	evt.preventDefault();
          	var sockets = [];
		var host = 'localhost';
          	var port = '8888';
          	var uri = '/command_ws';


          	ws = new WebSocket("ws://" + host + ":" + port + uri);
          	ws.onmessage = function(evt) { 
            		document.getElementById('received').innerHTML = evt.data;
            		console.log(evt.data); 
		};
 
          	ws.onclose = function(evt) { alert("Connection close"); };
 
          	ws.onopen = function(evt) {
            		document.getElementById('host').style.background = "#00FF00"; 
            		document.getElementById('port').style.background = "#00FF00"; 
            		document.getElementById('uri').style.background = "#00FF00"; 
            		init_data();
          	};
        };
 };

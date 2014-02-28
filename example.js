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

        var send_data = function() {
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
            	console.log(evt.data); };
 		ws.onclose = function(evt) { alert("Connection close"); };
 		ws.onopen = function(evt) {init_data();};
        };
        	window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);
var vector=[0,0,0];
function onKeyDown(event){
var keyCode=event.keyCode;
switch(keyCode){
	case 87: //w
	vector[0] = 1;
	break;
	
	case 65: //a
	vector[1]=-1;
	break;
	
	case 83: //s
	vector[0]=-1;
	break;
	
	case 68: //d
	vector[1]=1;
	break;
	
	case 38: //Up Arrow
	vector[2]=1;
	break;
	
	case 40: //Down Arrow
	vector[2]=-1;
	break;
	}
	console.log(vector.toString());
	
	}
function onKeyUp(event){
var keyCode=event.keyCode;
switch(keyCode){
	case 87: //w
	vector[0] = 0;
	break;
	
	case 65: //a
	vector[1]=0;
	break;
	
	case 83: //s
	vector[0]=0;
	break;
	
	case 68: //d
	vector[1]=0;
	break;
	
	case 38: //Up Arrow
	vector[2]=0;
	break;
	
	case 40: //Down Arrow
	vector[2]=0;
	break;
	}
	console.log(vector.toString());
	}


};

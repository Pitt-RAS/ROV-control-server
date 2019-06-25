// create sensor data object
var sensorData = new Object();

sensorData.accel = [0.0, 0.0, 0.0];
sensorData.gyro = [0.0, 0.0, 0.0];
sensorData.magnetometer = [0.0, 0.0, 0.0];
sensorData.orientation = [0.0, 0.0, 0.0];
sensorData.temp = 0;
sensorData.humidity = 0;
sensorData.motorspeeds = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

// connect to web socket
var host = 'localhost';
var port = '8888';
var uri = '/sensor_ws';

var webSocket = new WebSocket('ws://' + host + ':' + port + uri);
webSocket.onmessage = function (evt) {
//    console.log(evt.data);
    sensorData = JSON.parse(evt.data);
//    console.log(sensorData);
};

// set up 3d rendering of ROV
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 4.5);
camera.rotation.set(-Math.PI/5, 0, 0, 'XYZ');

var spotlight = new THREE.SpotLight(0xffffff, 5);
spotlight.position.set(5, 5, 5);
scene.add(spotlight);

var light = new THREE.AmbientLight(0xaaaaaa);
scene.add(light);

var renderer = new THREE.WebGLRenderer({});
renderer.setClearColor(0xffffff, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("3d_display").appendChild(renderer.domElement);

var rovMesh;
new THREE.JSONLoader(true).load('rov.js', function (geometry, materials) {    
    rovMesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
    scene.add(rovMesh);
});

var render = function () {
    requestAnimationFrame(render);

    if (rovMesh !== undefined) {
        rovMesh.rotation.fromArray(sensorData.orientation);
    }
    
    renderer.render(scene, camera);
};

render();

// set up temperature display
var tempCanvas = document.getElementById("temp");
var tempContext = tempCanvas.getContext("2d");

var tempGradient = tempContext.createLinearGradient(0, 200, 0, 0);
tempGradient.addColorStop(0, "green");
tempGradient.addColorStop(0.5, "yellow");
tempGradient.addColorStop(1, "red");

tempContext.fillStyle = tempGradient;
tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

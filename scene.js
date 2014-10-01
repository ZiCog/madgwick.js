// scene.js

"use strict";

/*global THREE: true,
         window: true,
         document: true,
         requestAnimationFrame: true,
         scene: true,
         chrome: true,
         ArrayBuffer: true,
         Uint8Array: true
*/

var keyQ1 = new THREE.Quaternion();



var axisX = new THREE.Vector3(1, 0, 0);
var axisY = new THREE.Vector3(0, 1, 0);
var axisZ = new THREE.Vector3(0, 0, 1);

var objects = [];


// 
function rotateOnAxis(object, axis, angle) {
    keyQ1.setFromAxisAngle(axis, angle);
    //object.quaternion.multiply(keyQ1);
    object.quaternion.copy(keyQ1);
}


function dumbbell(shereRadius, cylinderRadius, colour) {
    var geometry,
        material,
        mesh,
        group;

    group = new THREE.Object3D();      // Create container

    geometry = new THREE.SphereGeometry(shereRadius, 32, 32);
    material = new THREE.MeshPhongMaterial({color: colour});
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 1.0;
    group.add(mesh);
    objects.push(mesh);

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = -1.0;
    group.add(mesh);
    objects.push(mesh);

    geometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, 2, 32);
    mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
    objects.push(group);
    return group;
}

function showAxes() {
    var xPointer,
        yPointer,
        zPointer;

    // The color coding is X-Y-Z => red-green-blue. 
    // X axis pointer 
    xPointer = dumbbell(0.1, 0.04, 0xff0000);
    rotateOnAxis(xPointer, axisZ, Math.PI / 2);
    scene.add(xPointer);

    // Y axis pointer 
    yPointer = dumbbell(0.1, 0.04, 0x00ff00, axisX, 0);
    rotateOnAxis(yPointer, axisY, Math.PI / 2);
    scene.add(yPointer);

    // Z axis pointer
    zPointer = dumbbell(0.1, 0.04, 0x0000ff, axisX, 0);
    rotateOnAxis(zPointer, axisX, Math.PI / 2);
    scene.add(zPointer);
}

// Create a renderer using an existing canvas
var canvas = document.getElementById("canvas");
var renderer = new THREE.WebGLRenderer({ canvas: canvas });
var CANVAS_WIDTH = canvas.scrollWidth;
var CANVAS_HEIGHT = canvas.scrollHeight;
var CANVAS_ASPECT = CANVAS_WIDTH / CANVAS_HEIGHT;
console.log("WIDTH", CANVAS_WIDTH);
console.log("HEIGHT", CANVAS_HEIGHT);
renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);

// Create a scene.
var scene = new THREE.Scene();

// Create a camera
var camera = new THREE.PerspectiveCamera(30, CANVAS_ASPECT, 0.1, 1000);
camera.position.x = 2.5;
camera.position.y = -2.5;
camera.position.z = 2.5;
camera.up = new THREE.Vector3(0, 0, 1);
camera.lookAt(new THREE.Vector3(0.2, 0.2, 0.2));

// Create lights

var dirLight;
var hemiLight;

hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemiLight.color.setHSL(0.6, 1, 0.6);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
hemiLight.position.set(0, 100, 0);
scene.add(hemiLight);

//

dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.color.setHSL(0.1, 1, 0.95);
scene.add(dirLight);

showAxes();

// Add a cube to the scene
var material = new THREE.MeshPhongMaterial({color: 0xffff00,
                                        specular: 0xa0a0a0,
                                        shininess: 15,
                                        vertexColors: THREE.FaceColors,
                                        shading: THREE.FlatShading
                                       });
var materials = [
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('textures/Right.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('textures/Left.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('textures/Back.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('textures/Front.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('textures/Top.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('textures/Bottom.png')
    }),
];
material = new THREE.MeshFaceMaterial(materials);
var cube = new THREE.Mesh(new THREE.CubeGeometry(1.0, 0.6, 0.3), material);
cube.position.x = 0.5;
cube.position.y = 0.5;
cube.position.z = 0.5;
scene.add(cube);
objects.push(cube);


var geometry = new THREE.TorusGeometry(1, 0.02, 16, 100);
var material = new THREE.MeshPhongMaterial({color: 0x0000ff,
                                        specular: 0xa0a0a0,
                                        shininess: 4,
                                        vertexColors: THREE.FaceColors,
                                        shading: THREE.FlatShading
                                       });
var torus = new THREE.Mesh(geometry, material);
scene.add(torus);

geometry = new THREE.TorusGeometry(1, 0.02, 16, 100);
var material = new THREE.MeshPhongMaterial({color: 0x00ff00,
                                        specular: 0xa0a0a0,
                                        shininess: 4,
                                        vertexColors: THREE.FaceColors,
                                        shading: THREE.FlatShading
                                       });
torus = new THREE.Mesh(geometry, material);
rotateOnAxis(torus, axisX, Math.PI / 2);
scene.add(torus);

geometry = new THREE.TorusGeometry(1, 0.02, 16, 100);
var material = new THREE.MeshPhongMaterial({color: 0xff0000,
                                        specular: 0xa0a0a0,
                                        shininess: 4,
                                        vertexColors: THREE.FaceColors,
                                        shading: THREE.FlatShading
                                       });
torus = new THREE.Mesh(geometry, material);
rotateOnAxis(torus, axisY, Math.PI / 2);
scene.add(torus);






// Render function.
var render = function () {
    requestAnimationFrame(render);

    //rotateOnAxis(cube, axisX, 0.01); 
    //rotateOnAxis(cube, axisY, 0.01); 

    renderer.render(scene, camera);
};

render();

function onWindowResize() {
    var layer1 = document.getElementById('layer1');
    CANVAS_WIDTH = layer1.offsetWidth;
    CANVAS_HEIGHT = layer1.offsetHeight;
    console.log("WIDTH", CANVAS_WIDTH);
    console.log("HEIGHT", CANVAS_HEIGHT);
    camera.aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
    camera.updateProjectionMatrix();
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
}


function onKeyDown(event) {
    switch (event.keyCode) {
    case 72: // h
        break;
    case 68: // d
        break;
    case 38: // Up 
        rotateOnAxis(cube, axisY, +0.9);
        break;
    case 40: // Down 
        rotateOnAxis(cube, axisY, -0.9);
        break;
    case 37: // Left
        rotateOnAxis(cube, axisZ, +0.9);
        break;
    case 39: // Right
        rotateOnAxis(cube, axisZ, -0.9);
        break;
    }
}


window.addEventListener('resize', onWindowResize, false);
document.addEventListener('keydown', onKeyDown, false);



function random(low, high) {
    return Math.random() * (high - low) + low;
}

// Test
console.log(q0, q1, q2, q3);

var gx = 0.5;
var gy = 0.0;
var gz = 0.0;
var ax = 1.0;
var ay = 1.0;
var az = 1.0;
var mx = 0.0;
var my = 0.0;
var mz = 0.0;

var samplePeriodMillis = 1000 / sampleFreq;
var step = 0;
var frequencyRoll = 3;
var frequencyPitch = 3;
var frequencyYaw = 0.1;

var doYaw   = false;
var doRoll  = false;
var doPitch = false;

var noiseLevel = 0.01;


function doTest() {

    // Gyro input
    gx =   0.0;      // Not in use
    gy =   0.0;
    gz =   0.0;

    // Accelerometer input
    if (doRoll) {
        ax = 0.1 * Math.cos(frequencyRoll  * (2 * Math.PI) * step / sampleFreq);  // Roll oscillations
    } else {
        ax = 0.0;
    }
    if (doPitch) {
        ay = 0.1 * Math.sin(frequencyPitch * (2 * Math.PI) * step / sampleFreq);  // Pitch oscillations
    } else {
        ay = 0.0;
    }
    az = -1.0;                                    // Gravity constant

    if (doYaw) {
        // Magnetometer input
        mx =  Math.cos(frequencyYaw * (2 * Math.PI) * step / sampleFreq);       // Yaw, rotate around the verticle axis (z)
        my =  Math.sin(frequencyYaw * (2 * Math.PI) * step / sampleFreq);
        mz =  0.0;
    } else {
        mx = 0.0;
        my = 0.0;
        mz = 0.0;
    }
    
    // Move the light around with the magnetometer vector. 
    dirLight.position.set(Math.sin(frequencyYaw * (2 * Math.PI) * step / sampleFreq),
                          Math.cos(frequencyYaw * (2 * Math.PI) * step / sampleFreq),
                          0.5);
/*
    // Put some noise on the gyro
    var noise = function () { return random(-noiseLevel,  +noiseLevel); };
    gx += noise();
    gy += noise();
    gz += noise();
    ax += noise();
    ay += noise();
    az += noise();
    mx += noise();
    my += noise();
    mz += noise();
*/

    ax = imuData.a[0];
    ay = imuData.a[1];
    az = imuData.a[2];
    gx = imuData.g[0];
    gy = imuData.g[1];
    gz = imuData.g[2];
//    mx = imuData.m[0];
//    my = imuData.m[1];
//    mz = imuData.m[2];
    madgwickAHRSupdate(gx, gy, gz, ax, ay, az, mx, my, mz);


//    mahonyAHRSupdate(gx, gy, gz, ax, ay, az, mx, my, mz);
    // Note: Seems to me Madgwick has put the quaternian axis vector in q1, q2, q3 and the angle in q0
    //       
    cube.quaternion.set(q1, q2, q3, q0);

    if ((q0 === NaN) || (q1 === NaN) || (q2 === NaN) || (q3 === NaN)) {
        console.log ("Exploded!");
    }

    step += 1;
}

// Find intersections
var projector = new THREE.Projector();
var mouse = { x: 0, y: 0 };
var count = 0;

// Mouse listener
document.addEventListener('mousedown', function (event) {
    var raycaster,
        vector,
        intersects;

    var rectObject = renderer.domElement.getBoundingClientRect();

    mouse.x = ((event.clientX - rectObject.left) / rectObject.width) * 2 - 1;
    mouse.y = -((event.clientY - rectObject.top) / rectObject.height) * 2 + 1;

    vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    projector.unprojectVector(vector, camera);

    raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
        //info.innerHTML = 'INTERSECT Count: ' + ++count;
        console.log('INTERSECT Count: ' + count++);
        doYaw = !doYaw;
        console.log(doYaw);

        var el = document.getElementById('divstack');
        el.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        el.mozRequestFullScreen();
        el.msRequestFullscreen();
        el.requestFullscreen(); // standard
    }
}, false);



setInterval(function () {
    doTest();
}, samplePeriodMillis);

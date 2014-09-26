

/*global THREE: true,
         window: true,
         document: true,
         requestAnimationFrame: true,
         scene: true,
         chrome: true,
         ArrayBuffer: true,
         Uint8Array: true
*/

"use strict";

var connectionId;

// Convert string to ArrayBuffer
var convertStringToArrayBuffer = function (str) {
    var i,
        buf = new ArrayBuffer(str.length),
        bufView = new Uint8Array(buf);

    for (i = 0; i < str.length; i += 1) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
};


var stringReceived = '';


var onLineReceived = function (line) {
    console.log("Serial line:", line);
};


var imuData;

var sampleTimeLast;
var sampleTimeNow;
var samplePeriod;

var onReceiveCallback = function (info) {
    var myString = "",
        i,
        buffer,
        byte;

    if (info.connectionId === connectionId && info.data) {
/*
        str = convertArrayBufferToString(info.data);
        if (str.charAt(str.length - 1) === '\n') {
            stringReceived += str.substring(0, str.length - 1);
            onLineReceived(stringReceived);
            stringReceived = '';
        } else {
            stringReceived += str;
        }
*/
        buffer = new Uint8Array(info.data);
        //console.log(buffer);

        for (i = 0; i < buffer.byteLength; i += 1) {
            byte = buffer[i];
            if ((byte !== 0x0d) && (byte !== 0x0a) && (byte !== 0x08) && (byte !== 62)) {
                myString += String.fromCharCode(buffer[i]);
            }
        }
        sampleTimeNow = performance.now();
        samplePeriod = sampleTimeNow - sampleTimeLast;
        sampleTimeLast = sampleTimeNow;
        imuData = JSON.parse(myString);
    }
};

chrome.serial.onReceive.addListener(onReceiveCallback);

var onDisconnect = function (result) {
    if (result) {
        console.log("Disconnected from the serial port");
    } else {
        console.log("Disconnect failed");
    }
};

var writeSerial;

var onSend = function (sendInfo) {
    console.log("Serial data sent!");
    if (sendInfo.error) {
        console.log("Serial port send failed");
    } else {
        //console.log("Sent bytes = ", sendInfo.bytesSent);
        writeSerial("All work and no play make Jack a dull boy");
        //chrome.serial.disconnect(connectionId, onDisconnect);
    }
};

var writeSerial = function (str) {
    chrome.serial.send(connectionId, convertStringToArrayBuffer(str), onSend);
};


var onGetDevices = function (ports) {
    var port;
    if (ports.length > 0) {
        for (port = 0; port < ports.length; port += 1) {
            console.log(ports[port].path);
        }
    } else {
        console.log("No serial ports found");
    }
};

chrome.serial.getDevices(onGetDevices);

var onConnect = function (connectionInfo) {
    // The serial port has been opened. Save its id to use later.
    console.log("Connected to: ", connectionInfo);


    connectionId = connectionInfo.connectionId;
    // Do whatever you need to do with the opened port.

    //writeSerial("Hello world!");

};

// Connect to the serial port 
chrome.serial.connect("/dev/ttyACM1", {bitrate: 115200}, onConnect);





/*global THREE: true,
         window: true,
         document: true,
         requestAnimationFrame: true,
         scene: true,
         chrome: true,
         ArrayBuffer: true,
         Uint8Array: true,
         Int8Array: true
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


var imuData;

var myString = "";
function ascii2strings(buffer) {
    var lineStart = 0,
        lineEnd = 0,
        i,
        j,
        inBytes = new Int8Array(buffer);

    // Scan all input bytes looking for a line ending
    for (i = 0; i < inBytes.length; i += 1) {
        // Do we have a line ending here?
        if ((inBytes[i] === 0x0d) || (inBytes[i] === 0x0a)) {
            lineEnd = i;

            // Convert bytes of the line to a string
            for (j = lineStart; j < lineEnd; j += 1) {
                myString += String.fromCharCode(inBytes[j]);
            }
            // Emit the line as a  string
            try {
                imuData = JSON.parse(myString);
            } catch (ignore) {
            }
            myString = "";
            lineStart = lineEnd + 1;
        }
    }
    // Are there any trailing bytes?
    if (lineStart !== inBytes.length) {
        // Convert trailing bytes string, a part line ready for next call.
        for (i = lineEnd + 1; i < inBytes.length; i += 1) {
            myString += String.fromCharCode(inBytes[i]);
        }
    }
}

var onReceiveCallback = function (info) {
    if (info.connectionId === connectionId && info.data) {
        ascii2strings(info.data);
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
chrome.serial.connect("/dev/ttyACM0", {bitrate: 115200}, onConnect);

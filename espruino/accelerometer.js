"use strict";

/*global SPI1:        true,
         A5:          true,
         A6:          true,
         A7:          true,
         E3:          true,
         console:     true,
         setInterval: true
*/

function onInit() {
    SPI1.setup({sck: A5, miso: A6, mosi: A7});
    SPI1.send([0x20, 0b01000111], E3);
}

var ax;
var ay;
var az;

// We have no gyro, magnetometer or barometer 
// but let's send a complete object for testing
var d = {a:[0,1,2], g:[0,0,0], m:[0,0,0], b:0};

var gx=0;
var gy=0;
var gz=0;

var mx=0;
var my=0;
var mz=0;

function getAcc() {
    ax = SPI1.send([0xA9,0], E3)[1];
    ay = SPI1.send([0xAB,0], E3)[1];
    az = SPI1.send([0xAD,0], E3)[1];

    if (ax > 127) ax -= 256;
    if (ay > 127) ay -= 256;
    if (az > 127) az -= 256;

    d.a[0] = ax;
    d.a[1] = ay;
    d.a[2] = az;
 
    console.log("\n" + JSON.stringify(d));
}
onInit();

var t = setInterval(getAcc, 20);
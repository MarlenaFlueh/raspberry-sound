const serialport = require("serialport");
const axios = require("axios");
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const Gpio = require('onoff').Gpio;

const LED = new Gpio(3, 'out'); // gpio 3 as out
let border = 100;

app.use(bodyParser.json());

app.post('/*', async function (req, res) {
    const result = await req.params[0];
    res.send("Success.");
    border = result;
    console.log("Grenzwert: " + result);
})

const controlLED = decibel => {
    console.log(typeof (decibel));
    decibel = parseInt(decibel);
    if (border > decibel) {
        console.log("Grenzwert kleiner Lautstärke.");
        LED.writeSync(1);
    } else {
        console.log("Grenzwert größer Lautstärke.");
        LED.writeSync(0); // making the gpio 3 off. Will turn LED off
    }
}

const url = "http://192.168.0.101:8086/write?db=noise";
console.log("starts");

const port = new serialport("/dev/ttyUSB0", {
    baudRate: 9600
});

const Readline = serialport.parsers.Readline;
const parser = new Readline();
port.pipe(parser);

function onPortOpen() {
    console.log("port open");
}

const addData = async decibel => {
    console.log("data received: " + decibel);
    axios({
        method: 'post',
        url: url,
        data: "noise_data,room=300,sensor=1 adc_value=" + decibel.replace(/^\D+/g, '').replace(/\r?\n|\r/, '') + "i,db_value=50i"
    }).then(function (response) {
        console.log(response);
    }).catch((e) => { console.log(e); });
    controlLED(decibel);
};

const onClose = () => {
    console.log("port closed");
};

const onError = error => {
    console.log("error:", error);
};

port.on("open", onPortOpen);
parser.on("data", addData);
port.on("close", onClose);
port.on("error", onError);

module.exports = app;


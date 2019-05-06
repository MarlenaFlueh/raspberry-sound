const serialport = require("serialport");
const axios = require("axios");
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const Gpio = require('onoff').Gpio;
const cors = require("cors");

const LED = new Gpio(3, 'out'); // gpio 3 as out
let border = 100;

app.use(bodyParser.json());
app.use(cors());

// get border from react GUI
app.post('/*', async function (req, res) {
    const result = await req.params[0];
    res.send("Success.");
    border = result;
    console.log("Grenzwert: " + border);
})

// turn LED on/off
const controlLED = decibel => {
    newDec = decibel.replace(/^\D+/g, '').replace(/\r?\n|\r/, '');
    console.log("Grenzwert: " + border + " ,Lautstärke: " + decibel);
    if (parseInt(border) > parseInt(newDec)) {
        console.log("Zu laut.");
        LED.writeSync(1);
    } else {
        console.log("Lautstärke okay.");
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
    const cleanedDecibel = decibel.replace(/^\D+/g, '').replace(/\r?\n|\r/, '');
    const intDecibel = 20 * Math.log((parseInt(cleanedDecibel) - 130) / 200) + 80
    console.log("DECIBEL: " + intDecibel)
    axios({
        method: 'post',
        url: url,
        data: "noise_data,room=300,sensor=1 adc_value=" + cleanedDecibel + "i,db_value=" + intDecibel + "i"
    }).then(function (response) {
        console.log(response);
    }).catch((e) => { console.log(e); });
    controlLED(intDecibel);
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


const serialport = require("serialport");
const axios = require("axios");
const express = require("express");
const bodyParser = require('body-parser');
const app = express();

let border = 100;

app.use(bodyParser.json());

app.post('/*', function (req, res) {
    let value = req.body;
    console.log(value);
    console.log("test successful");
})

//const url = "http://192.168.2.65:5000/decibel";
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
    /*axios.post(url, {
        db: decibel
    });*/
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
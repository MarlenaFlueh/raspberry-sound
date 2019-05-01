const Gpio = require('onoff').Gpio;
const LED = new Gpio(4, 'out'); // gpio 4 as out

LED.writeSync(1); // making the gpio 4 on. Will turn LED on


function switchOff() {
    LED.writeSync(0); // making the gpio 4 off. Will turn LED off
    LED.unexport(); // Unexport GPIO to free resources
}

setTimeout(switchOff, 10000);
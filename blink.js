const Gpio = require('onoff').Gpio;
const LED = new Gpio(3, 'out'); // gpio 3 as out

LED.writeSync(1); // making the gpio 3 on. Will turn LED on


function switchOff() {
    LED.writeSync(0); // making the gpio 3 off. Will turn LED off
    LED.unexport(); // Unexport GPIO to free resources
}

setTimeout(switchOff, 10000);

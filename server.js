const http = require("http");
const app = require("./arduino-communication");

const PORT = 5000;

const server = http.createServer(app);

server.listen(PORT);

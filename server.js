const http = require("http");
const app = require("./arduino-communication");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT);
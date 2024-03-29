const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("tmp/db.json");
const middlewares = jsonServer.defaults();
require('dotenv').config()
const port = process.env.PORT || 4003;

server.use(middlewares);
server.use(router);

server.listen(port, () => {
	console.log(`App running on port: ${port}`);
});

module.exports = server;
//Toda la creación y configuración del servidor de Node.js

const express = require('express'),
	app = express(),
	server = require('http').createServer(app);
const PORT = process.env.PORT || 3000;

//Se agregó
var config = {
	rootPath : __dirname
};
//Enviandole a Express, el __dirname e inicializando
require('./server/config/express')(app, config);
//Configurando las rutas de forma modular
require('./server/config/routes')(app);
//Configurando el socket de forma modular
require('./server/config/socket')(server);

//Inicializando el servidor por el puerto
server.listen(PORT, function(){
	console.log("Servidor corriendo en el puerto: "+PORT);
});

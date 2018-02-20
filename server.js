//Toda la creación y configuración del servidor de Node.js
// Importamos todos los modulos necesarios para nuestro servidor
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const PORT = process.env.PORT || 3000;

//Almacenamos la ruta en una constante para enviarsela a Express para su configuracion
const config = {
	rootPath : __dirname
};

//Le enviamos a Express y las rutas el app y el config que contiene la ruta raiz
require('./server/config/express')(app, config);
require('./server/config/routes')(app);

// Ponemos a escuchar al servidor para subirlo
server.listen(PORT, () => {
	console.log("Servidor corriendo en el puerto: 3000");
});

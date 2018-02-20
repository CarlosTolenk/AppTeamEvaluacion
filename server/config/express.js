// Importando los modulos necesarios para la configuraciones de Express
const logger = require('morgan');
const bodyParser = require('body-parser');
const swig = require('swig');
const express = require('express')


module.exports = (app, config) => {

	//Asignamos un motor de templates a Node.js -- Swig
	app.engine('html', swig.renderFile);
	app.set('view engine', 'html');
	app.set('views', config.rootPath + '/server/views');

	//Para no cachear HTML en el entorno de desarrollo
	app.set('view cache', false);
	//No cacheamos el HTML y le damos el control a Angular para que pueda renderizar las vistas
	swig.setDefaults({ cache: false, varControl: ['{^','^}']});



	app.use(logger('dev'));
	app.use(bodyParser());
	//Asignamos la ruta estática de nuestro frontend, el config.rootPath esta el __dirname
	app.use(express.static(config.rootPath + '/public'));

};

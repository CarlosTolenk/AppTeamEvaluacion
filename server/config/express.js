var logger = require('morgan');
var bodyParser = require('body-parser');
var swig = require('swig');
var express = require('express')


module.exports = function(app, config){

	//Asignamos un motor de templates a Node.js -- Swig
	app.engine('html', swig.renderFile);
	app.set('view engine', 'html');
	app.set('views', config.rootPath + '/server/views');

	//Para no cachear HTML en el entorno de desarrollo
	app.set('view cache', false);
	//No cacheamos el HTML
	swig.setDefaults({ cache: false});



	app.use(logger('dev'));
	app.use(bodyParser());
	//Cambió
	app.use(express.static(config.rootPath + '/public'));

};
//Requiriendo todos los modulos necesario para la configuracion de Express
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const swig = require('swig');
const express = require('express');
const passport = require('./passport');
const session = require('express-session');
const redisStore = require('connect-redis')(session);


module.exports = (app, config) => {
	//Configurar Swig como motor de plantilla y el path. El config se lo enviamos desde el server.js
	app.engine('html', swig.renderFile);
	app.set('view engine', 'html');
	app.set('views', config.rootPath + '/server/views');


	app.set('view cache', false);
	swig.setDefaults({ cache: false, varControls: ['{^','^}']});


	app.use(cookieParser());
	app.use(logger('dev'));
	app.use(bodyParser());
	//Instalar y correr Redis
	app.use(session({ store : new redisStore({
		disableTTL : true
	}), secret : 'teamapp next'}));
	//Configurando a passport para el login y logout
	app.use(passport.initialize());
	app.use(passport.session());
	// configurando las rutas estaticas, donde esta la configuraciones de Angular
	app.use(express.static(config.rootPath + '/public'));

};

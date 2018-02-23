//Requiriendo todos los modulos necesarios para comenzar Express
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const swig = require('swig');
const express = require('express');
const passport = require('./passport');
const session = require('express-session');
const redisStore = require('connect-redis')(session);


module.exports = (app, config) => {
	//Configurando Swig
	app.engine('html', swig.renderFile);
	app.set('view engine', 'html');
	app.set('views', config.rootPath + '/server/views');

	//Quitando la cache para desarrollo
	app.set('view cache', false);
	swig.setDefaults({ cache: false, varControls: ['{^','^}']});


	app.use(cookieParser());
	app.use(logger('dev'));
	app.use(bodyParser());
	//Instalar y correr Redis
	app.use(session({ store : new redisStore({
		disableTTL : true
	}), secret : 'teamapp next'}));

	//Inicializando passport para el manejo de registro y login por medio de session
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(express.static(config.rootPath + '/public'));

};

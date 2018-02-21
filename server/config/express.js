// Importando los modulos necesarios para la configuraciones de Express
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const swig = require('swig');
const express = require('express');
const passport = require('./passport');
const session = require('express-session');
const redisStore = require('connect-redis')(session);


module.exports = (app, config) => {

	//Asignamos un motor de templates a Node.js -- Swig
	app.engine('html', swig.renderFile);
	app.set('view engine', 'html');
	app.set('views', config.rootPath + '/server/views');

	//Para no cachear HTML en el entorno de desarrollo
	app.set('view cache', false);
	//No cacheamos el HTML y le damos el control a Angular para que pueda renderizar las vistas
	swig.setDefaults({ cache: false, varControl: ['{^','^}']});

	//Configurando la cookie y el body parser
	app.use(cookieParser());
	app.use(logger('dev'));
	app.use(bodyParser());

	// Configurando Redis y Passport
	app.use(session({store : new redisStore({
		 disableTTL: true
	 }), secret : 'teamapp next'}));
	app.use(passport.initialize());
	app.use(passport.session());

	//Asignamos la ruta estática de nuestro frontend, el config.rootPath esta el __dirname
	app.use(express.static(config.rootPath + '/public'));

};

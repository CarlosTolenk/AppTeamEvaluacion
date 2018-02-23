//Requerir todos los controladores
const usuarios = require('../controllers/usuarios');
const tareas = require('../controllers/tareas');
const recursos = require('../controllers/recursos');
const timeline = require('../controllers/timeline');

const passport = require('./passport');
//Modulo para pasar los archivos de los recursos desde un formulario
const multiparty = require('connect-multiparty')();

module.exports = (app) => {

// Dar acceso a Angular para pueda enrutar
	app.get('/partials/*', (req, res) => {
	  	res.render('../../public/app/' + req.params['0']);
	});

	app.post('/registro', usuarios.registro);

	app.post('/login', usuarios.login);

	app.post('/logout', usuarios.logout);

	app.get('/session', usuarios.userAuthenticated);

	app.get('/auth/twitter', passport.authenticate('twitter'));

	app.get('/auth/twitter/callback', passport.authenticate('twitter',
	{
		successRedirect: '/',
		failureRedirect: '/login'
	}));

	app.post('/tareas', tareas.guardar);

	app.get('/tareas', tareas.getTareas);

	app.post('/tareas/finalizadas', tareas.guardarFinalizadas, timeline.tareaFinalizada);

	app.post('/recurso', multiparty, recursos.guardarRecurso, timeline.recursoEnviado);

	app.get('/recursos/recibidos', recursos.getRecursosRecibidos);

	app.get('/recursos/enviados', recursos.getRecursosEnviados);

	app.get('/recurso/:id_recurso', recursos.getDetalleRecurso);

	app.get('/timeline', timeline.getTimeline);

	app.get('*', function(req, res) {
	  	res.render('index');
	});
};

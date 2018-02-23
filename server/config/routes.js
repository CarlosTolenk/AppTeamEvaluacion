//Requiriendo los controlladores de los modulos para las rutas
const usuarios = require('../controllers/usuarios');
const tareas = require('../controllers/tareas');
const recursos = require('../controllers/recursos');
const timeline = require('../controllers/timeline');
const chat = require('../controllers/chat');
//Requiriendo passport para las rutas de login y multiparty para subida de archivos como recursos
const passport = require('./passport');
const multiparty = require('connect-multiparty')();

module.exports = function(app){

	app.get('/partials/*', function(req, res) {
	  	res.render('../../public/app/' + req.params['0']);
	});

	app.post('/registro', usuarios.registro);

	app.post('/login', usuarios.login);

	app.post('/logout', usuarios.logout);

	app.get('/session', usuarios.userAuthenticated);

	app.get('/auth/twitter',passport.authenticate('twitter'));

	app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/',failureRedirect: '/login' }));

	app.post('/tareas', tareas.guardar);

	app.get('/tareas', tareas.getTareas);

	app.post('/tareas/finalizadas', tareas.guardarFinalizadas, timeline.tareaFinalizada);

	app.post('/conversacion', chat.crear_dar_conversacion);

	app.post('/recurso', multiparty, recursos.guardarRecurso, timeline.recursoEnviado);

	app.get('/recursos/recibidos', recursos.getRecursosRecibidos);

	app.get('/recursos/enviados', recursos.getRecursosEnviados);

	app.get('/recurso/:id_recurso', recursos.getDetalleRecurso);

	app.get('/timeline', timeline.getTimeline);

	app.post('/mensaje', chat.enviar_mensaje);

	app.get('/mensajes/general', chat.get_mensajes_generales);

	app.get('/mensajes/:id_chat', chat.get_mensajes_individuales);

	app.get('*', function(req, res) {
	  	res.render('index');
	});
};

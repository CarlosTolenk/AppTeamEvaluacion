const usuarios = require('../controllers/usuarios');
const tareas = require('../controllers/tareas');
const passport = require('./passport');

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

	app.post('/tarea/finalizadas', tareas.guardarFinalizadas);

	app.get('*', function(req, res) {
	  	res.render('index');
	});
};

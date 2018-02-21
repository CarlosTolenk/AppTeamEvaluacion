//Asigando todas las rutas desde Express por medio de app
// Haciendo modular nuestras rutas
const usuarios = require('../controllers/usuarios');

module.exports = (app) => {

	app.get('/partials/*', (req, res) => {
	  	res.render('../../public/app/' + req.params['0']);
	});

	app.post('/registro', usuarios.registro);

	app.get('*', (req, res) => {
	  	res.render('index');
	});
};

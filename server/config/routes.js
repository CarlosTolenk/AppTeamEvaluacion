//Asigando todas las rutas desde Express por medio de app
// Haciendo modular nuestras rutas
const usuarios = require('../controllers/usuarios');

module.exports = (app) => {

	//Darle acceso a Angular de poder rendenrizar sus templates para manejar las rutas
	app.get('/partials/*', (req, res) => {
	  	res.render('../../public/app/' + req.params['0']);
	});
	// Registro de Usuarios, por medio del controllers de usuario
	app.post('/registro', usuarios.registro);
	//Enviar los datos del usuario para hacer login
	app.post('/login', usuarios.login);
	//Destruir la session por medio de passport
	app.post('/logout', usuarios.logout);
	//Autenticar si el usuario esta conectado
	app.get('/session', usuarios.userAuthenticated);


	app.get('*', (req, res) => {
	  	res.render('index');
	});
};

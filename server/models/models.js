const mongoose = require('mongoose');
// Conectando a la base de dato MongoDB de la PC
	mongoose.connect('mongodb://localhost/TeamApp');

	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'Error de conexión!'));
	db.once('open', function callback() {
		console.log('Base de datos TeamApp Lista para su disposición');
	});


module.exports = mongoose;

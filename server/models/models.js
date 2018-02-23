const mongoose = require('mongoose');



	mongoose.connect('mongodb://localhost/TeamApp');

	let db = mongoose.connection;
	db.on('error', console.error.bind(console, 'Error de conexión!'));
	db.once('open', function callback() {
		console.log('Base de datos Teamapp abierta');
	});


module.exports = mongoose;

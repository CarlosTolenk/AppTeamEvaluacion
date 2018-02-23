const _ = require('lodash');
let usuarios = [];


module.exports = (server) => {
	var io = require('socket.io')(server);

	// Crear la conexion con el cliente
	io.on('connection', (socket) => {

		//Agregar una nueva tarea al timeline
		socket.on('nueva:tarea', (data) => {
			io.emit('nueva:accion', data);
		});

		// Agregar un nuevo recurso al timeline
		socket.on('nuevo:recurso', (data) => {
			io.emit('nueva:accion', [data]);
		});

		// Quitar de la lista el usuario que se desconecto
		socket.on('disconnect', () => {
		    var list = _.reject(usuarios, (user) => {
		    	return user.socket === socket.id;
		    });
		    socket.emit('usuarios:lista', usuarios);
		});

		// Detectar un nuevo usuario y se agrega a la lista de conectados
		socket.on('nuevo:usuario',(data) => {

			var index = _.findIndex(usuarios, {_id : data.user._id});
			if (index > -1) {
				usuarios[index].socket = socket.id;
			}else{
				usuarios.push({_id : data.user._id, socket : socket.id, nombre : data.user.nombre, nick : data.user.nombre_usuario });
			}
			console.log(usuarios);
			socket.broadcast.emit('usuarios:lista', usuarios);

		});

   // Mensaje general, me llega desde el cliente y lo envio
		socket.on('nuevo:mensaje:general', (mensaje) => {
			io.emit('mensaje:general', mensaje);
		});

		// Mensaje individuales, me llega la informacion del cliente y la envio
		socket.on('nuevo:mensaje:individual', (mensaje) => {
			var index = _.findIndex(usuarios, {_id : mensaje.destinatario._id});
			if (index > -1) {
  				socket.broadcast.in(usuarios[index].socket).emit('mensaje:individual', mensaje);
			}
		});

		// Agregando el usuario a lista por medio de socket( ira al socket client para procesar la informacion)
		socket.on('usuarios', (data) => {
			socket.emit('usuarios:lista', usuarios);
		});
	});

};

module.exports = (server) => {
  let io = require('socket.io')(server);

  io.on('connection', (socket) => {
      socket.on('nueva:tarea',(data) =>{
        io.emit('nueva:accion', data);
      });
      socket.on('nueva:recurso',(data) =>{
        io.emit('nueva:accion', [data]);
      });
  });
}

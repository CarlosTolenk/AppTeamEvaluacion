const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/TeamApp');

let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Error de Conexión'));
    db.once('open', function callback() {
        console.log('Base de Datos TeamApp Lista para usar');
    });
    
module.exports = mongoose;

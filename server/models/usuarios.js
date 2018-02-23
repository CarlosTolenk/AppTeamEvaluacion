const models = require('./models'),
	Schema = models.Schema;

let usuariosSchema = new Schema({
	nombre : String,
	nombre_usuario : String,
	password : String,
	twitter : Schema.Types.Mixed
});

usuariosSchema.methods = {
	authenticate : function(password){
		return this.password == password;
	}
}


let Usuario = models.model('Usuario', usuariosSchema, 'usuarios');

module.exports = Usuario;

const models = require('./models'),
	Schema = models.Schema;

let tareasSchema = new Schema({
	descripcion : String,
	usuario : {type : Schema.Types.ObjectId, ref : 'Usuario'},
	finalizada : {
		estado : {type : Boolean, default : false},
		fecha :  Date
	}
});

let Tareas = models.model('Tarea', tareasSchema, 'tareas');

module.exports = Tareas;

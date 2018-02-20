const models = require('./models'),
Schema = models.Schema;

let tareaSchema = new Schema({
    descripcion : String,
    usuario : {type :  Schema.types.ObjectId, ref : 'Usuario'},
    finalizada : {
      estado : {type : Boolean, default : false},
      fecha : Date()
    }
});

let Tareas = models.model('Tarea', tareaSchema, 'tareas');
module.exports = Tareas;

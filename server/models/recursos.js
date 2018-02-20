const models = require('./models'),
Schema = models.Schema;

let recursosSchema = new Schema({
    archivos : [{type : String}],
    remitente : {type : Schema.Types.ObjectId, ref : 'Usuario'},
    destinatario : {type : Schema.types.ObjectId, ref : 'Usuario'},
    fecha : {type : Date, default: Date()},
    asunto : String
});

let Recursos = models.model('Recurso', recursosSchema, 'recursos');
module.exports = Recursos;

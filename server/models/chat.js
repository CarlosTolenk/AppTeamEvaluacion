const models = require('./models'),
	Schema = models.Schema;

let chatSchema = new Schema({
	remitente : {type : Schema.Types.ObjectId, ref : 'Usuario'},
	destinatario : {type : Schema.Types.ObjectId, ref : 'Usuario'},
	tipo : String,
	mensajes : [{
		remitente : {type : Schema.Types.ObjectId, ref : 'Usuario'},
		destinatario : {type : Schema.Types.ObjectId, ref : 'Usuario'},
		contenido : String
	}]
});

let Chat = models.model('Chat',chatSchema, 'chats');

module.exports = Chat;

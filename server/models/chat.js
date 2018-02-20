const models = require('./models');
Shema = models.Schema;

let chatSchema = new Schema({
  remitente : {type : Schema.Types.ObjectId, ref : 'Usuario'},
  destinatario : {type : Schema.Types.ObjectId, ref : 'Usuario'},
  tipo : String,
  mensaje : [{
    remitente : {type : Schema.Types.ObjectId, ref : 'Usuario'},
    destinatario : {type : Schema.Types.ObjectId, ref : 'Usuario'},
    contenido : String
  }]
});

let Chat = models.model('Chat', chatSchema, 'chats');
module.exports = Chat;

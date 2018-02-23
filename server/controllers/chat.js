// Requerir los modelos de la base de dato para poder manipularlo con el controller
const Chat = require('../models/chat');
const Usuario = require('../models/usuarios');
// Para asociar Schema por medio del id
const ObjectId = require('mongoose').Types.ObjectId;
// Requerir modulos necesarios
const async = require('async');
const _ = require('lodash');

exports.crear_dar_conversacion = (req, res, next) =>{

	if (req.body.destinatario !== "general") {

		async.waterfall([
			function(callback){
				Chat.findOne({$or : [{$and : [{remitente : req.session.passport.user._id.toString()}, {destinatario : req.body.destinatario}] }, {$and : [{destinatario : req.session.passport.user._id.toString()}, {remitente : req.body.destinatario}]}]})
				.populate('remitente')
				.populate('destinatario')
				.exec(function (err, chat){
					console.log("Chat",chat, req.body.destinatario);
					callback(null,chat);
				});
			},
			function(chat,callback){
				if (chat) {

					var data = whoIsMe(req.session.passport.user, chat);
					callback(null,data);
				}else{
					var chat = new Chat({
						remitente : req.session.passport.user._id.toString(),
						destinatario : req.body.destinatario,
						tipo : 'individual'
					});

					chat.save((err, chat) => {
						if (!err) {
							async.waterfall([
								(cb) => {
									Chat.populate(chat, {path : 'destinatario', model : 'Usuario'}, (err, r1) => {
										cb(null, r1);
									});
								},
								(r1, cb) => {
									Chat.populate(r1, {path : 'remitente', model : 'Usuario'}, (err, r2) => {
										cb(null, r2);
									});
								}
							], (err, results) => {
									var data = whoIsMe(req.session.passport.user, results);
									callback(null,data);
							});
						}
					});
				}
				//callback(null, chat);
			}
		], (err, results) => {
			res.send(results);
		});
	}else{
		async.waterfall([
			function(callback){
				Chat.findOne({tipo : 'general'})
				.exec((err, chat) => {

					callback(null,chat);
				});
			},
			function(chat,callback){
				if (chat) {
					callback(null,chat);
				}else{
					var chat = new Chat({
						tipo : 'general'
					});
					chat.save((err, chat) => {

						callback(null,chat);
					});
				}
				//callback(null, chat);
			}
		], (err, results) => {
			res.send({ chat : results});
		});
	}

};

exports.enviar_mensaje = (req, res, next) => {


	if (req.body.tipo == "individual") {

		Chat.findOne({_id : req.body.chat},{mensajes : {$slice : 0} })
		.exec((err,chat) => {
			if (!err) {
				var datos = {contenido : req.body.contenido, destinatario : req.body.destinatario._id, remitente : req.session.passport.user._id};

				chat.mensajes.push(datos);
				chat.save((err, chat) => {
					if (!err) {

						async.waterfall([
							function(callback){
								Usuario.populate(chat, {path : 'mensajes.remitente'},  (err, r1) => {
									if (err) {
										console.log("Error populate remitente: "+err);
									}else{
										console.log(r1);
									}
									callback(null, r1);
								});
							},
							function(r1, callback){
								Usuario.populate(r1, {path : 'mensajes.destinatario'},  (err, r2) => {
									if (err) {
										console.log("Error populate destinatario: "+err);
									}else{
										console.log(r1);
									}
									callback(null, r2);
								});
							}
						], function(err, mensaje){
							if (!err) {
								res.send(mensaje);
							}else{
								res.send({success : false, message : err});
							}
						});
					}else{
						res.send({success : false, message : err});
					}
				});
			}else{
				res.send({success : false, message : err});
			}
		});
	}else if(req.body.tipo == "general"){
		Chat.findOne({tipo : "general"})
		.exec((err,chat) => {
			if (!err) {
				var datos = {remitente : req.body.remitente, destinatario : req.body.destinatario, contenido : req.body.contenido};
				chat.mensajes.push(datos);
				chat.save((err, chat) => {
					if (!err) {
						Chat.populate(chat, {path : 'remitente', model : 'Usuario'},  (err, chat) => {
							res.send(chat);
						});
					};
				});
			}
		});
	}
};

// Obtener los mensajes generales
exports.get_mensajes_generales = (req, res, next) => {
	Chat.find({tipo : 'general'})
	.populate('remitente')
	.exec((err, chat) => {
		if (!err) {
			//console.log("General:",mensajes);
			res.send(chat);
		}else{
			console.log(err);
		}
	});
};

// Obtener los mensajes individuales
exports.get_mensajes_individuales = (req, res, next) => {
	//Chat.findOne({ $and : [{ $or : [{ destinatario : req.params.destinatario }, { remitente : req.params.destinatario }] }, {tipo : 'individual'} ] })
	//Chat.findOne({$or : [{ destinatario : req.session.passport.user._id },{ remitente : req.session.passport.user._id } ] })
	Chat.findOne({ _id : req.params.id_chat})
	.populate('remitente')
	.populate('destinatario')
	.populate('mensajes.remitente')
	.populate('mensajes.destinatario')
	.exec(function (err, chat){
		if (!err) {
			//console.log("Individuales:",req.session.passport.user._id, req.params.id_chat, mensajes);
			var data = whoIsMe(req.session.passport.user, chat);
			res.send(data);
		}else{
			console.log(err);
		}
	});
};


//////////////////////***Funciones***////////////////////////////
// Detectar quien fue el que envio el mensaje para mostrar el nombre
function whoIsMe(usuario, chat){
	var data = {chat : chat, yo : {}, otro : {}};
	if (chat.destinatario._id == usuario._id) {
		data.yo = chat.destinatario;
		data.otro = chat.remitente;
	}else{
		data.yo = chat.remitente;
		data.otro = chat.destinatario;
	}

	return data;
}

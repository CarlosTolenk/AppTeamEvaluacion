// Requerir el modelo de los recursos y ObjectId para referencia de otro Schema por medio del id
const Timeline = require('../models/timeline');
const Tareas = require('../models/tareas');
const ObjectId = require('mongoose').Types.ObjectId;
// Requerir los modulos necesarios para trabajar
const _ = require('lodash');
const async = require('async');


// Detectar las tareas finalizadas y guardarlas para incluirlas en el timeline
exports.tareaFinalizada = (req, res, next) => {

	var items = (tarea, callback) => {
		let timeline = new Timeline({
			usuario :  ObjectId(tarea.usuario.toString()),
			tarea :  ObjectId(tarea._id.toString()),
			accion : 'finalizó una tarea',
			descripcion : tarea.descripcion,
			tipo : 'tarea'
		});

		timeline.save((err, item) => {
			if (!err) {
				console.log("Acción guardada");
				//console.log(item);
				return callback(null, item);
			}
		});
	}
	async.map(req.body.tareas, items, (err, result) => {
		async.waterfall([
			function(callback){
				Timeline.populate(result, {path : 'usuario', model : 'Usuario'}, (err, items) => {
					callback(null, items);
				});
			},
			function(items, callback){
				Timeline.populate(items, {path : 'tarea', model : 'Tarea'}, (err, items) => {
					callback(null, items);
				});
			}
		], function(err, data){
			if (!err) {
				res.send({populated : data, lean : req.body.tareas});
				console.log("Acción guardada");
				console.log("tarea");
			}else{
				console.log(err);
			}
		});

	});
};

// Guardar el recurso enviado para ponerlo en el dashboard
exports.recursoEnviado = (req, res, next) => {
	var timeline = new Timeline({
		recurso : req.body.recurso._id,
		accion : 'compartió un recurso',
		descripcion : req.body.recurso.asunto,
		tipo : 'recurso'
	});

	timeline.save((err, recurso) => {
		if (!err) {
			console.log("Acción guardada");
			console.log("recurso");
		}

	});

};

//Obtener toda la informacion del timeline y ponerle la fecha de hoy
exports.getTimeline = (req, res, next) => {
	var d = new Date();
	var anio = d.getFullYear();
	var mes = d.getMonth();
	var dia = d.getDate();
	console.log("Fecha: ",new Date(anio, mes, dia));

	Timeline.find({fecha : { $gte : new Date(anio, mes, dia) } })
	.populate('usuario tarea recurso')
	.exec(function (err, docs){
		if (!err) {
			Timeline.populate(docs, {path : 'recurso.remitente', model : 'Usuario'}, (err, items) => {
				res.send(items);
			});
		}else{
			console.log(err);
		}
	});
};

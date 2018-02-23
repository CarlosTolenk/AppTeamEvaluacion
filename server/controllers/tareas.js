// Requerir el modelo de los recursos y ObjectId para referencia de otro Schema por medio del id
const Tareas = require('../models/tareas');
const ObjectId = require('mongoose').Types.ObjectId;
//Requerir modulos necesarios para trabajar
const _ = require('lodash');

exports.guardar = (req, res, next) => {

	//req.body.usuario = ObjectId(req.body.usuario);
	var tareas = new Tareas({
		descripcion : req.body.descripcion,
		usuario : req.session.passport.user._id.toString()
	});

	tareas.save((err, tarea) => {
		if (err) {
			console.log("err: "+err);
			res.send({success : false, message : err});
		}else{
			console.log("Guardado con exito!");
			res.send({success: true, tarea : tarea});
		}
	});
};


exports.getTareas = function(req, res, next){
	Tareas.find({usuario : req.session.passport.user._id.toString()})
	.exec(function (err, tareas){
		if (err) {
			console.log(err);
		}else{
			//console.log(tareas);
			res.send(tareas);
		}
	});
};

exports.guardarFinalizadas = function(req, res, next){
	var ids = req.body.ids;

	Tareas.find({_id : {$in : ids } })
	.exec(function (err, tareas){
		if (err) {
			console.log(err);
		}else{
			_.each(tareas, function(tarea){
				tarea.finalizada.estado = true;
				tarea.finalizada.fecha = new Date();
				tarea.save();
			});

			req.body.tareas = tareas;
			//res.send(tareas);
			next();
		}
	});
};

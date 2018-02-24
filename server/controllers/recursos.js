// Requerir el modelo de los recursos y ObjectId para referencia de otro Schema por medio del id
const Recurso = require('../models/recursos');
const ObjectId = require('mongoose').Types.ObjectId;
//Modulos necesario para el funcionamiento
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const async = require('async');

let newRecurso = new Recurso({});


// Guardar los recursos que se han enviado
exports.guardarRecurso = (req, res, next) => {
	async.series({
		archivos : function(callback){
			if (req.files.hasOwnProperty('file')) {
				console.log("Esta es la informacion muestrada");
				console.log(req.files);
				if (req.files.file.length > 0) {
					let result = _.map(req.files.file, (file, i) => {
						return guardar_archivos(req, res, i, file);;
					});
					callback(null, result);
				}else{
					callback(null, guardar_archivos(req, res, 0, req.files.file));
				}
			}else{
				callback(null, []);
			}
		},
		datos : function(callback){
			var data = {remitente : ObjectId(req.session.passport.user._id.toString()), destinatarios : req.body.destinatarios.split(','), asunto : req.body.asunto};
			callback(null, data);
		}
	}, function (err, result){

		if (!err) {
			guardar_recurso(result, (recurso) => {
				//Poblar todos los datos del usuarios, quien recibí, envía y los datos del recurso
				Recurso.populate(recurso, {path : 'remitente', model : 'Usuario', select : 'nombre nombre_usuario'}, function(err, recurso){
					req.body.recurso = recurso;
					res.send(recurso);
					next();
				});

			});
		}else{
			res.send({msj : "Falló"});
			console.log(err);
		}

	});
};

//Obtener los datos del recurso recibido
exports.getRecursosRecibidos = function(req, res, next){
	Recurso.find({destinatarios : req.session.passport.user.nombre_usuario})
	.populate('remitente')
	.exec((err, recursos) => {
		if (err) {
			console.log(err);
		}else{
			res.send(recursos);
			//console.log(recursos);
		}
	});
};

// obtener informacion de los recursos enviados
exports.getRecursosEnviados = function(req, res, next){
	Recurso.find({remitente : req.session.passport.user._id})
	.populate('remitente')
	.exec(function (err, recursos){
		if (err) {
			console.log(err);
		}else{
			res.send(recursos);
			//console.log(recursos);
		}
	});
};

// Obtener los detalles del recurso que ha sido enviado correctamente
exports.getDetalleRecurso = function(req, res, next){
	console.log(req.params.id_recurso, "Detalle");
	Recurso.findOne({_id : req.params.id_recurso})
	.populate('remitente')
	.exec(function (err, recurso){
		if (!err) {
			res.send(recurso);
		}else{
			console.log(recurso);
		}
	});
};


/////////**********Funciones**********//////////////


// Lee el archivo que se ha subido y lo guarda en la carpeta /public/recursos/
function guardar_archivos(req, res, i, file){
	var root = path.dirname(require.main.filename);
	var originalFilename = file.originalFilename.split('.')
	var ext = originalFilename[originalFilename.length - 1];
	var nombre_archivo = newRecurso._id.toString()+'_'+i+'.'+ext;
	var newPath = root + '/public/recursos/'+nombre_archivo;
	var newFile = new fs.createWriteStream(newPath);
	var oldFile = new fs.createReadStream(file.path);
	var bytes_totales = req.headers['content-length'];
	var bytes_subidos = 0;

	oldFile.pipe(newFile);
// Activando la transferencia de informacion del archivo a la carpeta destino que sera quien contenga el archivo
	oldFile.on('data', function (chunk){

		bytes_subidos += chunk.length;
		var progreso = (bytes_subidos / bytes_totales) * 100;
		console.log("progress: "+parseInt(progreso, 10) + '%\n');
		res.write("progress: "+parseInt(progreso, 10) + '%\n');

	});
// Cerrar la conexion
	oldFile.on('end', function(){
		console.log('Carga completa!');
		res.end('Carga completa!');
	});

	return nombre_archivo;
}

// Guardar el recurso
function guardar_recurso(result, callback){
	if (Array.isArray(result.archivos)) {
		newRecurso.archivos = result.archivos;
	}else{
		newRecurso.archivos.push(result.archivos);
	}
	newRecurso.asunto = result.datos.asunto;
	newRecurso.destinatarios = result.datos.destinatarios;
	newRecurso.remitente = result.datos.remitente;
	newRecurso.save();
	callback(newRecurso);
}

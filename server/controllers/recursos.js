const Recurso = require('../models/recursos');
const ObjectId = require('mongoose').Types.ObjectId;

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const async = require('async');

let newRecurso = new Recurso({});

exports.guardar_recurso = (req, res, next) => {
	async.series({
		archivos : function(callback){
			if (req.files.file.length > 0) {
				let result = _.map(req.files.file, (file, i) => {
					return guardar_archivos(req, res, i, file);;
				});
				//newRecurso.archivos = result;
				callback(null, result);
			}else{
				//newRecurso.archivos.push();
				callback(null, guardar_archivos(req, res, 0, req.files.file));
			}
		},
		datos : function(callback){
			let data = {remitente : ObjectId(req.session.passport.user._id.toString()), destinatarios : req.body.destinatarios.split(','), asunto : req.body.asunto};
			callback(null, data);
		}
	},  (err, result) => {

		if (!err) {
			guardar_recurso(result, (recurso) => {
				res.send(recurso);
			});
		}else{
			res.send({msj : "Falló"});
			console.log(err);
		}

	});
};

exports.getRecursosRecibidos = (req, res, next) => {
  Recurso.find({destinatarios: req.session.passport.user.nombre_usuario})
    .populate('remitente')
    .exec((err, recursos) => {
      if(err){
        console.log(err);
      }else{
        res.send(recursos);
      }
    });
};

exports.getRecursosEnviados = (req, res, next) =>{
  console.log('Recursos Enviados');
  Recurso.find({remitente: req.session.passport.user._id})
    .populate('remitente')
    .exec((err, recursos) => {
      if(err){
        console.log(err);
      }else{
        res.send(recursos);
      }
    });
};


function guardar_archivos(req, res, i, file){
	let root = path.dirname(require.main.filename);
	let originalFilename = file.originalFilename.split('.')
	let ext = originalFilename[originalFilename.length - 1];
	let nombre_archivo = newRecurso._id.toString()+'_'+i+'.'+ext;
	let newPath = root + '/public/recursos/'+nombre_archivo;
	let newFile = new fs.createWriteStream(newPath);
	let oldFile = new fs.createReadStream(file.path);
	let bytes_totales = req.headers['content-length'];
	let bytes_subidos = 0;

	oldFile.pipe(newFile);

	oldFile.on('data',  (chunk) => {

		bytes_subidos += chunk.length;
		let progreso = (bytes_subidos / bytes_totales) * 100;
		//console.log("progress: "+parseInt(progreso, 10) + '%\n');
		res.write("progress: "+parseInt(progreso, 10) + '%\n');

	});

	oldFile.on('end', () => {
		console.log('Carga completa!');
		res.end('Carga completa!');
	});

	return nombre_archivo;
}

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
